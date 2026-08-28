# Spec: FulfillmentService

**Status:** ready-for-impl
**Owner:** santiago aguilar
**Last updated:** 2026-08-26

## Why

Pandora's store-selector feature needs to query operational models, nearby stores (delivery), and pick-and-collect stores filtered by state/city. These operations live on the `/api/v2` endpoint of the same instaleap backend (not the `/api/v3` catalog endpoint the SDK already uses). This spec adds `FulfillmentService` as a first-class service on `Platform`, wired to a dedicated `fulfillmentBaseUrl`.

## Goals

- `platform.fulfillmentService` exposes five query methods covering the full store-selector flow.
- `Platform` accepts an optional `fulfillmentBaseUrl` config field (defaults to `baseUrl` with `/v3` replaced by `/v2`).
- All five operations go through `GraphqlClient` — no direct `fetch`.
- New Input/Filter and Model types exported from `src/index.ts`.
- `npm run build` passes clean.

## Non-goals

- Mutations (store selection is read-only on this service).
- `uncoveredFilters` path for states/cities (used only by the dropped manual-address flow).
- Auth/token handling on the fulfillment client (operations are public).
- Caching.

## Consumer-facing API

```typescript
import { Platform, GetOperationalModelsFilter, GetStoresNearbyFilter,
  GetPCStoresFilter, GetStatesFilter, GetCitiesFilter,
  StoreModel, StateModel, CityModel } from '@mercadoni/pandora-js-sdk';

const platform = new Platform({
  baseUrl: 'https://nextgentheadless.instaleap.io/api/v3',
  fulfillmentBaseUrl: 'https://nextgentheadless.instaleap.io/api/v2', // optional
  clientId: 'acuenta-cl',
  apiKey: '...',
});

// Operational models
const opFilter = new GetOperationalModelsFilter({ clientId: 'acuenta-cl' });
const { operationalModels } = await platform.fulfillmentService.getOperationalModels(opFilter);
// operationalModels: string[]  e.g. ['DELIVERY', 'PICK_AND_COLLECT']

// Nearby stores (delivery)
const nearbyFilter = new GetStoresNearbyFilter({
  clientId: 'acuenta-cl',
  operationalModel: 'DELIVERY',
  coordinates: { lat: -33.45, lng: -70.65 },
});
const stores: StoreModel[] = await platform.fulfillmentService.getStoresNearby(nearbyFilter);

// P&C stores
const pcFilter = new GetPCStoresFilter({
  clientId: 'acuenta-cl',
  filterState: 'LA ARAUCANÍA',
  filterCity: 'LAUTARO',
});
const pcStores: StoreModel[] = await platform.fulfillmentService.getPCStores(pcFilter);

// States
const statesFilter = new GetStatesFilter({
  clientId: 'acuenta-cl',
  operationalModel: 'PICK_AND_COLLECT',
});
const states: StateModel[] = await platform.fulfillmentService.getStates(statesFilter);

// Cities
const citiesFilter = new GetCitiesFilter({
  clientId: 'acuenta-cl',
  operationalModel: 'PICK_AND_COLLECT',
  stateName: 'LA ARAUCANÍA',
});
const cities: CityModel[] = await platform.fulfillmentService.getCities(citiesFilter);
```

## Types

### Filters

| Name | Fields | GraphQL variables produced |
|------|--------|---------------------------|
| `GetOperationalModelsFilter` | `clientId: string` | `{ clientId }` |
| `GetStoresNearbyFilter` | `clientId: string`, `operationalModel: string`, `coordinates: { lat: number; lng: number }` | `{ clientId, operationalModel, coordinates }` |
| `GetPCStoresFilter` | `clientId: string`, `filterKind?: string`, `filterState?: string`, `filterCity?: string`, `storeReferences?: string[]` | `{ clientId, filter: { kind?, state?, city? }, storeReferences? }` |
| `GetStatesFilter` | `clientId: string`, `operationalModel: string` | `{ coverageFilters: { clientId, operationalModel } }` |
| `GetCitiesFilter` | `clientId: string`, `operationalModel: string`, `stateName: string` | `{ coverageFilters: { clientId, operationalModel, stateName } }` |

All extend `Input` base class. Use `this.query` to store the variable shape.

### Models

| Name | Fields |
|------|--------|
| `StoreModel` | `id: string`, `code: string`, `name: string`, `address: string`, `phone: string \| null`, `state: string \| null`, `cities: { name: string }[]`, `country: string \| null`, `operationModel: string \| null`, `serviceFee: { PICK_AND_COLLECT: number; DELIVERY: number } \| null`, `usedIfNotCoverage: boolean \| null` |
| `StateModel` | `id: string`, `name: string`, `active: boolean \| null` |
| `CityModel` | `id: string`, `name: string`, `code: string \| null`, `timeZone: string \| null` |

All have `static fromJson(json)` factory. Never throw on missing optional fields — default to `null`.

## GraphQL operations

### `getOperationalModelByClient` (query)

```graphql
query GetOperationalModelByClient($clientId: String!) {
  getOperationalModelByClient(clientId: $clientId) {
    operationalModels
  }
}
```

- Variables shape: `{ clientId: filter.query.clientId }`
- Response path: `response.data.getOperationalModelByClient`
- Service return type: `{ operationalModels: string[] }`

### `getStoresNearbyByCoords` (query)

```graphql
query GetStoresNearbyByCoords(
  $clientId: String!
  $operationalModel: OperationModel!
  $coordinates: Coords!
) {
  getStoresNearbyByCoords(
    clientId: $clientId
    operationalModel: $operationalModel
    coordinates: $coordinates
  ) {
    id name code phone state
    cities { name }
    address country dynamicParams operationModel
    serviceFee { PICK_AND_COLLECT DELIVERY }
    usedIfNotCoverage
  }
}
```

- Variables shape: `filter.query` (already `{ clientId, operationalModel, coordinates }`)
- Response path: `response.data.getStoresNearbyByCoords`
- Service return type: `StoreModel[]`

### `getPCStoresByClient` (query)

```graphql
query GetPCStoresByClient(
  $clientId: String!
  $filter: LocationFilter
  $storeReferences: [String!]
) {
  getPCStoresByClient(
    clientId: $clientId
    filter: $filter
    storeReferences: $storeReferences
  ) {
    id name code phone state
    cities { name }
    address country dynamicParams operationModel
    serviceFee { PICK_AND_COLLECT DELIVERY }
    usedIfNotCoverage
  }
}
```

- Variables shape: `{ clientId, filter: { kind?, state?, city? }, storeReferences? }` — built by `GetPCStoresFilter`
- Response path: `response.data.getPCStoresByClient`
- Service return type: `StoreModel[]`

### `getStates` (query)

```graphql
query GetStates(
  $coverageFilters: CoverageFilterStateInput
  $uncoveredFilters: UncoveredFiltersStateInput
  $storeReferences: [String!]
) {
  getStates(
    coverageFilters: $coverageFilters
    uncoveredFilters: $uncoveredFilters
    storeReferences: $storeReferences
  ) {
    id active name
  }
}
```

- Variables shape: `{ coverageFilters: { clientId, operationalModel } }` — built by `GetStatesFilter`
- Response path: `response.data.getStates`
- Service return type: `StateModel[]`

### `getCities` (query) — note: GQL op is `getCities`, not `getCitiesByState`

```graphql
query GetCities(
  $coverageFilters: CoverageFilterCityInput
  $uncoveredFilters: UncoveredFiltersCityInput
) {
  getCities(
    coverageFilters: $coverageFilters
    uncoveredFilters: $uncoveredFilters
  ) {
    id name code timeZone
  }
}
```

- Variables shape: `{ coverageFilters: { clientId, operationalModel, stateName } }` — built by `GetCitiesFilter`
- Response path: `response.data.getCities`
- Service return type: `CityModel[]`

## Files to add / modify

**Add:**
- `src/core/models/fulfillment/StoreModel.ts`
- `src/core/models/fulfillment/StateModel.ts`
- `src/core/models/fulfillment/CityModel.ts`
- `src/core/services/fulfillment/FulfillmentService.ts`
- `src/core/services/fulfillment/GraphqlFulfillmentService.ts`
- `src/core/services/fulfillment/GetOperationalModelsFilter.ts`
- `src/core/services/fulfillment/GetStoresNearbyFilter.ts`
- `src/core/services/fulfillment/GetPCStoresFilter.ts`
- `src/core/services/fulfillment/GetStatesFilter.ts`
- `src/core/services/fulfillment/GetCitiesFilter.ts`
- `src/core/services/fulfillment/queries/GetOperationalModelsQuery.ts`
- `src/core/services/fulfillment/queries/GetStoresNearbyQuery.ts`
- `src/core/services/fulfillment/queries/GetPCStoresByClientQuery.ts`
- `src/core/services/fulfillment/queries/GetStatesQuery.ts`
- `src/core/services/fulfillment/queries/GetCitiesQuery.ts`

**Modify:**
- `src/core/Platform.ts` — add `fulfillmentBaseUrl?: string` to constructor config; create `fulfillmentClient = new Client(fulfillmentUrl, ...)` where `fulfillmentUrl = config.fulfillmentBaseUrl ?? config.baseUrl.replace('/v3', '/v2')`; set same `dpl-api-key` header on it; wire `this.fulfillmentService = new GraphqlFulfillmentService(this.fulfillmentClient)`
- `src/index.ts` — export all new Filter, Model, and Service types

## Acceptance criteria

- [ ] `npm run build` passes with no TypeScript errors.
- [ ] Consumer can `import { StoreModel, GetStoresNearbyFilter } from '@mercadoni/pandora-js-sdk'` with correct types.
- [ ] `platform.fulfillmentService` is accessible after constructing `Platform`.
- [ ] `Platform` constructed without `fulfillmentBaseUrl` defaults to `baseUrl` with `/v3` → `/v2`.
- [ ] No direct `fetch` in service files — all calls via `GraphqlClient`.
- [ ] All models have `fromJson` and never throw on missing optional fields.
- [ ] No `*Filter` suffix on mutation payloads (there are none here — all are filters).
- [ ] `GetPCStoresFilter` builds the nested `filter: { kind?, state?, city? }` object correctly (only present keys are set).

## Open questions

None — all decisions confirmed.
