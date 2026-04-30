# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.0.0](https://github.com/jorgeehernandez/ecommerce-js-sdk/compare/v1.2.5...v2.0.0) (2026-04-30)


### ⚠ BREAKING CHANGES

* **platform:** Platform constructor now requires `apiKey: string` in
its config object. Consumers that omit the field will fail TypeScript
compilation.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>

### Features

* **platform:** add required apiKey config and setHeaders method ([f257d93](https://github.com/jorgeehernandez/ecommerce-js-sdk/commit/f257d9310dfa80fc4a92bc35b5917dc123932134))

## [1.2.5](https://github.com/jorgeehernandez/ecommerce-js-sdk/compare/v1.2.4...v1.2.5) (2026-04-28)

## [1.1.0](https://github.com/jorgeehernandez/ecommerce-js-sdk/compare/v1.0.8...v1.1.0) (2026-04-20)


### Features

* add guest cart queries and mutations ([#1](https://github.com/jorgeehernandez/ecommerce-js-sdk/issues/1)) ([91098ba](https://github.com/jorgeehernandez/ecommerce-js-sdk/commit/91098ba03e4e822107dc173a079f1b3c9bbafae7))
