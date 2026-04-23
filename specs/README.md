# Specs — spec-driven workflow

Every non-trivial feature lives as a spec under this directory before any code is written. The spec is the source of truth for what "done" means; the implementer agent builds to it, the reviewer agent checks against it.

## Layout

```
specs/
  README.md                 ← this file
  _template/
    spec.md                 ← copy this to start a new spec
  <feature-name>/
    spec.md                 ← the spec itself
    notes.md                ← optional scratch / research / open questions
```

One directory per feature. `kebab-case` names (`search-service`, `wishlist`, `guest-checkout`).

## Workflow

1. **Draft.** User (or Claude) copies `_template/spec.md` into a new `specs/<feature>/spec.md` and fills it in.
2. **Review the spec.** Read it top-to-bottom. If anything is vague, fix the spec — not the code later.
3. **Implement.** Invoke the `feature-implementer` agent with a pointer to the spec. It reads `CLAUDE.md` + the spec, produces code.
4. **Review the code.** Invoke the `feature-reviewer` agent on the diff. It reports violations against `CLAUDE.md` conventions and spec acceptance criteria.
5. **Iterate.** Fix feedback. Re-run reviewer. Merge.

## What a good spec looks like

- **Short.** If it's longer than one screen of text, it's probably two features.
- **Concrete.** Names the exact files that will be added/modified, the exact method signatures, the exact GraphQL operations.
- **Acceptance criteria are testable.** "Returns a `Search` model with products, pagination, and aggregates populated" — not "search works well."
- **Scoped.** A non-goals section is mandatory. Without it, scope creeps.

## Anti-patterns in specs

- Unbounded "could also add" sections. Cut them or move to a follow-up spec.
- Implementation detail that isn't in the acceptance criteria. If it isn't tested or observable, don't pin it down in the spec.
- Copying `CLAUDE.md` conventions into the spec. Reference them; don't duplicate.
