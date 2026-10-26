# Spec: Cart drawer fields

**Status:** in-progress
**Owner:** SDK maintainers
**Last updated:** 2026-10-26

## Why

The Nimrod storefront is getting a cart drawer with Moira parity (mercadoni/nimrod issue #165; its spec is `docs/proposals/165-cart-drawer-moira-drawer-parity.md`, Step 1 and gaps P-1 to P-7). SDK 3.4.0 selects none of the cart fields the drawer reads, and its authenticated validation selects a field the backend type does not have. This spec adds the fields, fixes the validation selection, and wraps the two cart mutations the drawer needs. Everything below was checked against Deadpool's `development` branch at `7eb1bfb` (2026-10-20; the Nimrod spec cites `2ef01ccb`, and the 14 lines between the two schemas are additive and touch none of these fields); nothing was probed against a deployed backend (see `notes.md`).

## Goals

1. **Schema copy.** `graphql_schema.graphql` is refreshed from Deadpool v3 (`src/new-generation/typedefs`) and contains `ValidationIssue.metadata`.
2. **Totals (P-1).** `PricesSummary.productsSummary: ProductsSummary | null`, selected inside `pricesSummary` in the shared cart selection and in both validation selections. `null` when the object is absent (the backend answers null when its cart engine omits it); never zeros.
3. **Lines (P-2).** `CartProduct.type` and `createdAt` (`string | null`) in the shared product selection and the guest validation products; `SpecialProduct.createdAt` in the special-product selection. The raw string is kept.
4. **Validated lines (P-3).** `CartProduct.isSample: boolean | null` and `clickMultiplier: number | null`, selected only on the products of `validateEcommerceCart` and `validateGuestCart` (the fields exist only on `ValidatedCartProductModel`). `null` on lines that did not come from a validation; `false` and `0` are kept as they arrive.
5. **Issue metadata (P-7).** `metadata { minUnitQuantity maxUnitQuantity clickMultiplier suggestedUnit }` inside `validationIssues` in the validation selections only. Issues stay raw records.
6. **Valid validation selections (P-6).** `validateEcommerceCart`, `updateCouponInEcommerceCart` and `validateGuestCart` return `ValidatedCartModel`, which has no `deliverySlot`; their selections do not contain it. `validateGuestCart` is typed `ValidatedCart`.
7. **Street line (P-4).** `address { address { other } }` in the authenticated validation selection only. A guest cart cannot hold an address, a customer or special products in v3, so the guest validation selects none of them.
8. **New mutations (P-5).** `CartService.removeSpecialProduct(input: RemoveSpecialProductInput)` over `deleteSpecialProductInEcommerceCart`, and `CartService.deleteGuestCart(cartId: string)` over `deleteGuestCart`; both return a `Cart`.

## Non-goals

- Per-line `validationIssues` and `selectedFormat` (follow-up F4 of the Nimrod spec); `suggestedQuantity` and `selectedFormat` of the issue metadata.
- Line price per measurement unit, promotions, variants.
- Address, customer or special products in the guest validation.
- Any change to fulfillment (v2), auth or catalog.
- Publishing, tags, the version and `CHANGELOG.md` (the release flow owns them), the websdk and cli repositories, and the Nimrod pin.
- Probing a deployed Deadpool. The harness has no credentials; the probe and the release order are written down in `notes.md`.

## Consumer-facing API

```typescript
// New exports from src/index.ts
export { default as RemoveSpecialProductInput } from './core/services/cart/RemoveSpecialProductInput';
export { default as PricesSummary } from './core/models/cart/PricesSummary';
export { default as ProductsSummary } from './core/models/cart/ProductsSummary';
export { default as SpecialProduct } from './core/models/cart/SpecialProduct';

const cart = await platform.cartService.removeSpecialProduct(new RemoveSpecialProductInput({ cartId, specialProductId }));
const deleted = await platform.cartService.deleteGuestCart(cartId);
const validated = await platform.cartService.validateGuestCart(new ValidateGuestCartInput({ cartId })); // ValidatedCart
cart.pricesSummary.productsSummary; // ProductsSummary | null
```

## Types

### Inputs / Filters

| Name | Kind | Fields | Notes |
|------|------|--------|-------|
| `RemoveSpecialProductInput` | Input | `cartId: string`, `specialProductId: string` | variable `deleteSpecialProductInCartInput` |

### Models (response shapes)

| Name | Fields | Notes |
|------|--------|-------|
| `ProductsSummary` (new) | `productsTotal`, `fullProductsPrice`, `totalProductsDiscount`, `missingForMinimumOrderValue`, `missingForFreeShipping`, the five `...BeforeTaxes` variants (`number`), `isApplicableForFreeShipping: boolean` | the 11 fields of `CartProductsSummaryModel`, all non-null in the schema; `readonly` fields |
| `PricesSummary` | `+ productsSummary: ProductsSummary \| null` | |
| `CartProduct` | `+ type`, `createdAt`: `string \| null`; `+ isSample: boolean \| null`, `clickMultiplier: number \| null` | the last two come only from a validation |
| `SpecialProduct` | `+ createdAt: string \| null` | |

## GraphQL operations

### `deleteSpecialProductInEcommerceCart` (mutation)

```graphql
mutation DeleteSpecialProductInEcommerceCart($deleteSpecialProductInCartInput: DeleteSpecialProductInCartInput!) {
  deleteSpecialProductInEcommerceCart(deleteSpecialProductInCartInput: $deleteSpecialProductInCartInput) { ...cartFragment }
}
```

- Response path: `response.data.deleteSpecialProductInEcommerceCart`; variables: `{ deleteSpecialProductInCartInput: input.query }`.

### `deleteGuestCart` (mutation)

```graphql
mutation DeleteGuestCart($cartId: ID!) {
  deleteGuestCart(cartId: $cartId) { ...cartFragment }
}
```

- Response path: `response.data.deleteGuestCart`; variables: `{ cartId }`.

### Selections

| Selection | Used by | Adds |
|-----------|---------|------|
| `cartFragment` (shared) | every cart query and mutation except the three validations | `products.type`, `products.createdAt`, `specialProducts.createdAt`, `pricesSummary.productsSummary { 11 fields }` |
| `validateCartFragment` (new) | `validateEcommerceCart`, `updateCouponInEcommerceCart` | the above, plus `products.isSample`, `products.clickMultiplier`, `validationIssues.metadata { 4 keys }`, `address.address.other`; no `deliverySlot` |
| `validateGuestCartFragment` | `validateGuestCart` | `products.type`, `products.createdAt`, `products.isSample`, `products.clickMultiplier`, `pricesSummary.productsSummary`, `validationIssues.metadata` |

## Files to add / modify

**Add:**
- `specs/cart-drawer-fields/spec.md`, `specs/cart-drawer-fields/notes.md`
- `src/core/models/cart/ProductsSummary.ts`
- `src/core/services/cart/RemoveSpecialProductInput.ts`
- `src/core/services/cart/ValidateCartFragment.ts`
- `src/core/services/cart/fields/` — `PriceFields.ts`, `CartProductFields.ts`, `ValidatedCartProductFields.ts`, `SpecialProductFields.ts`, `PricesSummaryFields.ts`, `ValidationIssueFields.ts` (one default-exported selection string per file, shared by the three fragments so they cannot drift apart)
- `src/core/services/cart/mutations/DeleteGuestCartMutation.ts`, `DeleteSpecialProductMutation.ts`
- `tests/cart-drawer-fields.test.ts`

**Modify:**
- `graphql_schema.graphql`
- `src/core/models/cart/PricesSummary.ts`, `CartProduct.ts`, `SpecialProduct.ts`
- `src/core/services/cart/CartFragment.ts`, `ValidateGuestCartFragment.ts`
- `src/core/services/cart/mutations/ValidateCartMutation.ts`, `UpdateCouponMutation.ts`
- `src/core/services/cart/CartService.ts`, `GraphqlCartService.ts`
- `src/index.ts`, `docs/coverage.md`

`ValidatedCart.ts` needs no change: it builds on `Cart.fromJson`, which now parses the new fields.

## Acceptance criteria

- [ ] `npm run build` and `npm test` pass; `npx eslint src tests` adds no finding beyond the `Record<string, any>` signature of the new model's `fromJson`, which `CLAUDE.md`'s model template prescribes (the repo has no lint script and 150 existing findings there).
- [ ] The three selections contain the fields in the table above and exclude what it says they exclude, checked structurally (not by substring) on every operation that uses them.
- [ ] `validateEcommerceCart`, `updateCouponInEcommerceCart` and `validateGuestCart` contain no `deliverySlot`; every selection of the cart operations is valid against `graphql_schema.graphql` (a test walks each selection path through the schema).
- [ ] `ProductsSummary` parses when present; `PricesSummary.productsSummary` is `null` when absent, never an object of zeros.
- [ ] `type`, `createdAt`, `isSample`, `clickMultiplier` parse and are `null` when absent; `false` and `0` survive.
- [ ] `removeSpecialProduct` and `deleteGuestCart` send the schema's mutation with its variables, return a `Cart`, and throw with the serialized errors when `data` lacks the operation.
- [ ] `validateGuestCart` returns a `ValidatedCart`.
- [ ] `RemoveSpecialProductInput`, `PricesSummary`, `ProductsSummary` and `SpecialProduct` are exported from the package root.
- [ ] `docs/coverage.md` lists the new methods and the field rules.

## Open questions

- Whether the deployed Deadpool (staging and production) serves every new selection is unverified. It is a release gate, not a code question: `notes.md` holds the probe and the release order.
