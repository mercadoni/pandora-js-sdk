# SDK coverage

`@mercadoni/pandora-js-sdk` provides the typed GraphQL boundary used by server and application integrations. It owns request transport, GraphQL operation construction, response model parsing, authentication headers, and Deadpool API-version routing.

## Platform configuration

`Platform` accepts one API root:

```ts
const platform = new Platform({
  baseUrl: 'https://deadpool.xandar.instaleap.io/api/v3',
  clientId: 'YOUR_CLIENT_ID',
  apiKey: 'YOUR_API_KEY',
});
```

Optional `debug` and `logger` settings control transport logging. `apiKey` is sent as `dpl-api-key`; `setToken()` adds the session token; `setHeaders()` merges custom headers into both internal API-version clients.

## Deadpool version routing

The SDK derives the v2 and v3 roots from the configured `baseUrl`. The compatibility map is SDK-owned:

| Service | API version |
| --- | --- |
| `homeService` | v3 |
| `authService` | v3 |
| `cartService` | v3 |
| `productService` | v3 |
| `categoryService` | v3 |
| `addressService` | v3 |
| `fulfillmentService` | v2 |

Consumers do not provide `fulfillmentBaseUrl` and do not retry an operation against another version.

## Services

### Home

- `home(filter)`

### Auth

- `signIn(input)`
- `signUp(input)`
- `refreshTokens(input)`
- `logout()`
- `forgotPassword(input)`

### Product catalog

- `search(filter)`
- `getProductsByCategory(filter)`
- `getProductsBySKU(filter)`
- `getSuggestedProducts(filter)`
- `getProductRecommendations(filter)`

### Categories

- `getCategoryTree(filter)`

### Cart

- Ecommerce cart: `getCart`, `getActiveCart`, `createCart`, `getOrCreateCart`, `updateCart`, `deleteCart`
- Ecommerce products: `addProduct`, `addProducts`, `updateProduct`, `removeProduct`
- Ecommerce checkout: `validateCart`, `purchaseCart`, `applyCoupon`
- Guest cart: `createGuestCart`, `getGuestCart`, `updateGuestCart`, `deleteProductInGuestCart`, `addProductToGuestCart`, `updateProductInGuestCart`, `validateGuestCart`, `convertGuestToEcommerceCart`

### Fulfillment

- `getOperationalModels(filter)`
- `getStoresNearby(filter)`
- `getPCStores(filter)`
- `getStates(filter)`
- `getCities(filter)`

### Address

- `getAddresses(filter)`

## Exported type families

The package root exports the `Platform`, service inputs and filters, and response models for:

- authentication
- catalog search and category results
- home widgets
- ecommerce and guest carts
- fulfillment stores, states, and cities
- customer addresses

Import from `@mercadoni/pandora-js-sdk`; deep imports are not part of the public contract.

## Transport behavior

- All service calls use the shared GraphQL client.
- Network, HTTP, and GraphQL failures throw standard `Error` instances.
- The SDK does not persist tokens, cache responses, retry requests, or provide UI components.
- Consumers own token storage, request lifecycle, and presentation.
