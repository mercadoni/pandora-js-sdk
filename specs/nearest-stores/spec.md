# Spec: nearest-stores (getStoresNearbyByAddress + typed operational model)

**Status:** draft
**Owner:** santiago aguilar
**Last updated:** 2026-10-11

Refs issue #15.

## Why

A storefront needs to list the stores that can serve a shopper for an operational model (`DELIVERY` or `PICK_AND_COLLECT`), either from coordinates or from a saved address. `getStoresNearby` covers coordinates only, types `operationalModel` as a free `string`, and there is no by-address variant.

## Goals

- `GetStoresNearbyFilter.operationalModel` is typed as a union of the known models, without breaking existing callers.
- New `GetStoresNearbyByAddressFilter` and `fulfillmentService.getStoresNearbyByAddress(filter): Promise<StoreModel[]>`.
- By-address query reuses the selection set already used by `getStoresNearby`.
- `StoreModel` carries a nullable `dynamicParams`.
- Both types exported from `src/index.ts`; `docs/coverage.md` updated; tests with a mocked client.

## Non-goals

- Distance or ordering guarantees (neither is selected today).
- Client-side coordinate validation.
- Selecting `dynamicParams` in any query (see open questions).

## Decisions

1. **Union type, widened.** `OperationalModel = 'DELIVERY' | 'PICK_AND_COLLECT' | (string & {})`. Autocomplete suggests the two known values, but any `string` still compiles, so existing callers passing a `string` variable are not broken. Rejected: strict `'DELIVERY' | 'PICK_AND_COLLECT'` (compile-time breaking change for callers holding a `string`; would need a major bump); keeping bare `string` (no help to consumers).
2. **Separate method and filter** rather than overloading `getStoresNearby`. Rejected: one method accepting either coordinates or addressId (ambiguous types, harder to document auth difference).
3. **Validation left to the backend.** CLAUDE.md forbids logic in Filter constructors, and range rules for coordinates can drift from the API. Invalid values surface as a thrown `Error` carrying the server errors. Rejected: constructor validation.
4. **`dynamicParams` added to `StoreModel` as a trailing constructor parameter, `unknown | null`, defaulting to `null`** in `fromJson` and the constructor. Safe: existing queries do not select it, so it is `null` for them; the trailing default keeps direct `new StoreModel(...)` calls compiling. It is NOT added to any selection set until verified against the v2 schema.
5. **`operationalModel` optional on by-address filter**, set only when defined (per CLAUDE.md). `storeReferences` likewise.

## Consumer-facing API

```typescript
import { GetStoresNearbyByAddressFilter } from '@mercadoni/pandora-js-sdk';

const filter = new GetStoresNearbyByAddressFilter({
  clientId: 'my-client',
  addressId: 'addr-1',
  operationalModel: 'DELIVERY', // optional
  storeReferences: ['ref-1'],   // optional
});
const stores = await platform.fulfillmentService.getStoresNearbyByAddress(filter);
```

## Types

| Name | Kind | Fields | Notes |
|------|------|--------|-------|
| `GetStoresNearbyFilter` | Filter | `clientId`, `operationalModel: OperationalModel`, `coordinates` | type widened only |
| `GetStoresNearbyByAddressFilter` | Filter | `clientId: string`, `addressId: string`, `operationalModel?: OperationalModel`, `storeReferences?: string[]` | narrows stores by address |
| `StoreModel` | Model | existing fields + `dynamicParams: unknown \| null` | `fromJson` defaults to `null` |

`OperationalModel` lives in `src/core/services/fulfillment/OperationalModel.ts` and is exported as a type.

## GraphQL operations

### `getStoresNearbyByAddress` (query) - UNVERIFIED

```graphql
query GetStoresNearbyByAddress(
  $addressId: ID!
  $operationalModel: OperationModel
  $clientId: String!
  $storeReferences: [String!]
) {
  getStoresNearbyByAddress(
    addressId: $addressId
    operationalModel: $operationalModel
    clientId: $clientId
    storeReferences: $storeReferences
  ) {
    id name code phone state
    cities { name }
    address country operationModel
    serviceFee { PICK_AND_COLLECT DELIVERY }
    usedIfNotCoverage
  }
}
```

- Response path: `response.data.getStoresNearbyByAddress` (array). Variables: `filter.query`.
- The v2 schema is not in this repository (`graphql_schema.graphql` is v3 only), so the operation name, argument nullability and return type are taken from the issue and have not been checked against the backend.

## Auth

The coordinates variant works with the API key. The address variant needs a customer token (the address belongs to a customer): call `platform.setToken(...)` first. The SDK does not enforce this; the backend rejects unauthenticated calls and the SDK throws.

## Errors

Plain `Error` as elsewhere: thrown when `response.data?.getStoresNearbyByAddress` is not an array, with serialized errors. An empty array means no store serves the location.

## Files

**Add:** `GetStoresNearbyByAddressFilter.ts`, `OperationalModel.ts`, `queries/GetStoresNearbyByAddressQuery.ts` (under `src/core/services/fulfillment/`), `src/test/index.ts`.
**Modify:** `GetStoresNearbyFilter.ts`, `FulfillmentService.ts`, `GraphqlFulfillmentService.ts`, `StoreModel.ts`, `src/index.ts`, `docs/coverage.md`.

## Implementation plan

1. Add `OperationalModel` type; use it in both filters.
2. Add by-address filter and query.
3. Extend interface and Graphql service.
4. Add `dynamicParams` to `StoreModel`.
5. Export from `src/index.ts`; update coverage doc.
6. Add mocked-client tests (success, empty, error, variables, optional fields omitted).
7. `npm run build` and `npm test` pass.

## Acceptance criteria

- [ ] `npm run build` and `npm test` pass.
- [ ] Existing callers passing a `string` operationalModel still compile.
- [ ] `getStoresNearbyByAddress` returns `StoreModel[]`; empty array for no stores; throws on missing data.
- [ ] Optional filter fields are absent from variables when undefined.
- [ ] No direct `fetch`; no private names or URLs in the repo.

## Open questions

- **UNVERIFIED against the backend:** does the v2 API expose `getStoresNearbyByAddress` with this signature and return type? If not, this issue is blocked on a backend prerequisite. A v2 introspection is required before release.
- Does it return a distance or guarantee ordering? Not selected today.
- Is `dynamicParams` available on the v2 store type for these operations? Until confirmed it is modeled but not selected.
- Is `operationalModel` really optional in v2 (issue implies yes)?
