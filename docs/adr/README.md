# Architecture Decision Records (ADRs)

This directory stores key architecture and product decisions in a durable, reviewable format.

## Why ADRs

ADRs help contributors understand:

- why a decision was made
- what alternatives were considered
- what tradeoffs are accepted

## ADR Lifecycle

1. `Proposed`: draft decision under review
2. `Accepted`: current decision to follow
3. `Superseded`: replaced by a newer ADR
4. `Deprecated`: no longer recommended but still documented

## How to Add an ADR

1. Copy `docs/RFC_TEMPLATE.md` for broad product/governance proposals when needed.
2. Add a new file in this folder with the next number:
   - `ADR-0004-short-title.md`
3. Include:
   - status
   - date
   - context
   - decision
   - consequences
4. Link the ADR from `docs/ARCHITECTURE.md` if it affects core architecture.

## Current ADRs

- `ADR-0001-english-first-repository-and-bilingual-product.md`
- `ADR-0002-dual-distribution-public-commons-and-self-hosted.md`
- `ADR-0003-rpc-guardrails-for-sensitive-writes.md`
