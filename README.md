# @mercadoni/pandora-js-sdk

Typed TypeScript client for the Instaleap GraphQL platform.

## What it covers

| Area | Capability |
| --- | --- |
| Home | Dynamic home content |
| Auth | Sign in, sign up, refresh, logout, forgot password |
| Catalog | Search, SKU lookup, category products, suggestions, recommendations |
| Cart | Ecommerce carts, guest carts, validation, purchase, coupons |
| Categories | Category tree |
| Fulfillment | Operational models, nearby stores, pickup stores, states, cities |
| Address | Customer address lookup |
| Transport | GraphQL queries and mutations, API-key auth, session tokens, custom headers |

## Install

```bash
npm install @mercadoni/pandora-js-sdk
```

## Quick start

```ts
import { Platform, SearchFilter } from '@mercadoni/pandora-js-sdk';

const platform = new Platform({
  baseUrl: 'https://deadpool.xandar.instaleap.io/api/v3',
  clientId: 'YOUR_CLIENT_ID',
  apiKey: 'YOUR_API_KEY',
});

const result = await platform.productService.search(
  new SearchFilter({ currentPage: 1 }),
);
```

`apiKey` is sent as `dpl-api-key`. Call `platform.setToken(token)` after authentication for session-bound requests.

## API versions

Configure one Deadpool base URL. The SDK owns the compatibility map: fulfillment uses v2; the other current services use v3. Applications do not configure a second URL or select versions per request.

## Details

See [docs/coverage.md](docs/coverage.md) for service methods, exported types, routing, and boundaries.

## Requirements

Node 18+ or a runtime with `globalThis.fetch`.

## License

MIT
