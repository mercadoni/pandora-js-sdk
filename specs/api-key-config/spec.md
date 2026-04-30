# Spec: API key config

**Status:** ready-for-impl
**Owner:** Jorge
**Last updated:** 2026-04-29

## Why

The backend now requires a per-customer/per-developer API key on every request, sent as the HTTP header `dplApiKey`. Without it the backend rejects requests with `INVALID_HEADERS`. The SDK currently has no way to attach arbitrary headers — `Client.setToken` only sets the `token` header — so consumers (notably the Pandora SvelteKit POC) are blocked. This spec adds a required `apiKey` field to `Platform`'s constructor and wires it through to the HTTP header internally.

## Goals

- Consumers pass `apiKey: string` when constructing `Platform`. Required, not optional.
- The wire-format header name (`dplApiKey`) is an SDK implementation detail. Consumers never type it.
- Every outgoing request from a `Platform` instance carries `dplApiKey: <value>`.
- TypeScript fails to compile consumer code that omits `apiKey`.

## Non-goals

- Runtime rotation (`Platform.setApiKey(...)`). Constructor-only for now; follow-up spec if needed.
- Generic `headers` config bag on `Platform`.
- `removeHeaders` on `Platform`'s public surface.
- Defensive checks against overriding reserved headers (`Content-Type`, `Accept`, `token`, `dplApiKey`) inside `Client.setHeaders`. Permissive on purpose; documented in README.
- Refactoring `Client`'s positional constructor signature `(baseUrl, token, debug, logger)`.

## Consumer-facing API

```typescript
import { Platform } from '@sirosa/ecommerce-js-sdk';

const platform = new Platform({
    baseUrl: 'https://nextgentheadless.instaleap.io/api/v3',
    clientId: 'D1',
    apiKey: 'cbc45b69-...', // NEW — required
    debug: false,
});

// Attach arbitrary headers at runtime (tracing IDs, A/B markers, debug headers, etc.)
platform.setHeaders({ 'X-Trace-Id': 'abc-123' });
```

Omitting `apiKey` is a TypeScript error. The string `dplApiKey` is not part of the public API surface.

`Platform.setHeaders(headers: Record<string, string>): void` merges the supplied headers into the client's default headers (`Object.assign` semantics): existing headers with matching names are overwritten, non-matching headers are preserved.

## Types

### Platform constructor config

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `baseUrl` | `string` | yes | unchanged |
| `clientId` | `string` | yes | unchanged |
| `apiKey` | `string` | **yes (NEW)** | sent as `dplApiKey` header on every request |
| `debug` | `boolean` | no | unchanged |
| `logger` | `Logger` | no | unchanged |

### `Client` (internal)

New public method on the internal `Client` class:

```typescript
setHeaders(headers: Record<string, string>): void
```

Permissive — `Object.assign(this.defaultHeaders, headers)`. No reserved-name guard.

### `Platform` (public)

New public method, mirroring the existing `setToken` passthrough:

```typescript
setHeaders(headers: Record<string, string>): void
```

Delegates to `this.client.setHeaders(headers)`.

## GraphQL operations

N/A — no new GraphQL operations.

## Files to add / modify

**Add:** none.

**Modify:**
- `src/core/Client.ts` — add `setHeaders(headers: Record<string, string>): void`.
- `src/core/Platform.ts` — add required `apiKey: string` to constructor config; after constructing `Client`, call `this.client.setHeaders({ dplApiKey: config.apiKey })`. The literal `'dplApiKey'` lives only in this file. Add a public `setHeaders(headers: Record<string, string>): void` passthrough that delegates to `this.client.setHeaders(headers)`.
- `src/test/index.ts` — pass an `apiKey: '<placeholder>'` to `new Platform({...})` so the smoke test still type-checks. Use a clearly placeholder string; do not hardcode the real tenant key.
- `package.json` — bump `version` from `1.2.5` to `2.0.0` (BREAKING: required new config field).
- `CHANGELOG.md` — add a `## 2.0.0` section noting the BREAKING change and the new `Platform.setHeaders` method.
- `README.md` — document `Platform.setHeaders` for consumers (when to use, examples, merge semantics).

## Tasks

1. Add `setHeaders(headers: Record<string, string>): void` to `Client` (`Object.assign(this.defaultHeaders, headers)`).
2. Add `apiKey: string` (required) to `Platform`'s constructor config type.
3. In `Platform`'s constructor, after `new Client(...)`, call `this.client.setHeaders({ dplApiKey: config.apiKey })`.
4. Add a `setHeaders(headers: Record<string, string>): void` passthrough on `Platform` that delegates to `this.client.setHeaders(headers)`.
5. Update `src/test/index.ts` to include a placeholder `apiKey`.
6. Bump `package.json` version to `2.0.0`.
7. Add `## 2.0.0` entry to `CHANGELOG.md` documenting the breaking change and the new `Platform.setHeaders` method.
8. Document `Platform.setHeaders` in `README.md` (use cases, examples, merge semantics).
9. Run `npm run build` — must pass clean.

## Acceptance criteria

- [ ] `npm run build` passes with zero errors.
- [ ] `Platform`'s public constructor type lists `apiKey: string` as a required field.
- [ ] Consumer code that omits `apiKey` from `new Platform({...})` fails TypeScript compilation.
- [ ] A constructed `Platform` sends an HTTP `dplApiKey` header equal to the supplied value on its first request (verifiable by inspecting `Client.defaultHeaders` after construction).
- [ ] The literal string `dplApiKey` does not appear in `src/index.ts` or in any consumer-facing type — only inside `src/core/Platform.ts`.
- [ ] `Platform.setHeaders(headers: Record<string, string>): void` exists on the public surface and merges into `Client.defaultHeaders` via `Object.assign` semantics.
- [ ] `Client.setHeader` (singular) does not exist anywhere in the source.
- [ ] `package.json` version is `2.0.0`.
- [ ] `CHANGELOG.md` documents the breaking change and `Platform.setHeaders` under `## 2.0.0`.
- [ ] `README.md` documents `Platform.setHeaders` (use cases, examples, merge semantics).

## Open questions

None.
