# Roadmap

Last updated: February 22, 2026

## North Star

Build the best open-source platform for constructive, evidence-based public discourse.

## Phase 1: Open-Source Foundation (Current)

- [x] English-first repository and governance baseline
- [x] CI quality gate and security audit
- [x] Core EN/DE localization in active flows
- [x] Community onboarding docs and templates
- [x] Security automation workflows (Dependabot, CodeQL, Scorecard)

## Phase 2: Community Flywheel

- [ ] Expand test coverage (integration + e2e smoke paths)
- [x] Add production route smoke checks for critical paths
- [x] Add initial integration tests for core auth and discovery flows
- [x] Add hook-level integration tests for auth and debate data flows
- [x] Add Playwright E2E smoke flows for core guest/auth journeys
- [x] Enforce frontend bundle budgets in quality checks
- [ ] Publish regular release notes and monthly roadmap updates
- [ ] First-contribution pipeline: curated issues + fast review SLA
- [ ] Contributor analytics dashboard (response times, merge times)
- [x] ADR baseline for core technical and product decisions
- [x] Baseline deployment and operations runbooks for both distribution modes

## Phase 3: Product Depth

- [ ] Multi-space model (`space_id`) for public + private deployments
- [ ] Space-scoped moderation policy primitives
- [ ] Better argument quality feedback loops and explainability
- [ ] Reputation transparency pages and appeals workflow

## Phase 4: Ecosystem and Scale

- [ ] Plugin-style extension points for moderation and scoring strategies
- [ ] Data export/import tooling for self-hosted migrations
- [ ] Reference infra guides for small, medium, and large deployments
- [ ] Localization expansion beyond EN/DE

## Prioritization Rules

- Protect quality and trust first (security, correctness, safety)
- Then reduce contributor friction (docs, tooling, review loops)
- Then ship product depth that improves societal discourse outcomes
