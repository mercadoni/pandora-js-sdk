# CLAUDE.md — Ecommerce JS SDK

> This file is the **contract** for AI agents working on this SDK. The `feature-implementer` and `feature-reviewer` agents read it. Every rule here is testable. If you deviate from these rules, the reviewer will flag it.

## What this SDK is

TypeScript SDK that wraps a GraphQL ecommerce API (target: `nextgentheadless.instaleap.io`). Consumers get a single `Platform` entry point, construct typed Input/Filter objects, and call service methods that return typed Model instances. The SDK hides GraphQL string construction, variable shaping, HTTP, and JSON parsing.

## The backend schema (read this before writing any GraphQL)

The full backend GraphQL schema lives at the **repo root** as `graphql_schema.graphql`. It is the source of truth for operation names, input types, return types, and field shapes. **Before specing or implementing any new query/mutation, grep this file** to confirm:

- The exact operation name (e.g. `getProductsBySKU`, not `getProductBySku`).
- The input type's required vs. optional fields.
- The return type — and whether it's a `JSON` scalar (no selection set needed, like `getDynamicHome`) or a typed object (full selection set required, like `[CatalogProductModel]!`).

`grep -nE "^(input|type) <Name>" graphql_schema.graphql` is the fastest way to look up a definition. The Query/Mutation root types start around line 2650+. Do not invent operation names or input shapes — if the schema doesn't define it, the operation doesn't exist on the backend, and the spec needs an open question, not a guess.

---

## Architecture: the four layers

```
Consumer code
    │
    ▼
Platform (src/core/Platform.ts)       ← entry point; wires services + client
    │
    ▼
Service  (src/core/services/<domain>/) ← interface + GraphQL implementation
    │
    ▼
Client   (src/core/Client.ts)          ← GraphqlClient: query() / mutation()
    │
    ▼
HTTPClient (isomorphic-unfetch)        ← transport
```

**Hard rules:**
- Consumers only touch `Platform` and the exported Input/Filter/Model classes.
- Services never call `fetch` directly — they call `GraphqlClient.query()` or `GraphqlClient.mutation()`.
- Models never import services or the client. They're pure data.
- The `Client` class never knows about specific domains (auth, cart, home). It only knows GraphQL.

---

## File organization

```
src/
  index.ts                          ← public SDK exports (single barrel)
  core/
    Platform.ts                     ← SDK entry point
    Client.ts                       ← GraphqlClient implementation
    http/
      GraphqlClient.ts              ← interface { query, mutation }
      HTTPClient.ts                 ← interface { fetch }
      Logger.ts                     ← interface
    models/
      Input.ts                      ← abstract base for all Input/Filter types
      <Domain>.ts                   ← shared models (Banner, Carousel, …)
      <domain>/
        <Model>.ts                  ← domain model with fromJson
    services/
      <domain>/
        <Domain>Service.ts          ← interface
        Graphql<Domain>Service.ts   ← implementation
        <Name>Input.ts              ← mutation/action payload types
        <Name>Filter.ts             ← selection/query types
        queries/<Name>Query.ts      ← raw GQL string constants
        mutations/<Name>Mutation.ts ← raw GQL string constants
  test/
    index.ts                        ← manual smoke test harness
```

One file per class. Default export only for the class itself.

---

## Naming conventions (MUST follow)

### Filter vs Input
- **`*Filter`** — ONLY for types that select/narrow across a set of entities. Today: `HomeFilter` (narrows from many homes), `GetActiveCartFilter`, `GetGuestCartFilter`, `SearchFilter`, `ProductFilter`.
- **`*Input`** — Mutation payloads or single-action argument types. Everything passed to a `mutation(...)` call. Examples: `SignInInput`, `AddProductInput`, `PurchaseCartInput`.
- **Base class is `Input`** (`src/core/models/Input.ts`). `*Filter` classes also `extend Input` — a filter is a kind of input.

**Decision test for a new arg type:** "Does this narrow a selection from many possibilities?" Yes → `Filter`. No → `Input`.

### Service interface vs implementation

- **Interface file: `<Domain>Service.ts`** (`HomeService`, `AuthService`, `CartService`, `ProductService`). One default-exported `interface`.
- **GraphQL implementation file: `Graphql<Domain>Service.ts`** (`GraphqlHomeService`, `GraphqlAuthService`, `GraphqlCartService`, `GraphqlProductService`). One default-exported `class implements <Domain>Service`.
- **Never** name an implementation `Remote<Domain>Service`, `Default<Domain>Service`, `<Domain>ServiceImpl`, or anything else. The `Graphql` prefix advertises the transport; future non-GraphQL impls would parallel it (`HttpHomeService`, `MockHomeService`, …) but currently every impl is GraphQL.
- Before adding a new service, **`ls src/core/services/<sibling-domain>/` to confirm the file/class names match this pattern.** A drifted name from a prior commit (e.g. the legacy `RemoteProductService` that shipped briefly in 2.x) is a bug to fix, not a precedent to follow.

### Service methods
- Parameter name matches the type suffix: `signIn(input: SignInInput)`, `getActiveCart(filter: GetActiveCartFilter)`.
- Never name a parameter `filter` if its type is an `*Input`.

### Other
- Classes, interfaces, types: `PascalCase`.
- Variables, functions, methods: `camelCase`.
- GraphQL string constants: `camelCase` (e.g. `signInMutation`), exported as `default`.
- File names match the default export: `SignInInput.ts` exports `SignInInput`.

---

## Code patterns

### Input/Filter class template
```typescript
import Input from '../../models/Input';

class FooInput extends Input {
    constructor(config: {
        required1: string;
        required2: number;
        optional?: string;
    }) {
        super();
        this.query['required1'] = config.required1;
        this.query['required2'] = config.required2;
        if (config.optional !== undefined) this.query['optional'] = config.optional;
    }
}

export default FooInput;
```
- Always a single `config` constructor arg — never positional.
- Required fields: always set on `this.query`.
- Optional fields: only set when defined.
- Never do logic in the constructor beyond field copying.

### Service interface + implementation template
```typescript
// FooService.ts
interface FooService {
    doThing(input: DoThingInput): Promise<FooResponse>;
}
export default FooService;
```
```typescript
// GraphqlFooService.ts
class GraphqlFooService implements FooService {
    constructor(private readonly client: GraphqlClient) {}

    async doThing(input: DoThingInput): Promise<FooResponse> {
        const response = await this.client.mutation(doThingMutation, { doThingInput: input.query });
        if (response.data?.doThing) {
            return FooResponse.fromJson(response.data.doThing);
        }
        throw new Error(`doThing failed: ${JSON.stringify(response.errors || response)}`);
    }
}
export default GraphqlFooService;
```
- Service method: check `response.data?.<op>` → `fromJson` it. Else throw with the errors serialized.
- No retries, no caching, no logging in services — `Client` handles all of that.

### Model template
```typescript
class Foo {
    constructor(
        public readonly id: string,
        public readonly name: string,
    ) {}

    static fromJson(json: Record<string, any>): Foo {
        return new Foo(json.id, json.name);
    }
}
export default Foo;
```
- Models are immutable (`readonly` fields).
- Every model has a static `fromJson(json)` factory. Never do JSON parsing outside `fromJson`.
- Never throw from `fromJson` on missing optional fields — default to `null`/empty.

### GraphQL string template
```typescript
const fooMutation = `
  mutation Foo($fooInput: FooInput!) {
    foo(fooInput: $fooInput) {
      id
      name
    }
  }
`;
export default fooMutation;
```
- One operation per file. File name matches operation name + `Mutation`/`Query`.

---

## Recipes

### Recipe: Add a new query to an existing service
1. Add `<Name>Filter.ts` (if selection) or `<Name>Input.ts` in `services/<domain>/`.
2. Add `queries/<Name>Query.ts` with the GQL string.
3. Add method to `<Domain>Service.ts` interface.
4. Implement in `Graphql<Domain>Service.ts` — follow the template above.
5. Export the new Input/Filter from `src/index.ts`.
6. Update or add tests in `src/test/index.ts` for smoke coverage.

### Recipe: Add a new mutation
Same as query, but use `mutations/<Name>Mutation.ts` and call `this.client.mutation(...)`.

### Recipe: Add a new service (new domain)
1. Create `src/core/services/<domain>/` with `<Domain>Service.ts` interface.
2. Implement `Graphql<Domain>Service.ts`.
3. Create `queries/` and `mutations/` subdirectories as needed.
4. Wire into `src/core/Platform.ts`: add property, instantiate in constructor.
5. Export public types from `src/index.ts`.

### Recipe: Add a new model
1. Choose domain subdirectory under `src/core/models/`.
2. Follow the Model template. Always include `fromJson`.
3. If the model is a consumer-facing response, export from `src/index.ts` under the `// Models` section.

---

## Anti-patterns (the reviewer will flag these)

- **`*Filter` suffix on mutation payloads.** Use `*Input`. (See naming conventions.)
- **Services that import `fetch` or `isomorphic-unfetch`.** Go through `GraphqlClient`.
- **Models that import services or `Client`.** Data layer has no dependencies on transport.
- **JSON parsing outside `fromJson`.** Don't inline `json.foo || ''` in service methods.
- **Multiple classes per file.** One default-exported class per file.
- **Silent failures in service methods.** If the response doesn't have the expected shape, `throw` with the serialized error.
- **`this.query['field'] = undefined`.** For optional fields, guard with `if (config.field !== undefined)`.
- **Positional constructor args on Input/Filter/Model classes.** Always `config: { … }`.
- **Logic in Input/Filter constructors.** They're just field copiers.
- **Catching errors and logging without rethrowing.** Let them propagate.

---

## Known stubs & bugs (don't replicate these patterns)

- `SearchFilter`, `ProductFilter`, `Search`, `Pagination`, `Aggregate`, `MetaData`, `WidgetData.fromJson` — empty stubs; fill in following the templates above.
- `GraphqlProductService.search()` throws `not implemented`.
- `Home.fromJson` has a JS comma-operator bug (malformed condition). Needs fix.
- `GetDynamicHomeQuery` has no field selection — returns scalar. Needs proper selection set.
- `src/core/models/home/Home.ts` imports `{ WidgetData }` from `"./types"` which doesn't exist. Broken import.

---

## Commands

```bash
npm run build       # tsc → /dist
npm run dev         # nodemon watch mode
npm run watch-ts    # tsc --watch
```

- `npm run build` must pass clean on every PR.
- Run smoke test via `src/test/index.ts` before claiming a feature works end-to-end.

---

## Release workflow

This package is published to npm and consumed by downstream apps (e.g. Pandora) **only via published versions**. Local-patching a consumer's `node_modules` is not a supported workflow — it silently goes away on the next `npm install` and breaks reproducibility.

The release flow uses **conventional commits** + `commit-and-tag-version`:

1. Commit your changes as a conventional commit. Bump level is derived from the prefix:
   - `feat: …` → minor bump (e.g. `2.0.1` → `2.1.0`)
   - `fix: …` → patch bump (e.g. `2.0.1` → `2.0.2`)
   - `feat!: …` or a `BREAKING CHANGE:` footer → major bump
   - `chore:` / `docs:` / `refactor:` → no version change unless paired with the above
2. Run `npx commit-and-tag-version`. This bumps `package.json` + `package-lock.json`, regenerates `CHANGELOG.md`, creates a release commit, and creates a git tag `vX.Y.Z`.
3. Run `git push --follow-tags origin main` — pushes the release commit and the tag.
4. The repo owner runs `npm publish`. **Claude does NOT run `npm publish`** — npm credentials live with the user.
5. After publish, downstream apps install via `npm install @sirosa/ecommerce-js-sdk@<new-version>`.

**Implementer agents must NOT manually edit `package.json` `"version"`.** `commit-and-tag-version` owns the version field; manual bumps drift from the conventional-commits → semver mapping the tool enforces. If a spec asks for a manual bump, treat that as a spec bug and flag it instead of doing it.

---

## Spec-driven workflow

Features begin as a spec under `/specs/<feature-name>/spec.md`. See `/specs/README.md` for the full workflow and `/specs/_template/` for the spec template. High level:

1. User writes (or asks Claude to draft) a spec.
2. `feature-implementer` agent reads the spec + this file, writes the code.
3. `feature-reviewer` agent reads the diff + spec + this file, reports violations.
4. User approves or sends it back.

Agents live in `.claude/agents/`.

---

## Consumer usage example

```typescript
import { Platform, HomeFilter, SignInInput } from '@sirosa/ecommerce-js-sdk';

const platform = new Platform({
    baseUrl: 'https://nextgentheadless.instaleap.io/api/v3',
    clientId: 'D1',
});

// Query (filter)
const filter = new HomeFilter({ byStore: '11808', byPlatform: 'WEB', byScreenSize: 'large' });
const home = await platform.homeService.home({ filter });

// Mutation (input)
const signIn = new SignInInput({ clientId: 'D1', email: 'a@b.com', password: '…' });
const session = await platform.authService.signIn(signIn);
platform.setToken(session.token);
```
