# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [3.2.0](https://github.com/mercadoni/pandora-js-sdk/compare/v3.0.0...v3.2.0) (2026-08-29)


### Features

* add AddressService + wire into Platform ([abf5161](https://github.com/mercadoni/pandora-js-sdk/commit/abf5161eb7a03f452524446790166dabb50dbf09))
* add category tree services and models ([db33142](https://github.com/mercadoni/pandora-js-sdk/commit/db331420fc0f53ea4c7e043039abd299d2567a54))
* add fulfillment service files (models, service, filters) ([cadd46f](https://github.com/mercadoni/pandora-js-sdk/commit/cadd46fe455c6e54601af7436e1d3ee8bce5d7d0))
* add fulfillmentService + categoryService to Platform (v3.0.0 merge) ([85e947a](https://github.com/mercadoni/pandora-js-sdk/commit/85e947ad90b72afeb3bf7b43397236cb75bb655f))


### Bug Fixes

* **fulfillment:** address PR [#9](https://github.com/mercadoni/pandora-js-sdk/issues/9) review findings ([52b8816](https://github.com/mercadoni/pandora-js-sdk/commit/52b881630f01c88e085ec77bd5c7ea1cdb31628f))

## [3.0.0](https://github.com/mercadoni/pandora-js-sdk/compare/v2.4.6...v3.0.0) (2026-08-27)

### ⚠ BREAKING CHANGES

* use native globalThis.fetch, drop isomorphic-unfetch

### Features

* use native globalThis.fetch, drop isomorphic-unfetch ([2c05bba](https://github.com/mercadoni/pandora-js-sdk/commit/2c05bba7282dc5fc6e88bd627025971c72ae77ce))
## [2.4.5](https://github.com/mercadoni/pandora-js-sdk/compare/v2.4.4...v2.4.5) (2026-08-27)

## [2.4.4](https://github.com/mercadoni/pandora-js-sdk/compare/v2.4.3...v2.4.4) (2026-08-26)

## [2.4.3](https://github.com/mercadoni/pandora-js-sdk/compare/v2.4.2...v2.4.3) (2026-08-26)

## [2.4.2](https://github.com/mercadoni/pandora-js-sdk/compare/v2.4.1...v2.4.2) (2026-08-26)

## [2.3.0](https://github.com/instaleap/pandora-js-sdk/compare/v2.2.2...v2.3.0) (2026-05-13)


### Features

* **product:** implement searchProducts — fill search stubs end-to-end ([2657906](https://github.com/instaleap/pandora-js-sdk/commit/2657906c4e2013cda625d06aeb63f063c22d6cd4))


### Bug Fixes

* update project references from ecommerce-js-sdk to pandora-js-sdk ([5a92d21](https://github.com/instaleap/pandora-js-sdk/commit/5a92d2161ad8a882a27446d4323e240d03d44731))

## [2.2.2](https://github.com/instaleap/pandora-js-sdk/compare/v2.2.1...v2.2.2) (2026-04-30)


### Bug Fixes

* **build:** wipe dist before tsc to keep publishes free of stale artifacts ([3d81efe](https://github.com/instaleap/pandora-js-sdk/commit/3d81efe3cbecdd07cd6b427442d6e52e91e2580f))

## [2.2.1](https://github.com/instaleap/pandora-js-sdk/compare/v2.2.0...v2.2.1) (2026-04-30)


### Bug Fixes

* **product:** rename RemoteProductService to GraphqlProductService ([b5b7864](https://github.com/instaleap/pandora-js-sdk/commit/b5b78646355ae471699293eaf3de26d97a297b7d))

## [2.2.0](https://github.com/instaleap/pandora-js-sdk/compare/v2.0.1...v2.2.0) (2026-04-30)


### Features

* **product:** add getProductsBySKU, getSuggestedProducts, getProductRecommendations ([a15420e](https://github.com/instaleap/pandora-js-sdk/commit/a15420e4b4615944b761fd28317f2473411f9246))

## [2.0.1](https://github.com/instaleap/pandora-js-sdk/compare/v2.0.0...v2.0.1) (2026-04-30)


### Bug Fixes

* **platform:** use kebab-case dpl-api-key header name ([5942d04](https://github.com/instaleap/pandora-js-sdk/commit/5942d04d4c2716c0ef80d68027fc0c94cb78298c))

## [2.0.0](https://github.com/instaleap/pandora-js-sdk/compare/v1.2.5...v2.0.0) (2026-04-30)


### ⚠ BREAKING CHANGES

* **platform:** Platform constructor now requires `apiKey: string` in
its config object. Consumers that omit the field will fail TypeScript
compilation.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

### Features

* **platform:** add required apiKey config and setHeaders method ([f257d93](https://github.com/instaleap/pandora-js-sdk/commit/f257d9310dfa80fc4a92bc35b5917dc123932134))

## [1.2.5](https://github.com/instaleap/pandora-js-sdk/compare/v1.2.4...v1.2.5) (2026-04-28)

## [1.1.0](https://github.com/instaleap/pandora-js-sdk/compare/v1.0.8...v1.1.0) (2026-04-20)


### Features

* add guest cart queries and mutations ([#1](https://github.com/instaleap/pandora-js-sdk/issues/1)) ([91098ba](https://github.com/instaleap/pandora-js-sdk/commit/91098ba03e4e822107dc173a079f1b3c9bbafae7))
