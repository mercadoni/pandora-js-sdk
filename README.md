# @jorgeehernandez/ecommerce-js-sdk

TypeScript SDK for ecommerce platform integration via GraphQL.

## Installation

```bash
npm install @jorgeehernandez/ecommerce-js-sdk
```

## Quick Start

```typescript
import { Platform, HomeFilter, SignInFilter, CreateCartFilter } from '@jorgeehernandez/ecommerce-js-sdk';

const platform = new Platform({
  baseUrl: 'https://api.your-store.com/graphql',
  clientId: 'YOUR_CLIENT_ID',
});
```

## Services

### Home

```typescript
const filter = new HomeFilter({ /* filter params */ });
const home = await platform.homeService.home({ filter });
```

### Auth

```typescript
// Sign in
const signInFilter = new SignInFilter({ email: 'user@example.com', password: 'secret' });
const session = await platform.authService.signIn(signInFilter);

// Set token for authenticated requests
platform.setToken(session.token);

// Sign up
const signUpFilter = new SignUpFilter({ email: 'user@example.com', password: 'secret', name: 'User' });
const account = await platform.authService.signUp(signUpFilter);

// Refresh tokens
const refreshFilter = new RefreshTokensFilter({ refreshToken: 'token' });
const tokens = await platform.authService.refreshTokens(refreshFilter);

// Logout
await platform.authService.logout();

// Forgot password
const forgotFilter = new ForgotPasswordFilter({ email: 'user@example.com' });
await platform.authService.forgotPassword(forgotFilter);
```

### Cart

```typescript
// Create or retrieve a cart
const createFilter = new CreateCartFilter({ customerId: 'cust_123' });
const cart = await platform.cartService.getOrCreateCart(createFilter);

// Add a product
const addFilter = new AddProductFilter({ cartId: cart.id, productId: 'prod_456', quantity: 1 });
const updatedCart = await platform.cartService.addProduct(addFilter);

// Validate and purchase
const validateFilter = new ValidateCartFilter({ cartId: cart.id });
const validated = await platform.cartService.validateCart(validateFilter);

const purchaseFilter = new PurchaseCartFilter({ cartId: cart.id });
const purchase = await platform.cartService.purchaseCart(purchaseFilter);
```

## Error Handling

All methods throw on failure — network errors, HTTP errors, and GraphQL errors are all surfaced as standard `Error` instances:

```typescript
try {
  const session = await platform.authService.signIn(filter);
} catch (error) {
  console.error(error.message); // e.g. "Invalid credentials"
}
```

## License

MIT
