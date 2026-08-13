# @mercadoni/pandora-js-sdk

TypeScript SDK for ecommerce platform integration via GraphQL.

## Installation

```bash
npm install @mercadoni/pandora-js-sdk
```

## Quick Start

```typescript
import { Platform, HomeFilter, SignInInput, CreateCartInput } from '@mercadoni/pandora-js-sdk';

const platform = new Platform({
  baseUrl: 'https://api.your-store.com/graphql',
  clientId: 'YOUR_CLIENT_ID',
  apiKey: 'YOUR_API_KEY',
});
```

The `apiKey` is required and is forwarded as the `dpl-api-key` HTTP header on every request.

## Services

### Home

```typescript
const filter = new HomeFilter({
  byStore: 'STORE_REFERENCE',
  byPlatform: 'WEB',
  byScreenSize: 'large',
});
const home = await platform.homeService.home({ filter });
```

Home payload validation rules:

- `id`, `breakpoint`, and `targetType` are required.
- `storeReferences` must be an array and can be empty.

### Auth

```typescript
// Sign in
const signInInput = new SignInInput({
  clientId: 'YOUR_CLIENT_ID',
  email: 'user@example.com',
  password: 'secret',
});
const session = await platform.authService.signIn(signInInput);

// Set token for authenticated requests
platform.setToken(session.token);

// Sign up
const signUpInput = new SignUpInput({
  clientId: 'YOUR_CLIENT_ID',
  customerData: {
    name: 'User',
    email: 'user@example.com',
    password: 'secret',
  },
});
const account = await platform.authService.signUp(signUpInput);

// Refresh tokens
const refreshTokensInput = new RefreshTokensInput({ refreshToken: 'token' });
const tokens = await platform.authService.refreshTokens(refreshTokensInput);

// Logout
await platform.authService.logout();

// Forgot password
const forgotPasswordInput = new ForgotPasswordInput({
  clientId: 'YOUR_CLIENT_ID',
  email: 'user@example.com',
});
await platform.authService.forgotPassword(forgotPasswordInput);
```

### Cart

```typescript
// Create or retrieve a cart
const createCartInput = new CreateCartInput({
  storeReference: 'STORE_REFERENCE',
  operationalModel: 'PICKUP',
});
const cart = await platform.cartService.getOrCreateCart(createCartInput);

// Add a product
const addProductInput = new AddProductInput({
  cartId: cart.id,
  reference: 'prod_456',
  unit: 'UN',
  unitQuantity: 1,
});
const updatedCart = await platform.cartService.addProduct(addProductInput);

// Validate and purchase
const validateCartInput = new ValidateCartInput({ cartId: cart.id });
const validated = await platform.cartService.validateCart(validateCartInput);

const purchaseCartInput = new PurchaseCartInput({
  cartId: cart.id,
  paymentInput: {
    paymentMethod: { type: 'CASH', name: 'Cash' },
  },
});
const purchase = await platform.cartService.purchaseCart(purchaseCartInput);
```

### Custom Headers

`Platform.setHeaders(headers)` attaches arbitrary HTTP headers to every subsequent request. Use it for tracing IDs, A/B test markers, debug headers, or any per-request metadata your backend expects:

```typescript
// Single header
platform.setHeaders({ 'X-Trace-Id': 'abc-123' });

// Bulk
platform.setHeaders({
  'X-Trace-Id': 'abc-123',
  'X-Customer-Tier': 'gold',
});
```

Merge semantics: existing headers with matching names are overwritten; non-matching headers are preserved. SDK invariants (`Content-Type`, `Accept`, `token`, `dpl-api-key`) can be overridden — the SDK does not guard against this, so don't override them unless you know what you're doing.

Note: `apiKey` is set at construction via the `Platform` config and is forwarded as `dpl-api-key` internally. You do not need to (and should not) pass it via `setHeaders`.

## Error Handling

All methods throw on failure — network errors, HTTP errors, and GraphQL errors are all surfaced as standard `Error` instances:

```typescript
try {
  const session = await platform.authService.signIn(signInInput);
} catch (error) {
  console.error(error.message); // e.g. "Invalid credentials"
}
```

## License

MIT