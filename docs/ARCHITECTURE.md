# Architecture Overview

## High-Level Stack

- Frontend: React + TypeScript + Vite
- Data/Auth/Realtime: Supabase
- AI logic: Supabase Edge Functions

## Core Application Layers

1. UI Components (`src/components`)
- reusable UI primitives and feature components

2. Pages (`src/pages`)
- route-level compositions for debate, admin, analytics, auth

3. Hooks (`src/hooks`)
- business logic for debates, arguments, reputation, auth, realtime

4. Utilities (`src/utils`)
- i18n helpers, input validation, seed/demo utilities

## Data Model (Conceptual)

- `debatten`: debate topics and metadata
- `argumente`: argument nodes (supports parent-child thread structure)
- `argument_ratings`: rating actions (`insightful`, `concede_point`)
- `profiles`: user profile and reputation state
- `user_roles`: role-based access control

## Runtime Flows

1. Debate Flow
- user opens debate
- arguments load from Supabase
- realtime subscriptions update thread and rating changes

2. Argument Submission
- client-side validation and sanitization
- server-side validation RPC
- argument insert + optional source metadata

3. Reputation Flow
- rating action triggers secure RPC
- reputation updates recorded with reason and optional argument reference

## Security Model

- Supabase Auth for identity
- role checks for admin-only actions
- RPC-based guarded updates for sensitive operations
- input validation and rate limiting in critical write paths

## I18n Model

- English-first defaults
- EN/DE dual language support
- centralized helper in `src/utils/i18n.ts`

## Planned Evolution

- explicit `space_id` abstraction for public commons + private spaces
- moderation policy layer per space
- broader integration/e2e test coverage
