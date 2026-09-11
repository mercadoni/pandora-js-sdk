# Spec: Deadpool API version routing

**Status:** done
**Owner:** platform

## Why

Deadpool exposes the same GraphQL contract under `/api/v2` and `/api/v3`, but the current SDK lets the application provide a separate fulfillment URL and silently derives v2 only for fulfillment. Applications should configure one Deadpool base URL; the SDK must own the compatibility map and route each service to its required API version.

## Goals

- Accept one `baseUrl` in `Platform` configuration.
- Normalize a versioned base URL such as `https://deadpool.xandar.instaleap.io/api/v3` and derive both version roots without exposing a second URL to consumers.
- Route services using the SDK-owned compatibility map:
  - `home` → `v3`
  - `auth` → `v3`
  - `cart` → `v3`
  - `product` → `v3`
  - `category` → `v3`
  - `fulfillment` → `v2`
  - `address` → `v3`
- Apply API-key, custom headers, and session tokens to every versioned client.
- Keep version selection deterministic; do not retry an operation against another API version.

## Non-goals

- Choosing versions from application configuration.
- Automatic fallback after a failed request.
- Inferring versions from GraphQL errors.
- Changing GraphQL operations or service behavior.
- Adding endpoint mappings that are not established by the backend contract.

## Consumer-facing API

`Platform` keeps a single required URL:

```ts
const platform = new Platform({
    baseUrl: 'https://deadpool.xandar.instaleap.io/api/v3',
    clientId: 'D1',
    apiKey: '...',
});
```

`fulfillmentBaseUrl` is removed from the public constructor contract. The SDK owns the service-to-version map.

## Files to add / modify

**Add:**

- `src/core/apiVersionMap.ts` — API versions, service map, and versioned URL normalization.
- `specs/deadpool-api-version-routing/spec.md` — this contract.

**Modify:**

- `src/core/Platform.ts` — create versioned clients, route services, propagate auth and headers.
- `src/index.ts` — export the consumer-facing `HomeWidget` model used by the upgraded Pandora app.
- `CHANGELOG.md` — record the routing behavior.

## Acceptance criteria

- [x] `Platform` can be constructed with only `baseUrl`, `clientId`, and `apiKey`.
- [x] With a `/api/v3` base URL, fulfillment requests target `/api/v2` and all other current services target `/api/v3`.
- [x] With a `/api/v2` base URL, the same map still produces `/api/v2` and `/api/v3` roots correctly.
- [x] `setToken()` and `setHeaders()` update both internal clients.
- [x] No application-provided fulfillment URL remains necessary.
- [x] `npm run build` passes.
