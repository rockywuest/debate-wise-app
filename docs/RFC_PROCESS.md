# RFC Process

Use this process for major changes that affect architecture, governance, moderation, security, or product semantics.

## When an RFC is Required

- data model or migration strategy changes
- moderation and safety policy changes
- reputation system rule changes
- multi-tenant/public commons architecture changes
- security-sensitive design changes

## Workflow

1. Open an issue with `[RFC]` in the title.
2. Add an RFC draft using `docs/RFC_TEMPLATE.md`.
3. Collect feedback for at least 7 days (or faster for urgent security fixes).
4. Maintainer decides: `accepted`, `rejected`, or `needs revision`.
5. If accepted, implementation PR must link back to RFC.

## Decision Criteria

- alignment with project mission
- technical soundness and operational risk
- security and abuse-resistance impact
- contributor and user experience impact
- migration and rollback clarity
