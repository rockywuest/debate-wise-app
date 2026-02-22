# ADR-0002: Dual Distribution (Public Commons + Self-Hosted)

- Status: Accepted
- Date: February 22, 2026

## Context

Requiring every adopter to bootstrap an isolated community instance creates adoption friction and fragments network effects.

A single public default can accelerate onboarding, while self-hosting remains necessary for organizations with policy or compliance needs.

## Decision

Debate Wise follows a dual-distribution model:

- Public Commons mode as the default user entry point
- Self-hosted spaces as an optional deployment mode

Roadmap and architecture should support both modes without forking core logic.

## Consequences

- Product and data models should evolve toward explicit space boundaries (`space_id`).
- Moderation and policy controls must work both globally and per-space.
- Documentation must cover both public participation and self-host deployment paths.
