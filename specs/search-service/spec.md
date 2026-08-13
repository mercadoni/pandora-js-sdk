# Spec: SearchService — product search

**Status:** ready
**Owner:** sago
**Last updated:** 2026-05-12

## Why

`ProductService.search` is a stub (`GraphqlProductService.search()` throws `not implemented`). `SearchFilter` and `Search` are empty classes. Consumers cannot search the catalog. This spec implements the full `searchProducts` operation against the backend schema, exposing products, pagination, aggregates, and carousels.

## Goals

- Consumers can call `platform.productService.search(filter)` and get back a `Search` containing matching products, pagination, aggregates, and carousels.
- Filter exposes the full `SearchProductsInput` fields: query terms, pagination, optional filters, optional sort.
- Response is typed: `Search { products, pagination, aggregates, carousels }`.

## Non-goals

- `getSearchSuggestion` / typeahead — separate spec.
- Personalized recommendations (`getSuggestedProducts`, `getProductRecommendations`) — already implemented.
- Caching, retries, logging — owned by `Client`, not services.

## Consumer-facing API

```typescript
import { Platform, SearchFilter } from '@mercadoni/pandora-js-sdk';

const platform = new Platform({ baseUrl, clientId: 'D1' });

const filter = new SearchFilter({
    pageSize: 20,
    currentPage: 1,
    storeReference: '11808',
    search: [{ query: 'milk' }],
    // Optional:
    filters: { brands: ['Alpina'], priceRange: { gte: 1000 } },
    sort: { desc: ['PRICE'] },
    minScore: 0.5,
    googleAnalyticsSessionId: 'abc123',
});

const result = await platform.productService.search(filter);
// result.products: Product[]
// result.pagination: Pagination { page, pages, total }
// result.aggregates: Aggregate[]
// result.carousels: Carousel[]
```

New public exports from `src/index.ts`:
```typescript
export { default as SearchFilter } from './core/services/product/SearchFilter';
export { default as Search } from './core/models/catalog/Search';
export { default as Pagination } from './core/models/catalog/Pagination';
export { default as Aggregate } from './core/models/catalog/Aggregate';
```

## Types

### Filter — `SearchFilter`

File: `src/core/services/product/SearchFilter.ts` (new — replaces the empty stub at `src/core/models/SearchFilter.ts` which is deleted)

Maps to `SearchProductsInput` in the backend schema (line 264). `clientId` is **not** a constructor arg — it is injected by the service at call time (same pattern as `GetProductsBySKUFilter`).

| Field | Type | Required | Notes |
|---|---|---|---|
| `pageSize` | `number` | yes | |
| `currentPage` | `number` | yes | |
| `storeReference` | `string` | yes | |
| `search` | `Array<{ query: string; fields?: Array<{ option: SearchQueryFieldsOption; weight?: number }> }>` | yes | |
| `minScore` | `number` | no | |
| `filters` | `ProductFiltersInput` (plain object — see schema lines 763–802) | no | |
| `sort` | `{ asc?: string[]; desc?: string[] }` | no | |
| `googleAnalyticsSessionId` | `string` | no | |

`SearchQueryFieldsOption` enum values (from schema line 794): `BRAND`, `CATEGORIES_NAME`, `NAME`, `SEARCHKEYWORDS`, `SKU`, `TAGS_NAME`, `TAG_REFERENCE`.

Export a TypeScript type alias `SearchQueryFieldsOption` from `SearchFilter.ts` so consumers can reference it.

### Models

#### `Pagination` — `src/core/models/catalog/Pagination.ts` (fill empty stub)

Schema: `PaginationModel` (line 1485).

```typescript
class Pagination {
    constructor(
        public readonly page: number,
        public readonly pages: number,
        public readonly total: { value: number | null; relation: string | null } | null,
    ) {}

    static fromJson(json: Record<string, any>): Pagination {
        const total = json.total
            ? { value: json.total.value ?? null, relation: json.total.relation ?? null }
            : null;
        return new Pagination(json.page ?? 0, json.pages ?? 0, total);
    }
}
```

#### `Aggregate` — `src/core/models/catalog/Aggregate.ts` (fill empty stub)

Schema: `AggregateModel` (line 1471), `AggregateBucketModel` (line 1478).

```typescript
class AggregateBucket {
    constructor(
        public readonly min: number | null,
        public readonly max: number | null,
        public readonly key: string | null,
        public readonly docCount: number | null,
    ) {}
    static fromJson(json: Record<string, any>): AggregateBucket { … }
}

class Aggregate {
    constructor(
        public readonly name: string,
        public readonly docCount: number | null,
        public readonly isFromSpecification: boolean,
        public readonly buckets: AggregateBucket[],
    ) {}
    static fromJson(json: Record<string, any>): Aggregate { … }
}
```

`AggregateBucket` lives in the same file as `Aggregate` (two classes per file is acceptable when the bucket class is only used by `Aggregate` — but see CLAUDE.md "one class per file" rule). Preferred: `AggregateBucket` in its own file `src/core/models/catalog/AggregateBucket.ts`.

#### `Search` — `src/core/models/catalog/Search.ts` (new, replaces empty stub at `src/core/models/Search.ts`)

Schema: `SearchProductsModel` (line 1463).

```typescript
class Search {
    constructor(
        public readonly products: Product[],
        public readonly pagination: Pagination,
        public readonly aggregates: Aggregate[],
        public readonly carousels: Carousel[],
        public readonly promoted: any,
    ) {}

    static fromJson(json: Record<string, any>): Search { … }
}
```

Reuses existing `Product`, `Pagination`, `Aggregate`, `Carousel` (from `src/core/models/Carousel.ts`).

### GraphQL query

File: `src/core/services/product/queries/SearchProductsQuery.ts`

```graphql
query SearchProducts($searchProductsInput: SearchProductsInput!) {
  searchProducts(searchProductsInput: $searchProductsInput) {
    products {
      # Full CatalogProductModel selection — same fields as GetProductsBySKUQuery
    }
    pagination {
      page
      pages
      total {
        value
        relation
      }
    }
    aggregates {
      name
      docCount
      isFromSpecification
      buckets {
        min
        max
        key
        docCount
      }
    }
    carousels {
      id
      name
      autoplaySpeed
      lazyLoading
      isActive
      createdAt
      updatedAt
      position
      banners {
        id
        name
        webImageUrl
        tabletImageUrl
        appImageUrl
        redirectUrl
        redirectMode
        isActive
      }
    }
    promoted {
      isPromoted
      onLoadBeacon
      onViewBeacon
      onClickBeacon
      onBasketChangeBeacon
      onWishlistBeacon
    }
  }
}
```

Variable at call site: `{ searchProductsInput: filter.query }` (after injecting `clientId`).

### Service method

In `GraphqlProductService.search(filter: SearchFilter): Promise<Search>`:

1. Inject `clientId`: `filter.query['clientId'] = this.clientId;`
2. Call `this.client.query(searchProductsQuery, { searchProductsInput: filter.query })`.
3. Check `response.data?.searchProducts` — if truthy, return `Search.fromJson(response.data.searchProducts)`.
4. Else throw `new Error(\`searchProducts failed: \${JSON.stringify(response.errors || response)}\`)`.

## Files to add / modify / delete

**Add:**
- `src/core/services/product/SearchFilter.ts`
- `src/core/services/product/queries/SearchProductsQuery.ts`
- `src/core/models/catalog/Search.ts`
- `src/core/models/catalog/AggregateBucket.ts`

**Modify:**
- `src/core/models/catalog/Pagination.ts` — fill stub
- `src/core/models/catalog/Aggregate.ts` — fill stub (imports `AggregateBucket`)
- `src/core/services/product/ProductService.ts` — update `SearchFilter` import to new path
- `src/core/services/product/GraphqlProductService.ts` — implement `search`, update imports
- `src/index.ts` — add exports; remove old `SearchFilter` stub export if present (it isn't currently)

**Delete:**
- `src/core/models/SearchFilter.ts` (empty stub)
- `src/core/models/Search.ts` (empty stub — replaced by `models/catalog/Search.ts`)

## Acceptance criteria

- [ ] `npm run build` passes with no TypeScript errors.
- [ ] `platform.productService.search(new SearchFilter({ pageSize: 20, currentPage: 1, storeReference: '11808', search: [{ query: 'milk' }] }))` returns a `Search` instance with `products`, `pagination`, `aggregates`, and `carousels` populated (arrays may be empty; fields must exist and be correctly typed).
- [ ] Consumer can import `SearchFilter`, `Search`, `Pagination`, `Aggregate` from the package root.
- [ ] `SearchFilter` extends `Input` (`filter.query` is accessible and contains the correct shape).
- [ ] `clientId` is not a constructor arg on `SearchFilter` — injected by the service.
- [ ] Service throws with a serialized error message when `response.data.searchProducts` is missing.
- [ ] No direct `fetch` in `GraphqlProductService`.
- [ ] Old stubs `src/core/models/SearchFilter.ts` and `src/core/models/Search.ts` are deleted.
- [ ] Reviewer agent produces zero violations against CLAUDE.md conventions.

## Open questions

None — all fields confirmed against `graphql_schema.graphql`.
