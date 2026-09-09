# Sketch Flow

Sketch Flow is a JavaScript library for hand-drawn SVG diagrams with flexible editorial layouts. It is designed for explanatory visuals such as fan-out diagrams, decision trees and risk-routing flows, with self-contained SVG and high-resolution PNG export planned for the first public release.

The project is independent from [chart.xkcd](https://github.com/timqian/chart.xkcd). Sketch Flow takes inspiration from its visual language while owning a separate API, implementation and release lifecycle. See [ATTRIBUTION.md](ATTRIBUTION.md).

> **Status:** Pre-alpha repository bootstrap. The diagram API has not been released.

## Run

Requires Node.js 22 or newer.

```bash
npm ci
npm run lint
npm test
npm run build
```

## Deploy

Sketch Flow uses the SemVer profile described in [REPO-STANDARDS.md](REPO-STANDARDS.md). CI may create release tags after tested commits are promoted to `main`.

Publishing to npm is intentionally disabled. The package remains marked `private` until its public API, package ownership and release credentials are explicitly approved.

## Conventions

See [REPO-STANDARDS.md](REPO-STANDARDS.md) — conventional commits (no scopes),
explicit versioning profiles, lightweight GitFlow with disposable `release/*`
promotions, and SSH Git transport.

Coding agents start with [AGENTS.md](AGENTS.md). Claude Code imports the same
instructions through [CLAUDE.md](CLAUDE.md), avoiding duplicated agent rules.

---

**Bootstrapped from [aixaCode/repo-template](https://github.com/aixaCode/repo-template).**
