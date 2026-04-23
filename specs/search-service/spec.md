# Spec: SearchService — product search

**Status:** draft
**Owner:** Jorge
**Last updated:** 2026-04-23

## Why

`ProductService.search` is a stub today (`RemoteProductService.search()` throws `not implemented`). `SearchFilter` and `Search` are empty classes. Consumers can't search the catalog, which is table-stakes for any ecommerce storefront. This spec fills in the minimum viable product search: query string + optional category + pagination, returning products with aggregates for faceted UI.

## Goals

- Consumers can call `platform.productService.search(filter)` and get back a `Search` containing matching products, pagination info, and aggregates.
- Filter supports: free-text query, optional category reference, page/limit pagination, optional store reference.
- Response includes enough data for a standard search results page (products list, total count, facets/aggregates).

## Non-goals

- Advanced filtering (price ranges, brand, tags, sort order) — follow-up spec.
- Autocomplete / typeahead endpoint — separate feature.
- Personalization / recommendations.
- Caching. The `Client` is stateless per-call.

## Consumer-facing API

```typescript
import { Platform, SearchFilter } from '@sirosa/ecommerce-js-sdk';

const platform = new Platform({ baseUrl, clientId });
const filter = new SearchFilter({
    query: 'milk',
    storeReference: '11808',
    categoryReference: 'dairy',   // optional
    page: 1,
    limit: 20,
});
const result = await platform.productService.search(filter);
// result: Search { products: Product[], pagination: Pagination, aggregates: Aggregate[] }
```

New exports from `src/index.ts`:
```typescript
export { default as SearchFilter } from './core/services/product/SearchFilter';
export { default as Search } from './core/models/Search';
export { default as Pagination } from './core/models/catalog/Pagination';
export { default as Aggregate } from './core/models/catalog/Aggregate';
```

## Types

### Filter

| Name | Kind | Fields | Notes |
|------|------|--------|-------|
| `SearchFilter` | Filter | `query: string`, `storeReference: string`, `categoryReference?: string`, `page?: number` (default 1), `limit?: number` (default 20) | narrows the product catalog |

`SearchFilter` lives at `src/core/services/product/SearchFilter.ts` (replaces the stub at `src/core/models/SearchFilter.ts` — that stub gets deleted).

### Models

| Name | Fields | Notes |
|------|--------|-------|
| `Search` | `products: Product[]`, `pagination: Pagination`, `aggregates: Aggregate[]` | `fromJson` populates all three |
| `Pagination` | `page: number`, `limit: number`, `total: number`, `pages: number` | fills the empty stub |
| `Aggregate` | `key: string`, `label: string`, `buckets: { value: string; count: number }[]` | fills the empty stub |
| `Product` | already exists at `src/core/models/catalog/Product.ts` | reuse |

## GraphQL operations

### `searchProducts` (query)

```graphql
query SearchProducts($searchInput: SearchProductsInput!) {
  searchProducts(searchInput: $searchInput) {
    products {
      # Same selection set as existing Product.fromJson expects.
      # Reference src/core/models/catalog/Product.ts for the full field list.
    }
    pagination {
      page
      limit
      total
      pages
    }
    aggregates {
      key
      label
      buckets { value count }
    }
  }
}
```

- Response path: `response.data.searchProducts`
- Variables: `{ searchInput: filter.query }`

(Confirm exact GraphQL schema against the backend before implementing — adjust field names if the API uses different ones.)

## Files to add / modify

**Add:**
- `src/core/services/product/SearchFilter.ts` (new, follows Input template, `extends Input`)
- `src/core/services/product/queries/SearchProductsQuery.ts`
- `src/core/models/Search.ts`

**Modify:**
- `src/core/models/catalog/Pagination.ts` — fill stub with fields + `fromJson`
- `src/core/models/catalog/Aggregate.ts` — fill stub with fields + `fromJson`
- `src/core/services/product/ProductService.ts` — add `search(filter: SearchFilter): Promise<Search>`
- `src/core/services/product/RemoteProductService.ts` — implement `search` (stop throwing not-implemented)
- `src/core/Platform.ts` — ensure `productService` is instantiated (currently not wired in)
- `src/index.ts` — add exports listed above
- `src/test/index.ts` — add a search smoke call

**Delete:**
- `src/core/models/SearchFilter.ts` (stub, superseded by service-local file per CLAUDE.md file organization)

## Tasks

1. Fill `Pagination` and `Aggregate` models with fields + `fromJson`.
2. Create `Search` model with `fromJson` that parses `products`, `pagination`, `aggregates`.
3. Create `SearchFilter` per CLAUDE.md Filter/Input template.
4. Add `SearchProductsQuery` GQL string.
5. Extend `ProductService` interface with `search`.
6. Implement `search` in `RemoteProductService` — remove the `not implemented` throw.
7. Wire `productService` into `Platform` if not already.
8. Export new public types from `src/index.ts`; remove old `SearchFilter` stub export if any.
9. Add a smoke search call to `src/test/index.ts`.
10. `npm run build` must pass clean.

## Acceptance criteria

- [ ] `npm run build` passes with no errors.
- [ ] `platform.productService.search(new SearchFilter({ query: 'milk', storeReference: '11808' }))` returns a `Search` instance with `products`, `pagination`, and `aggregates` populated (arrays may be empty but fields must exist).
- [ ] Consumer can import `SearchFilter`, `Search`, `Pagination`, `Aggregate` from the package root.
- [ ] `SearchFilter` extends `Input` (verifiable by type-check: `filter.query` is accessible).
- [ ] Service method throws with a helpful message when `response.data.searchProducts` is missing.
- [ ] No direct `fetch` in `RemoteProductService` — all calls go through `GraphqlClient`.
- [ ] Old stub `src/core/models/SearchFilter.ts` is deleted, not left dangling.
- [ ] Reviewer agent produces zero violations against CLAUDE.md conventions.

## Open questions

- Exact GraphQL schema for `searchProducts` — need to confirm against the backend (field names for aggregates especially).
- Should `storeReference` be required or optional? Currently required in this spec; revisit if the API supports store-less global search.
- Does the API return aggregates by default or does it need a flag/selection to include them?
