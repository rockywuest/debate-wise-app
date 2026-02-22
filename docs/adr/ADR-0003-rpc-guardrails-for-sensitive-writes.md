# ADR-0003: RPC Guardrails for Sensitive Writes

- Status: Accepted
- Date: February 22, 2026

## Context

Debate Wise includes sensitive write paths:

- reputation updates
- moderation-related actions
- high-impact rating operations

Direct client writes on these paths can increase abuse risk and weaken policy enforcement.

## Decision

Use guarded RPC functions for sensitive write paths, with role and validation checks enforced server-side.

Client code should:

- validate and sanitize input early
- call secure RPCs for protected operations
- avoid direct table mutations for high-impact actions

## Consequences

- Better control over abuse prevention and integrity.
- A clear boundary for security reviews and tests.
- Slightly higher implementation effort when adding new sensitive actions.
