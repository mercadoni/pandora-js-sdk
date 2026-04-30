# Spec: ProductService — single product, suggested products, recommendations

**Status:** ready-for-impl
**Owner:** Jorge
**Last updated:** 2026-04-30

## Why

Pandora needs to render a Product Detail Page (PDP). Today the SDK has no way to fetch a single product, no way to fetch "you may also like" suggestions, and no way to fetch recommendation rails — `RemoteProductService.search` is the only declared method and it's a stub. `productService` is also not even constructed in `Platform`. Without these calls, the PDP either scrapes data out of the home query (brittle) or bypasses the SDK with raw GraphQL (fragments the contract).

This spec adds the three product-detail reads the PDP needs, all on the same `productService` plumbing:

1. `getProductsBySKU` — fetches one or more products by SKU (the PDP uses it with one SKU).
2. `getSuggestedProducts` — "you may also like" suggestions for a given SKU.
3. `getProductRecommendations` — recommendation rails by type (`FREQUENTLY_BOUGHT_TOGETHER`, `TRENDING`, `RECOMMENDED_FOR_YOU`, etc.).

All three operations are confirmed against `graphql_schema.graphql` at the repo root (lines 238, 250, 256 for inputs; lines 2671, 2675, 2676 for the Query root entries). Operation names, input shapes, and return types in this spec come from the schema, not from guesses.

## Goals

- Consumers can call `platform.productService.getProductsBySKU(filter)` and get back `Product[]` (one entry per SKU passed).
- Consumers can call `platform.productService.getSuggestedProducts(filter)` and get back `Product[]`.
- Consumers can call `platform.productService.getProductRecommendations(filter)` and get back `Product[]`.
- `productService` is exposed on `Platform` (currently unwired).
- All three calls populate `clientId` from the `Platform` constructor automatically (mirrors `GraphqlHomeService.home`).
- A backend error or empty `data.<op>` surfaces as a thrown `Error` whose message contains the serialized server response — same pattern as every other service in the SDK.
- Reuse the existing `Product` model and `Product.fromJson`. The schema's `CatalogProductModel` is a near-superset of the home product shape; `Product.fromJson` already tolerates missing optional fields, so it absorbs both shapes without changes.

## Non-goals

- Keeping `RemoteProductService.search` working — it stays a stub for `specs/search-service/spec.md` to fill.
- Per-store stock variation logic, caching, retries, prefetch helpers — `Client` is stateless per call.
- Any change to `Product.ts` or `Product.fromJson`. If the implementer finds a real field-mapping bug while smoke-testing, file a follow-up; do not fix it in this spec.
- Fixing the unrelated stubs/bugs in `CLAUDE.md` "Known stubs & bugs" (`Home.fromJson` comma bug, broken `WidgetData` import, etc.).
- Modeling `CatalogProductModel` separately. Reusing `Product` keeps the spec scoped; if a future spec needs strict schema-aligned typing, that's its job.

## Consumer-facing API

```typescript
import {
    Platform,
    GetProductsBySKUFilter,
    GetSuggestedProductsFilter,
    GetProductRecommendationsFilter,
    ProductRecommendationType,
    Product,
} from '@sirosa/ecommerce-js-sdk';

const platform = new Platform({
    baseUrl: 'https://nextgentheadless.instaleap.io/api/v3',
    clientId: 'D1',
    apiKey: process.env.DPL_API_KEY!,
});

// 1. Fetch the main PDP product
const main = await platform.productService.getProductsBySKU(
    new GetProductsBySKUFilter({ skus: ['12008102'], storeReference: '12165' })
);
const product = main[0];

// 2. "También puede interesarte" carousel
const suggestions = await platform.productService.getSuggestedProducts(
    new GetSuggestedProductsFilter({ sku: '12008102', storeReference: '12165' })
);

// 3. Recommendation rail (e.g. trending)
const trending = await platform.productService.getProductRecommendations(
    new GetProductRecommendationsFilter({
        type: ProductRecommendationType.TRENDING,
        storeReference: '12165',
        data: {},                         // schema requires this; pass {} when no extra context
        cartId: 'optional-cart-id',       // optional
    })
);
```

New exports added to `src/index.ts` under a new `// Product` section:

```typescript
export { default as GetProductsBySKUFilter } from './core/services/product/GetProductsBySKUFilter';
export { default as GetSuggestedProductsFilter } from './core/services/product/GetSuggestedProductsFilter';
export { default as GetProductRecommendationsFilter } from './core/services/product/GetProductRecommendationsFilter';
export { default as ProductRecommendationType } from './core/services/product/ProductRecommendationType';
```

And under `// Models`:

```typescript
export { default as Product } from './core/models/catalog/Product';
```

(`Product` already exists — only the public re-export is new.)

## Types

### Filters

| Name | Fields | Notes |
|------|--------|-------|
| `GetProductsBySKUFilter` | `skus: string[]`, `storeReference: string` | maps to `GetProductsBySKUInput`. `clientId` injected by service. |
| `GetSuggestedProductsFilter` | `sku: string`, `storeReference: string` | maps to `GetSuggestedProductsInput`. `clientId` injected by service. |
| `GetProductRecommendationsFilter` | `type: ProductRecommendationType`, `storeReference: string`, `data: Record<string, any>`, `cartId?: string` | maps to `GetProductRecommendationsInput`. `clientId` injected by service. |

All three live under `src/core/services/product/` and `extends Input`.

### Enums

`ProductRecommendationType` lives at `src/core/services/product/ProductRecommendationType.ts`. Mirrors the schema enum exactly:

```typescript
enum ProductRecommendationType {
    FREQUENTLY_BOUGHT_TOGETHER = 'FREQUENTLY_BOUGHT_TOGETHER',
    REPLACEMENTS               = 'REPLACEMENTS',
    TRENDING                   = 'TRENDING',
    RECOMMENDED_FOR_YOU        = 'RECOMMENDED_FOR_YOU',
    FORGOT_SOMETHING           = 'FORGOT_SOMETHING',
}
export default ProductRecommendationType;
```

### Models

No new models. Reuses `src/core/models/catalog/Product.ts`.

## GraphQL operations

All three return typed objects (`[CatalogProductModel]!`), **not** `JSON` scalars. They require a full field selection set in the query string. The selection set must match `CatalogProductModel` from `graphql_schema.graphql` (around line 1509). Use the same selection for all three queries — defining it once and reusing it is fine, but the simpler / more conventional path in this SDK is one file per operation, each with its own selection set inlined. Choose whichever the implementer finds cleaner; the reviewer will accept either as long as one default-exported string per file holds.

### Selection set (apply to all three queries)

Match `CatalogProductModel`. The required-fields-only minimum is:

```
sku name price unit photosUrl stock isAvailable isActive maxQty minQty
slug brand description securityStock stockWarning boost clickMultiplier
specifications isVariant isDominant
categoriesData { name categoriesPath categoryReference slug boost isAvailableInHome hasChildren level active categoryNamesPath isAssociatedToCatalog hasAgeRestriction metaDescription metaTitle }
categories     { name categoriesPath categoryReference slug boost isAvailableInHome hasChildren level active categoryNamesPath isAssociatedToCatalog hasAgeRestriction metaDescription metaTitle }
tags           { description enabled textColor filter tagReference backgroundColor name slug }
promotion      { ... }     # see schema; full selection
promotions     { ... }     # PromotionV2 selection per schema
formats        { ... }
variants       { ... }
ean
nutritionalDetails
priceBeforeTaxes
taxTotal
relatedProducts          # [String!] — array of SKUs only
ingredients
allowSubstitutions
type
```

The implementer should copy the field list from `CatalogProductModel` in `graphql_schema.graphql` and include scalars + nested objects with their own minimum-viable selection sets (matching what `Product.fromJson` consumes; over-selecting is fine since the response is parsed leniently). If a nested type's full selection breaks the build (unknown subfield), trim to required fields only and note the trim in the implementer report.

### Operation 1: `getProductsBySKU`

```graphql
query GetProductsBySKU($getProductsBySKUInput: GetProductsBySKUInput!) {
  getProductsBySKU(getProductsBySKUInput: $getProductsBySKUInput) {
    # selection set above
  }
}
```
- Variables: `{ getProductsBySKUInput: filter.query }`
- `filter.query` carries `{ skus, storeReference, clientId }`
- Response path: `response.data.getProductsBySKU` — array.
- Service returns `Product[]` via `response.data.getProductsBySKU.map(Product.fromJson)`.

### Operation 2: `getSuggestedProducts`

```graphql
query GetSuggestedProducts($getSuggestedProductsInput: GetSuggestedProductsInput!) {
  getSuggestedProducts(getSuggestedProductsInput: $getSuggestedProductsInput) {
    # selection set above
  }
}
```
- Variables: `{ getSuggestedProductsInput: filter.query }`
- `filter.query` carries `{ sku, storeReference, clientId }`
- Response path: `response.data.getSuggestedProducts` — array.
- Service returns `Product[]`.

### Operation 3: `getProductRecommendations`

```graphql
query GetProductRecommendations($getProductRecommendationsInput: GetProductRecommendationsInput!) {
  getProductRecommendations(getProductRecommendationsInput: $getProductRecommendationsInput) {
    # selection set above
  }
}
```
- Variables: `{ getProductRecommendationsInput: filter.query }`
- `filter.query` carries `{ type, storeReference, data, cartId?, clientId }`
- Response path: `response.data.getProductRecommendations` — array.
- Service returns `Product[]`.

## Service signature

```typescript
// src/core/services/product/ProductService.ts
import Search from '../../models/Search';
import SearchFilter from '../../models/SearchFilter';
import Product from '../../models/catalog/Product';
import GetProductsBySKUFilter from './GetProductsBySKUFilter';
import GetSuggestedProductsFilter from './GetSuggestedProductsFilter';
import GetProductRecommendationsFilter from './GetProductRecommendationsFilter';

interface ProductService {
    search(filter: SearchFilter): Promise<Search>;
    getProductsBySKU(filter: GetProductsBySKUFilter): Promise<Product[]>;
    getSuggestedProducts(filter: GetSuggestedProductsFilter): Promise<Product[]>;
    getProductRecommendations(filter: GetProductRecommendationsFilter): Promise<Product[]>;
}

export default ProductService;
```

```typescript
// src/core/services/product/RemoteProductService.ts (new methods only)
async getProductsBySKU(filter: GetProductsBySKUFilter): Promise<Product[]> {
    filter.query['clientId'] = this.clientId;
    const response = await this.client.query(getProductsBySKUQuery, {
        getProductsBySKUInput: filter.query,
    });
    if (Array.isArray(response.data?.getProductsBySKU)) {
        return response.data.getProductsBySKU.map((p: Record<string, any>) => Product.fromJson(p));
    }
    throw new Error(`getProductsBySKU failed: ${JSON.stringify(response.errors || response)}`);
}

async getSuggestedProducts(filter: GetSuggestedProductsFilter): Promise<Product[]> {
    filter.query['clientId'] = this.clientId;
    const response = await this.client.query(getSuggestedProductsQuery, {
        getSuggestedProductsInput: filter.query,
    });
    if (Array.isArray(response.data?.getSuggestedProducts)) {
        return response.data.getSuggestedProducts.map((p: Record<string, any>) => Product.fromJson(p));
    }
    throw new Error(`getSuggestedProducts failed: ${JSON.stringify(response.errors || response)}`);
}

async getProductRecommendations(filter: GetProductRecommendationsFilter): Promise<Product[]> {
    filter.query['clientId'] = this.clientId;
    const response = await this.client.query(getProductRecommendationsQuery, {
        getProductRecommendationsInput: filter.query,
    });
    if (Array.isArray(response.data?.getProductRecommendations)) {
        return response.data.getProductRecommendations.map((p: Record<string, any>) => Product.fromJson(p));
    }
    throw new Error(`getProductRecommendations failed: ${JSON.stringify(response.errors || response)}`);
}
```

The constructor must accept and store `clientId`:

```typescript
constructor(private readonly client: IGraphqlClient, private readonly clientId: string) {}
```

## Platform wiring

```typescript
// src/core/Platform.ts (additions)
import RemoteProductService from "./services/product/RemoteProductService";

class Platform {
    productService: RemoteProductService;   // new

    constructor(config: { … }) {
        // existing wiring …
        this.productService = new RemoteProductService(this.client, config.clientId);
    }
}
```

## Files to add / modify

**Add:**
- `src/core/services/product/GetProductsBySKUFilter.ts`
- `src/core/services/product/GetSuggestedProductsFilter.ts`
- `src/core/services/product/GetProductRecommendationsFilter.ts`
- `src/core/services/product/ProductRecommendationType.ts`
- `src/core/services/product/queries/GetProductsBySKUQuery.ts`
- `src/core/services/product/queries/GetSuggestedProductsQuery.ts`
- `src/core/services/product/queries/GetProductRecommendationsQuery.ts`

**Modify:**
- `src/core/services/product/ProductService.ts` — add the three new methods to the interface.
- `src/core/services/product/RemoteProductService.ts` — add `clientId` to the constructor; implement the three methods. Leave `search` as-is (still throws `not implemented`).
- `src/core/Platform.ts` — instantiate and expose `productService`.
- `src/index.ts` — add a `// Product` section with the three Filter exports + `ProductRecommendationType`; add `Product` export under `// Models`.
- `src/test/index.ts` — add three smoke calls (one per new method) inside the existing IIFE, with `console.log` lines that print enough to confirm shape.

**Delete:** none.

## Smoke test additions

Append to `src/test/index.ts` inside the IIFE, after the home call:

```typescript
const sku = '12008102';
const storeReference = '12165';

const products = await client.productService.getProductsBySKU(
    new GetProductsBySKUFilter({ skus: [sku], storeReference })
);
console.log('getProductsBySKU:', products.length, products[0]?.name);

const suggested = await client.productService.getSuggestedProducts(
    new GetSuggestedProductsFilter({ sku, storeReference })
);
console.log('getSuggestedProducts:', suggested.length);

const recommended = await client.productService.getProductRecommendations(
    new GetProductRecommendationsFilter({
        type: ProductRecommendationType.TRENDING,
        storeReference,
        data: {},
    })
);
console.log('getProductRecommendations:', recommended.length);
```

Update the existing `import` block at the top of `src/test/index.ts` accordingly.

## Tasks

1. Add `GetProductsBySKUFilter` (`extends Input`, sets `skus` + `storeReference`).
2. Add `GetSuggestedProductsFilter` (`extends Input`, sets `sku` + `storeReference`).
3. Add `GetProductRecommendationsFilter` (`extends Input`, sets `type`, `storeReference`, `data`, optional `cartId`).
4. Add `ProductRecommendationType` enum (string-valued, matching schema names).
5. Add `GetProductsBySKUQuery` GQL string with full `CatalogProductModel` selection set.
6. Add `GetSuggestedProductsQuery` (same selection set as #5).
7. Add `GetProductRecommendationsQuery` (same selection set as #5).
8. Extend `ProductService` interface with the three methods.
9. Add `clientId` to `RemoteProductService` constructor, implement the three methods. Leave `search` untouched.
10. Wire `productService` into `Platform`.
11. Export new types from `src/index.ts` under a new `// Product` section, plus `Product` under `// Models`.
12. Add the three smoke calls to `src/test/index.ts`.
13. Bump `package.json` version `2.0.1` → `2.1.0` (minor, additive).
14. `npm run build` must pass with zero errors.

## Acceptance criteria

- [ ] `npm run build` passes with zero errors.
- [ ] `import { GetProductsBySKUFilter, GetSuggestedProductsFilter, GetProductRecommendationsFilter, ProductRecommendationType, Product } from '@sirosa/ecommerce-js-sdk'` resolves with correct types.
- [ ] `platform.productService` is defined and an instance of `RemoteProductService`.
- [ ] All three filters extend `Input` and store fields on `this.query`.
- [ ] All three service methods inject `clientId` from the Platform `clientId` (verifiable: `filter.query.clientId === 'D1'` after the call).
- [ ] All three return `Product[]` (empty array allowed; throw on missing `data.<op>` field).
- [ ] `RemoteProductService.search` is unchanged (still throws `not implemented`).
- [ ] No direct `fetch` in the service — all calls go through `GraphqlClient`.
- [ ] No `*Filter` suffix on a class that's actually a mutation Input (none here, all three are selections).
- [ ] `ProductRecommendationType` enum values match the schema strings exactly.
- [ ] Reviewer agent reports zero violations against `CLAUDE.md`.

## Open questions

- **Field selection set trimming.** The selection set above mirrors `CatalogProductModel` from `graphql_schema.graphql`. If a nested-type subfield (e.g. inside `promotion`, `promotions`, `formats`) is unknown to the backend introspection, trim to required fields only and document the trim in the implementer report. The service-level contract (returns `Product[]`) does not change.