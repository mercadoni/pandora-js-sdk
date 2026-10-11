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
- By-address query reuses the selection set used by `getStoresNearby`, plus `sphereDistance` and `dynamicParams` in both.
- `StoreModel` carries nullable `dynamicParams` and `sphereDistance`.
- Optional `filter` (`LocationFilter`: `city`, `state`, `kind`, all optional strings) on both filters.
- Both types exported from `src/index.ts`; `docs/coverage.md` updated; tests with a mocked client.

## Non-goals

- Client-side ordering or distance conversion; the SDK returns what the backend sends.
- Client-side coordinate validation.

## Decisions

1. **Union type, widened.** `OperationalModel = 'DELIVERY' | 'PICK_AND_COLLECT' | (string & {})`. Autocomplete suggests the two known values, but any `string` still compiles, so existing callers passing a `string` variable are not broken. Rejected: strict `'DELIVERY' | 'PICK_AND_COLLECT'` (compile-time breaking change for callers holding a `string`; would need a major bump); keeping bare `string` (no help to consumers).
2. **Separate method and filter** rather than overloading `getStoresNearby`. Rejected: one method accepting either coordinates or addressId (ambiguous types, harder to document auth difference).
3. **Validation left to the backend.** CLAUDE.md forbids logic in Filter constructors, and range rules for coordinates can drift from the API. Invalid values surface as a thrown `Error` carrying the server errors. Rejected: constructor validation.
4. **`dynamicParams` added to `StoreModel` as a trailing constructor parameter, `unknown | null`, defaulting to `null`** in `fromJson` and the constructor. Safe: existing queries do not select it, so it is `null` for them; the trailing default keeps direct `new StoreModel(...)` calls compiling. Both queries now select it (confirmed on the v2 store type).
6. **`sphereDistance: number | null`** added as a further trailing constructor parameter defaulting to `null`. Server-side distance; unit not documented.
7. **`filter?: LocationFilter`** added to both filters, set only when defined. `LocationFilter` is `{ city?: string; state?: string; kind?: string }`, matching the v2 input type.
5. **`operationalModel` optional on by-address filter**, set only when defined (per CLAUDE.md). `storeReferences` likewise.

## Consumer-facing API

```typescript
import { GetStoresNearbyByAddressFilter } from '@mercadoni/pandora-js-sdk';

const filter = new GetStoresNearbyByAddressFilter({
  clientId: 'my-client',
  addressId: 'addr-1',
  operationalModel: 'DELIVERY', // optional
  storeReferences: ['ref-1'],   // optional
  filter: { city: 'x' },        // optional
});
const stores = await platform.fulfillmentService.getStoresNearbyByAddress(filter);
```

## Types

| Name | Kind | Fields | Notes |
|------|------|--------|-------|
| `GetStoresNearbyFilter` | Filter | `clientId`, `operationalModel: OperationalModel`, `coordinates` | type widened only |
| `GetStoresNearbyByAddressFilter` | Filter | `clientId: string`, `addressId: string`, `operationalModel?: OperationalModel`, `storeReferences?: string[]` | narrows stores by address |
| `StoreModel` | Model | existing fields + `dynamicParams: unknown \| null`, `sphereDistance: number \| null` | `fromJson` defaults to `null` |
| `LocationFilter` | type | `city?`, `state?`, `kind?` | optional `filter` on both nearby filters |

`OperationalModel` lives in `src/core/services/fulfillment/OperationalModel.ts` and is exported as a type.

## GraphQL operations

### `getStoresNearbyByAddress` (query) - verified against the v2 schema

```graphql
query GetStoresNearbyByAddress(
  $addressId: ID!
  $operationalModel: OperationModel
  $clientId: String!
  $storeReferences: [String!]
  $filter: LocationFilter
) {
  getStoresNearbyByAddress(
    addressId: $addressId
    operationalModel: $operationalModel
    clientId: $clientId
    storeReferences: $storeReferences
    filter: $filter
  ) {
    id name code phone state
    cities { name }
    address country operationModel
    serviceFee { PICK_AND_COLLECT DELIVERY }
    usedIfNotCoverage
    sphereDistance dynamicParams
  }
}
```

`getStoresNearbyByCoords` uses the same selection set and also takes `$filter: LocationFilter`.

- Response path: `response.data.getStoresNearbyByAddress` (array). Variables: `filter.query`.
- Verified against the v2 schema: both operations exist; `operationalModel` is optional on both; both return `[Store!]!`; `OperationModel` is `PICK_AND_COLLECT | DELIVERY`, which matches `OperationalModel`; `Store` has `sphereDistance: Float` and `dynamicParams: JSONObject`.
- Behavior: both variants return the stores that cover the location when any do; otherwise all nearby stores, flagged by `usedIfNotCoverage`.
- `graphql_schema.graphql` in this repository is v3 only, so v2 facts come from the backend schema, not from this repo.

## Auth

The coordinates variant also works for guests. The address variant requires an authenticated customer token and an existing address id: call `platform.setToken(...)` first. Supplying the token is the caller's responsibility; the SDK does not enforce it and a rejected call surfaces as a thrown `Error`.

## Errors

Plain `Error` as elsewhere: thrown when `response.data?.getStoresNearbyByAddress` is not an array, with serialized errors. An empty array means no store serves the location.

## Files

**Add:** `GetStoresNearbyByAddressFilter.ts`, `OperationalModel.ts`, `LocationFilter.ts`, `queries/GetStoresNearbyByAddressQuery.ts` (under `src/core/services/fulfillment/`), `src/test/index.ts`.
**Modify:** `GetStoresNearbyFilter.ts`, `FulfillmentService.ts`, `GraphqlFulfillmentService.ts`, `StoreModel.ts`, `src/index.ts`, `docs/coverage.md`.

## Implementation plan

1. Add `OperationalModel` type; use it in both filters.
2. Add by-address filter and query.
3. Extend interface and Graphql service.
4. Add `dynamicParams` and `sphereDistance` to `StoreModel`; select both in both queries.
5. Export from `src/index.ts`; update coverage doc.
6. Add mocked-client tests (success, empty, error, variables, optional fields omitted).
7. `npm run build` and `npm test` pass.

## Acceptance criteria

- [ ] `npm run build` and `npm test` pass.
- [ ] Existing callers passing a `string` operationalModel still compile.
- [ ] `getStoresNearbyByAddress` returns `StoreModel[]`; empty array for no stores; throws on missing data.
- [ ] Optional filter fields (including `filter`) are absent from variables when undefined.
- [ ] Both queries select `sphereDistance` and `dynamicParams`; `StoreModel` maps them with `null` defaults.
- [ ] No direct `fetch`; no private names or URLs in the repo.

## Open questions

Resolved:
- The v2 API exposes `getStoresNearbyByAddress` (and `getStoresNearbyByCoords`) with the signatures above.
- The v2 store type carries a server-side `sphereDistance` and `dynamicParams`; both are selected.
- `operationalModel` is optional in v2.
- The by-address variant requires a customer token.

Remaining unverified:
- Ordering of results for the by-address variant (ascending distance is verified for the coordinates variant only).
- Distance unit: not documented.
