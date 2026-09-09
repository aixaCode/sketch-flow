# Repository Agent Guide

This is the vendor-neutral entry point for coding agents. Keep it concise and repository-specific. Shared engineering policy lives in `REPO-STANDARDS.md`; human setup and usage belong in `README.md`; deeper architecture and lessons belong under `docs/`.

## Start here

- Read `README.md`, `REPO-STANDARDS.md`, `docs/AI_CONTEXT.md`, and relevant decisions before changing the repository.
- Inspect `git status` and preserve unrelated or user-owned changes.
- Replace every placeholder in this file when creating a repository from the template.

## Repository map

- `src/index.js` — public visual-primitives entry point.
- `src/charts.js` — isolated chart.xkcd compatibility entry point.
- `src/primitives/` — theme, font, filter and SVG shape primitives.
- `examples/` — browser example for primitives and compatible charts.
- `licenses/` — retained upstream licence notices.
- `test/` — Node test suite.
- `docs/AI_CONTEXT.md` — architecture and delivery context.
- `docs/DECISIONS.md` — durable project decisions.
- `dist/` — generated package output; never edit or commit it.
- `.github/workflows/` — required CI, PR-title and SemVer-tag automation.

## Commands

```text
install: npm ci
lint:    npm run lint
test:    npm test
build:   npm run build
```

Do not claim a check passed unless it was run successfully. If a command requires credentials, external services, or unsupported tooling, state that limitation.

## Project rules

- Follow nearby code and test patterns.
- Keep changes focused; do not combine unrelated cleanup or dependency upgrades.
- Add or update tests when behavior changes.
- Update durable documentation when a change invalidates it.
- Keep the package independent from `aixaCode/chart.xkcd`; depend only on the exact tested public npm version through the isolated `./charts` compatibility entry point.
- Preserve attribution and applicable licence notices for any implementation or asset adapted from upstream projects.
- Render diagrams as pure SVG. Do not introduce HTML `foreignObject` without recording and testing a justified exception.
- Keep layout, geometry, rendering and export concerns in separate modules.
- Keep output deterministic when a seed is provided so visual regression tests remain meaningful.
- Do not enable npm publishing or remove `private: true` without explicit release authorization.
- Start work from `development` on a typed working branch. Merge working PRs
  into `development` first. Before promotion, ensure `development` contains
  `main`, then promote the exact tested commit through a disposable
  `release/<version-or-date>` branch and a non-squash PR to `main`. Never use
  the long-lived `development` branch itself as the promotion PR head.

## Context documentation

- Keep architecture, data flow, integration boundaries, and verified operational context in `docs/AI_CONTEXT.md`.
- Record non-obvious decisions and regression-prevention lessons in `docs/DECISIONS.md`.
- Keep instructions verifiable and current; mark unknowns instead of inventing commands or guarantees.

## Safety

- Never print, store, or commit credentials, private keys, tokens, passwords, service-account files, or personal data.
- Treat deployments, releases, destructive migrations, and writes to production or shared environments as external side effects requiring explicit authorization.
- Use SSH for Git fetch and push. Keep GitHub remotes in SSH form, such as `git@github.com:OWNER/REPOSITORY.git`.
- GitHub CLI authentication is required only for GitHub API operations such as creating or editing pull requests, issues, or releases—not for ordinary SSH Git transport.

## Repository-specific exceptions

- Versioning profile: SemVer. CI tags promoted commits on `main`; npm publishing is not yet configured.
- Deployment: none. This is a library and the placeholder deployment workflow has been removed.
