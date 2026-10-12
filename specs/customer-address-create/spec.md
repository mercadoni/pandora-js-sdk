# Spec: Customer address create

**Status:** ready-for-impl
**Owner:** SDK maintainers
**Last updated:** 2026-10-11

## Why

The SDK exposes no address write path, so a storefront cannot save a new customer address. Add `addressService.createAddress(input)` wrapping the v3 `upsertAddress` mutation in create-only mode. Tracked in issue #17. Stacked on the customer-address-list spec (shares the address service, model and docs).

## Goals

- `createAddress(input: CreateAddressInput): Promise<AddressModel>`.
- Never send `id` (create only).
- `addressTwo` is non-null in the schema; the SDK defaults it to an empty string.
- Client-side validation before any request: non-empty `description`, `address.other`, `city`, `storeReference`; `latitude` in [-90, 90]; `longitude` in [-180, 180].
- Throw `createAddress failed: ...` when `data.upsertAddress` is missing.
- Auth: a customer or agent token is required (set with `platform.setToken`); a guest token is rejected as unauthorized by the backend.
- `customerId`: the customer is inferred from the token. Omit it with a customer token; it is required with an agent/call-center token. The SDK forwards it only when provided and does not enforce this client-side.
- `storeReference` must be a store that covers the address. The backend validates server-side that the coordinates are covered by it and rejects the request otherwise. The SDK forwards it verbatim and does not check coverage client-side; the rejection surfaces as `createAddress failed: ...`.
- Errors are plain `Error`; no client-side retry.

## Non-goals

- Updating or removing an address (`id`, `removed`).
- `documentType` (not part of `UpsertAddressInput`; it belongs to customer data).
- `available` (backend-managed; not exposed).

## Consumer-facing API

```typescript
export { default as CreateAddressInput } from './core/services/address/CreateAddressInput';

const input = new CreateAddressInput({
  description: 'Home',
  address: { other: 'Street 1 # 2-3' },
  latitude: 4.6,
  longitude: -74.1,
  city: 'Bogota',
  storeReference: 'STORE-1',
});
const address = await platform.addressService.createAddress(input);
```

## Types

### Inputs / Filters

| Name | Kind | Fields | Notes |
|------|------|--------|-------|
| `CreateAddressInput` | Input | `description: string`, `address: { other: string; structure?: unknown }`, `addressTwo?: string` (default `''`), `latitude: number`, `longitude: number`, `city: string`, `state?: string`, `zipCode?: string`, `storeReference: string`, `customerId?: string` | optional fields set only when defined; `id` never set |

### Models

`AddressModel` (existing, see customer-address-list spec).

## GraphQL operations

### `upsertAddress` (mutation)

```graphql
mutation UpsertAddress($upsertAddressInput: UpsertAddressInput!) {
  upsertAddress(upsertAddressInput: $upsertAddressInput) {
    id description address { other structure } addressTwo available
    latitude longitude city state zipCode removed customerId distanceToStore
  }
}
```

- Response path: `response.data.upsertAddress`
- Variables: `{ upsertAddressInput: input.query.upsertAddressInput }`

## Files to add / modify

**Add:**
- `src/core/services/address/CreateAddressInput.ts`
- `src/core/services/address/mutations/UpsertAddressMutation.ts`

**Modify:**
- `src/core/services/address/AddressService.ts`, `GraphqlAddressService.ts`
- `src/index.ts`, `docs/coverage.md`, `src/test/index.ts`

## Acceptance criteria

- [ ] `npm run build` passes.
- [ ] Success returns an `AddressModel`; request contains no `id`; `addressTwo` is `''` when omitted.
- [ ] Invalid text or coordinates throw without calling the client.
- [ ] Backend error and missing `upsertAddress` throw `createAddress failed: ...`.
- [ ] `CreateAddressInput` exported from the package root.

## Follow-up

A `validateCoverage(validatedCoverageInput: { longitude, latitude, storeReference }) { coverage }` v3 query exists and is not wrapped by the SDK. A wrapper could let clients check coverage before saving. Out of scope here; track separately if wanted.

## Open questions

- Exact error message/shape of the backend rejections (uncovered address, guest token, wrongly sent `customerId`): not verified; the SDK surfaces whatever the backend returns.
