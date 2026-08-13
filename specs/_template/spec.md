# Spec: <feature name>

**Status:** draft | ready-for-impl | in-progress | done
**Owner:** <name>
**Last updated:** YYYY-MM-DD

## Why

One paragraph. What problem does this solve? Who asked for it? Why now?

## Goals

- Bulleted list of what this feature must do.
- Each goal should be observable from consumer code (not internal implementation detail).

## Non-goals

- Explicit list of things this feature does NOT cover.
- If scope creep happens during implementation, add it here or spin off a new spec.

## Consumer-facing API

Exact method signatures and types as they'll be exported from `src/index.ts`.

```typescript
// New exports from src/index.ts
export { default as FooInput } from '...';
export { default as Foo } from '...';

// Usage:
const input = new FooInput({ ... });
const result = await platform.fooService.doThing(input);
```

## Types

### Inputs / Filters

| Name | Kind | Fields | Notes |
|------|------|--------|-------|
| `FooInput` | Input | `bar: string`, `baz?: number` | mutation payload |

### Models (response shapes)

| Name | Fields | Notes |
|------|--------|-------|
| `Foo` | `id: string`, `name: string` | has `fromJson` |

## GraphQL operations

### `<operationName>` (query | mutation)

```graphql
mutation Foo($fooInput: FooInput!) {
  foo(fooInput: $fooInput) {
    id
    name
  }
}
```

- Response path: `response.data.foo`
- Variables: `{ fooInput: input.query }`

## Files to add / modify

**Add:**
- `src/core/services/<domain>/FooInput.ts`
- `src/core/services/<domain>/mutations/FooMutation.ts`
- `src/core/models/<domain>/Foo.ts`

**Modify:**
- `src/core/services/<domain>/<Domain>Service.ts` — add `doThing` to interface
- `src/core/services/<domain>/Graphql<Domain>Service.ts` — implement `doThing`
- `src/index.ts` — export new types

## Tasks

1. Add `FooInput` per CLAUDE.md Input template.
2. Add `FooMutation` GraphQL string.
3. Add `Foo` model with `fromJson`.
4. Extend `<Domain>Service` interface with `doThing`.
5. Implement `doThing` in `Graphql<Domain>Service`.
6. Export new types from `src/index.ts`.
7. Add smoke call in `src/test/index.ts`.
8. Run `npm run build` — must pass clean.

## Acceptance criteria

- [ ] `npm run build` passes with no errors.
- [ ] Consumer can `import { Foo, FooInput } from '@mercadoni/pandora-js-sdk'` and the types are correct.
- [ ] Calling `platform.fooService.doThing(new FooInput({...}))` returns a `Foo` instance.
- [ ] Passing malformed input results in a thrown Error with the server's error message.
- [ ] No `*Filter` suffix used on input types per CLAUDE.md naming rules.
- [ ] No direct `fetch` calls from the service; all go through `GraphqlClient`.

## Open questions

- List any unresolved questions here. If this list isn't empty, the spec is `draft`, not `ready-for-impl`.
