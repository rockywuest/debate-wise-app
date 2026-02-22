# Open-Source Strategy for Debate Wise

## Problem Statement

A pure "build your own community instance" model slows adoption:

- every new user group must provision infrastructure first
- network effects are fragmented
- contributor energy gets split across isolated deployments

## Recommended Model: Dual Distribution

### 1. Public Commons (default)

A shared public deployment where anyone can join, debate, and contribute.

Benefits:
- fastest onboarding
- stronger network effects
- clear feedback loop for product evolution

### 2. Self-Hosted Spaces (optional)

Organizations can run private/community-specific instances.

Benefits:
- sovereignty and compliance
- custom moderation policies
- branded deployments

## Architectural Implications

To support both modes cleanly:

- keep deployment independent from one fixed Supabase project
- support environment-based configuration only
- treat tenant/community boundaries as explicit product concepts
- define moderation primitives that work in both public and private contexts

## Suggested Near-Term Roadmap

1. Stabilize baseline quality
- remove hard-coded language and backend values
- reduce type/lint debt
- clean route inconsistencies and legacy artifacts

2. Build contributor ergonomics
- reliable setup docs
- issue/PR templates
- architecture and governance docs

3. Add "space" abstraction
- optional `space_id` on core entities
- space-level roles and moderation policies
- public-global feed plus per-space feed

4. Launch public instance
- host one official commons
- keep self-hosting docs maintained

## Operational Guides

- Self-hosted deployment: `docs/SELF_HOSTING.md`
- Public commons operations: `docs/PUBLIC_COMMONS_OPERATIONS.md`

## Success Metrics

- time-to-first-contribution
- active contributors/month
- debate quality retention (not just activity volume)
- deployment diversity (public usage + self-hosted installs)
