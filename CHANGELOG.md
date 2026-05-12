# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

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
