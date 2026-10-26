# Notes: cart drawer fields — live probe and release order

For the SDK maintainers. Nothing here has been run against a deployed Deadpool: the authoring session had no credentials and was told not to call any backend. This file is the gate between "the tests pass" and "Nimrod builds receive this SDK".

## Why this gate exists

- Nimrod resolves the SDK through `@mercadoni/websdk` (`^3.4.0`) and `@mercadoni/cli` (`^3.3.1`, pins websdk exactly) and installs `@mercadoni/cli` with no lockfile. The newest 3.x on the registry is what the next Nimrod build installs, for tenants not yet flipped too.
- Deadpool runs Apollo Server 3 (`apollo-server-express ^3.13.0`): a selection the deployed schema lacks is rejected at validation with HTTP 400, so one unserved field fails every cart read. Nimrod then clears the shopper's cart handle.
- A `^` range resolves against **all published versions**, not dist-tags. Publishing a stable `3.5.0` under `--tag next` would still be installed by `^3.4.0`. Only a semver **prerelease** version (`3.5.0-rc.0`) is skipped by `^3.4.0`; the dist-tag is secondary.

## What was verified offline

- `graphql_schema.graphql` is regenerated from Deadpool's `development` branch at `7eb1bfb` (2026-10-20; the Nimrod spec cites `2ef01ccb` from an older checkout, and the two schemas differ by 14 added lines that touch no selected field): `src/new-generation/typedefs/*/*.graphql` in the order Deadpool loads them (`loadFilesSync` glob, sorted), duplicate `type Query`/`type Mutation` blocks and the duplicate `OperationalModel` enum merged, repeated `scalar` lines dropped, `#` comments stripped, default `@deprecated` reasons omitted, `Query` and `Mutation` fields unindented as in the previous copy. The method was checked by rebuilding the previous copy from Deadpool at `8460159c` (2026-04-15): 8 diff lines remained (enum value order, one indentation). `@graphql-tools/merge`, which Deadpool itself uses, was not available offline.
- With graphql-js 16 (`validate`) every operation in the `queries/` and `mutations/` folders of the v3 services (address, auth, cart, category, product; 34 in 3.4.0, 36 now; `home` has a single untyped `JSON` query that selects nothing) was validated against the schema. 3.4.0 against the previous copy and against the refreshed one: only `validateEcommerceCart` and `updateCouponInEcommerceCart` fail (`Cannot query field "deliverySlot" on type "ValidatedCartModel"`); this change: 0 invalid against the refreshed schema, while the three validation operations are invalid against the previous copy (`metadata`), which is why the refresh belongs to this change. `tests/cart-drawer-fields.test.ts` repeats this for every cart operation without a dependency.
- The probe script below was run against a local stand-in server (graphql-js, 400 on validation errors) and reproduced the `deliverySlot` failure of the 3.4.0 `validateEcommerceCart` selection.
- Selection changes against 3.4.0 (field paths, from the built operations; nothing else changed, nothing was removed except `deliverySlot` from the authenticated validation):
  - `getGuestCart`, `getEcommerceCart` (and every other operation that returns the shared cart): `products.type`, `products.createdAt`, `specialProducts.createdAt`, `pricesSummary.productsSummary { 11 fields }`.
  - `validateGuestCart`: `products.type`, `products.createdAt`, `products.isSample`, `products.clickMultiplier`, `pricesSummary.productsSummary { 11 fields }`, `validationIssues.metadata { minUnitQuantity maxUnitQuantity clickMultiplier suggestedUnit }`.
  - `validateEcommerceCart`: the same as `validateGuestCart` plus `specialProducts.createdAt` and `address.address.other`; minus `deliverySlot { id from to expiresAt type }`. `updateCouponInEcommerceCart` uses the same selection (without `groups` and `loyalty`).
  - New operations: `deleteGuestCart` and `deleteSpecialProductInEcommerceCart`, both returning the shared cart selection.

## Regenerating `graphql_schema.graphql`

The refreshed copy is the output of this script on Deadpool at `7eb1bfb` (it is not part of the repository). Run on `8460159c` it reproduces the previous copy except for 8 diff lines.

```python
# Usage: python3 -I build-schema.py <deadpool>/src/new-generation/typedefs > graphql_schema.graphql
import glob, re, sys

blocks = []
for f in sorted(glob.glob(sys.argv[1] + "/*/*.graphql")):  # the order Deadpool loads them
    cur = None
    for raw in open(f).read().split("\n"):
        line = re.sub(r"\s*#.*$", "", raw).rstrip()
        if not line.strip():
            continue
        if cur is None:
            if re.match(r"^scalar \w+$", line):
                blocks.append(("scalar", line.split()[1], [line]))
                continue
            m = re.match(r"^(type|input|enum|interface|union)\s+(\w+)", line)
            assert m, (f, raw)
            cur = (m.group(1), m.group(2), [])
        cur[2].append(line)
        if line.strip() == "}":
            blocks.append(cur)
            cur = None
    assert cur is None, f

def name_of(kind, line):
    s = line.strip()
    return s if kind == "enum" else re.split(r"[(:\s]", s, 1)[0]

order, merged = [], {}
for kind, name, lines in blocks:
    key = (kind, name)
    if key not in merged:
        merged[key] = {"head": lines[0], "body": []}
        order.append(key)
    if kind == "scalar":
        continue
    body = merged[key]["body"]
    for l in lines[1:-1]:  # duplicate type/enum blocks are merged, first occurrence wins
        if all(name_of(kind, b) != name_of(kind, l) for b in body):
            body.append(l)

out = []
for kind, name in order:
    b = merged[(kind, name)]
    if kind == "scalar":
        out.append(b["head"])
        continue
    body = [l.replace('@deprecated(reason: "No longer supported")', "@deprecated") for l in b["body"]]
    if name in ("Query", "Mutation"):
        body = [l.strip() for l in body]
    out.append("\n".join([b["head"]] + body + ["}"]))
sys.stdout.write("\n\n".join(out) + "\n")
```

## Probe

Use throwaway carts. The cases marked **destructive** delete the cart or line they name.

### Setup

Put the 3.4.0 package and the release candidate side by side (GitHub Packages auth as for any `@mercadoni` install; or `git worktree add ../sdk-3.4.0 v3.4.0 && npm ci && npm run build` for 3.4.0):

```bash
mkdir probe && cd probe && npm init -y
npm i sdk340@npm:@mercadoni/pandora-js-sdk@3.4.0 sdkrc@npm:@mercadoni/pandora-js-sdk@3.5.0-rc.0
# SDK_DIR=$PWD/node_modules/sdk340 for 3.4.0, $PWD/node_modules/sdkrc for the candidate
```

Save the script as `probe.mjs` (Node 18+). It sends the SDK's own operation strings (so the text is exactly what a consumer sends), plus two extra operations that select what the SDK does not. `--print` shows the exact GraphQL.

```js
// Usage: node probe.mjs <case> [--print]
// Env: SDK_DIR (SDK package dir to read the operations from), URL (Deadpool v3 endpoint), API_KEY (dpl-api-key),
//      TOKEN (customer token, signed-in cases only), CART_ID (omit to use an id that does not exist), SPECIAL_PRODUCT_ID
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const sdkOp = (kind, file) => require(join(process.env.SDK_DIR, 'dist/cjs/core/services/cart', kind, `${file}.js`)).default;

const METADATA = 'minUnitQuantity maxUnitQuantity clickMultiplier suggestedQuantity selectedFormat suggestedUnit';
const lineIssues = (root) => `mutation ProbeLineIssues($cartId: ID!) { ${root}(cartId: $cartId) {
  id
  validationIssues { reason type productId metadata { ${METADATA} } }
  products { id name unit unitQuantity minUnitQuantity maxUnitQuantity clickMultiplier type
    validationIssues { reason type productId metadata { ${METADATA} } } }
} }`;

const cartVars = () => ({ cartId: process.env.CART_ID ?? '000000000000000000000000' });
const CASES = {
  getGuestCart: { auth: 'guest', gql: () => sdkOp('queries', 'GetGuestCartQuery'), vars: cartVars },
  getEcommerceCart: { auth: 'signed-in', gql: () => sdkOp('queries', 'GetEcommerceCartQuery'), vars: cartVars },
  validateGuestCart: { auth: 'guest', gql: () => sdkOp('mutations', 'ValidateGuestCartMutation'), vars: cartVars },
  validateEcommerceCart: { auth: 'signed-in', gql: () => sdkOp('mutations', 'ValidateCartMutation'), vars: cartVars },
  lineIssuesGuest: { auth: 'guest', gql: () => lineIssues('validateGuestCart'), vars: cartVars },
  lineIssuesSignedIn: { auth: 'signed-in', gql: () => lineIssues('validateEcommerceCart'), vars: cartVars },
  // new SDK only; destructive: use a throwaway cart, or leave CART_ID unset
  deleteGuestCart: { auth: 'guest', gql: () => sdkOp('mutations', 'DeleteGuestCartMutation'), vars: cartVars },
  deleteSpecialProduct: {
    auth: 'signed-in',
    gql: () => sdkOp('mutations', 'DeleteSpecialProductMutation'),
    vars: () => ({ deleteSpecialProductInCartInput: { ...cartVars(), specialProductId: process.env.SPECIAL_PRODUCT_ID ?? '000000000000000000000000' } }),
  },
};

const [name, flag] = process.argv.slice(2);
const c = CASES[name];
if (!c) { console.error(`cases: ${Object.keys(CASES).join(', ')}`); process.exit(2); }
const gql = c.gql();
if (flag === '--print') { console.log(gql); process.exit(0); }

const headers = { 'content-type': 'application/json', 'dpl-api-key': process.env.API_KEY };
headers.token = c.auth === 'signed-in' ? process.env.TOKEN : ''; // as the SDK's client: guest mode is an empty token
const res = await fetch(process.env.URL, { method: 'POST', headers, body: JSON.stringify({ query: gql, variables: c.vars() }) });
const body = await res.json().catch(() => null);
const root = body?.data && Object.values(body.data)[0];
const cart = root?.cart ?? root;
console.log(JSON.stringify({
  case: name,
  httpStatus: res.status, // 400 = selection rejected by the backend; 200 with errors = selection served
  errors: body?.errors?.map((e) => ({ message: e.message, code: e.extensions?.code })),
  lines: cart?.products?.map((p) => ({ id: p.id, type: p.type, createdAt: p.createdAt, isSample: p.isSample, clickMultiplier: p.clickMultiplier, issues: p.validationIssues })),
  productsSummary: cart?.pricesSummary?.productsSummary,
  streetLine: cart?.address?.address?.other,
  issues: cart?.validationIssues,
}, null, 2));
```

```bash
export URL=https://<deadpool-host>/api/v3 API_KEY=<dpl-api-key> TOKEN=<customer token> CART_ID=<cart id>
SDK_DIR=$PWD/node_modules/sdk340 node probe.mjs getGuestCart
```

`httpStatus` 400 means the selection was rejected; 200 with a cart error means it was served. Guest mode is an empty `token` header, as the SDK's client sends it (the script does the same for guest cases). Leave `CART_ID` unset to use an id that does not exist: validation runs before the resolver, so a 200 with a "not found"-style error proves the selection is served without touching a cart. The `lines`/`issues` output is meaningful only with a real cart.

### A. Selections are served (staging and production, no real carts needed)

| # | Run | SDK | Expect | Record |
|---|-----|-----|--------|--------|
| A1 | `getGuestCart`, `getEcommerceCart`, `validateGuestCart`, `validateEcommerceCart` | 3.4.0 | by the schema: 200 for the first three, 400 for `validateEcommerceCart` (`deliverySlot`) | the status of each, per environment: does 3.4.0 fail today? A 200 for `validateEcommerceCart` would mean the deployed schema differs from `7eb1bfb` |
| A2 | the same four | candidate | 200 with an error from the cart lookup, never 400 | status and message of each, per environment |
| A3 | `deleteGuestCart`, `deleteSpecialProduct` | candidate | 200 with an error from the cart lookup (fake ids) | status per environment |
| A4 | `lineIssuesGuest`, `lineIssuesSignedIn` | any | 200 | whether the deployed schema serves per-line `validationIssues`, `suggestedQuantity` and `selectedFormat` (both are outside this change's selection; 400 is information, not a failure) |

If any A2 or A3 is a 400 on an environment, stop: the candidate must not be promoted. Read the `errors[].message` to see which field the environment lacks.

### B. Values (staging, real throwaway carts)

| # | Cart | Run | Record |
|---|------|-----|--------|
| B1 | a cart with a `BAG` line (the cart engine adds package and bag lines), guest and signed-in | `getGuestCart` / `getEcommerceCart`, candidate | the `type` values seen (`DEFAULT`, `PACKAGE`, `SAMPLE`, `BAG`, other); `createdAt` present and its shape (the schema's `Date` scalar: ISO string or number? the model passes it through as `string | null`); `productsSummary` object or null, and whether its `...BeforeTaxes` values are zero beside positive taxed ones |
| B2 | a cart with a weighted line (a unit such as `kg`) and a sample line | `validateGuestCart` / `validateEcommerceCart`, candidate | `clickMultiplier` of the weighted line (and of a plain line: null or 1?); `isSample` true on the sample line |
| B3 | a cart with a minimum-quantity issue and another with a maximum-quantity issue (and, if one is reachable, a multiple-of-multiplier issue) | `validate*` then `lineIssues*`, candidate | per issue `reason`: which `metadata` keys arrive (`minUnitQuantity`, `maxUnitQuantity`, `clickMultiplier`, `suggestedUnit`, and `suggestedQuantity`, `selectedFormat`); whether the cart-level `issues` repeat each line's own `issues` with the same metadata (Moira reads the line's list; the Nimrod plan joins the cart-level list by `productId`) |
| B4 | a signed-in cart with an address | `validateEcommerceCart`, candidate | `streetLine` (`address.address.other`) present |
| B5 | a throwaway guest cart; a signed-in cart that holds a special product (a call-center special line; guest carts hold none) | `deleteGuestCart`, `deleteSpecialProduct` (**destructive**) | the answer: the returned cart id and whether its lines are empty |

Paste both tables, filled in, in the SDK pull request. The same A cases on production are the "same selections against the production endpoint" of the acceptance.

## Release order

1. Merge this pull request. It contains `feat` commits, so the release flow bumps the minor (3.4.0 → 3.5.0). The version and `CHANGELOG.md` are the release flow's; they are not edited in this pull request.
2. Cut a **prerelease** of the same tree on a throwaway branch from `main`, not on `main`: `npx commit-and-tag-version --prerelease rc` gives `3.5.0-rc.0`. Publish it with an explicit non-latest tag: `npm publish --tag next` (`prepublishOnly` builds). Do **not** push the `v3.5.0-rc.0` tag to `origin` (delete the local tag afterwards):
   - `publish.yml` runs a bare `npm publish` on every `v*` tag. npm 11 refuses a prerelease without `--tag`; npm releases before 11 publish it under `latest`. Either way the workflow cannot publish to a chosen tag, and changing it is outside this change.
   - `bump-version.yml` offers only `patch`, `minor` and `major`; it cannot cut a prerelease.
   - Check the result: `npm view @mercadoni/pandora-js-sdk dist-tags --registry=https://npm.pkg.github.com`. `latest` must still be `3.4.0`. Whether GitHub Packages keeps dist-tags other than `latest` is **unverified** (a community thread reports it did not); the plan does not depend on it, because the prerelease version is what keeps `^3.4.0` away, and an explicit `@3.5.0-rc.0` install works either way.
3. In a Nimrod branch, make the installed websdk resolve the candidate (however that branch installs the cli, the `Dockerfile` or the workflows) and confirm with `npm ls @mercadoni/pandora-js-sdk` that `3.5.0-rc.0` is the one in use. Run the probe against staging, then production (section A, then B on staging).
4. Only if every A case passes on both: promote by publishing the stable `3.5.0` from `main` through `bump-version.yml` (`minor`) — the same tree as the candidate. A stable version is what `^3.4.0` matches, so **this publish is the moment every Nimrod build receives the SDK**; there is no retag that achieves it, because retagging the prerelease as `latest` would not change what `^3.4.0` resolves.
5. Then the downstream steps below, in the same cycle.

## Not part of this pull request (maintainers)

- **websdk repository** (Bastion; not available to the authoring session): its `src/index.ts` lists re-exports explicitly. Add `ValidateCartInput`, `ValidateGuestCartInput` and `RemoveSpecialProductInput`, and the model types the Nimrod plan reads: `Cart`, `CartProduct`, `SpecialProduct`, `PricesSummary`, `ProductsSummary`, `ValidatedCart`. The SDK root exports all of them as of this change; `SpecialProduct`, `PricesSummary` and `ProductsSummary` were not exported before it. Raise its SDK floor to the new version so a fresh install cannot resolve an SDK without the fields.
- **cli**: publish the `@mercadoni/cli` that pins that websdk.
- **Nimrod**: one pull request bumps `@mercadoni/cli@2.2.0` to it in the six places that pin it, together: `Dockerfile`, `.github/workflows/ai-issue-pr.yml`, `ai-review-fix.yml`, `ai-spec-task.yml`, `bundle-budget.yml`, `storybook-build.yml` (a partial bump tests one version in CI and ships another). Update both mentions of "SDK 3.3.1" in its `docs/shopping-cart.md`. Then `il check`, `npm test` and `il build` (or the Docker build) there.

