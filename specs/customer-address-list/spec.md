# Spec: Customer address list

**Status:** ready-for-impl
**Owner:** SDK maintainers
**Last updated:** 2026-10-11

## Why

A storefront needs the saved addresses of the logged-in customer. `addressService.getAddresses(filter)` exists, but its query and `AddressModel` omit fields present in the v3 `AddressModel` type (`address.structure`, `removed`, `distanceToStore`), page arguments are not validated, and there is no test or documentation for the logged-in case. Tracked in issue #16.

## Goals

- `GetAddressesQuery` and `AddressModel` expose `address.structure`, `removed` and `distanceToStore` as nullable fields.
- `pageSize` and `currentPage`, when provided, must be integers `>= 1`; invalid values throw before any request is sent.
- An empty list is a valid result; a backend error surfaces as a thrown `Error`.
- `docs/coverage.md` documents that `storeReference` is required and that `customerId` stays optional.
- Tests cover populated, empty and error responses.

## Non-goals

- Making `customerId` required, or removing it.
- Changing how the customer is identified (the backend infers it from the token; see Backend behavior).
- Creating, updating or removing addresses.

## Consumer-facing API

No new exports. Existing: `GetAddressesFilter`, `AddressModel`.

```typescript
const filter = new GetAddressesFilter({ storeReference: 'STORE-1', pageSize: 20, currentPage: 1 });
const addresses = await platform.addressService.getAddresses(filter);
```

## Types

### Inputs / Filters

| Name | Kind | Fields | Notes |
|------|------|--------|-------|
| `GetAddressesFilter` | Filter | `storeReference: string`, `customerId?: string`, `pageSize?: number`, `currentPage?: number` | unchanged shape; `storeReference` required by the schema |

### Models (response shapes)

| Name | Fields | Notes |
|------|--------|-------|
| `AddressModel` | existing fields plus `address: { other: string; structure: unknown } \| null` (structure is `null` when absent), `removed: boolean \| null`, `distanceToStore: number \| null` | has `fromJson`; new fields default to `null` |

## GraphQL operations

### `getAddresses` (query)

```graphql
query GetAddresses($getAddressesInput: GetAddressesInput!) {
  getAddresses(getAddressesInput: $getAddressesInput) {
    id description
    address { other structure }
    addressTwo available latitude longitude city state zipCode
    removed customerId distanceToStore
  }
}
```

- Response path: `response.data.getAddresses` (`[AddressModel!]!`)
- Variables: `{ getAddressesInput: {...} }`

## Files to add / modify

**Modify:**
- `src/core/services/address/queries/GetAddressesQuery.ts`
- `src/core/models/address/AddressModel.ts`
- `src/core/services/address/GraphqlAddressService.ts` — validate paging
- `docs/coverage.md`

**Add:**
- `src/test/index.ts` — smoke harness with a mocked client (no network, no API key)

## Tasks

1. Extend the query and model.
2. Validate `pageSize` / `currentPage` in `GraphqlAddressService.getAddresses` (Filter constructors must stay field copiers per CLAUDE.md).
3. Add tests; update docs; run `npm run build` and `npm test`.

## Acceptance criteria

- [ ] `npm run build` passes.
- [ ] `fromJson` maps the new fields and defaults them to `null` when absent.
- [ ] `pageSize: 0` or `currentPage: 0` (or non-integers) throw without calling the client.
- [ ] Populated, empty and error responses are covered by tests.
- [ ] `docs/coverage.md` states `storeReference` is required and records the `customerId` token rules.

## Backend behavior (confirmed)

- The customer is inferred from the authentication token.
- Customer (ecommerce) token: `customerId` must be omitted; the backend rejects it.
- Agent/call-center token: `customerId` is required.
- Guest token: rejected as unauthorized.
- `storeReference` is required.
- The SDK does not enforce these rules client-side; violations surface as a thrown `Error` from the backend response. `GetAddressesFilter.customerId` is documented accordingly.

## Open questions

- Exact error message/shape of the backend rejection for a guest token or a wrongly sent `customerId`: not verified; the SDK surfaces whatever the backend returns as an `Error`.
