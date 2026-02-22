# Security Policy

## Supported Versions

This project is early-stage. Security fixes are applied to the default branch first.

## Reporting a Vulnerability

Please do not open public issues for security vulnerabilities.

Use GitHub private vulnerability reporting:

- [Report a vulnerability](https://github.com/rockywuest/debate-wise-app/security/advisories/new)

Include the following details with your report:

- vulnerability description
- reproduction steps
- impact assessment
- suggested mitigation (if available)

You should receive an initial response within 5 business days.

## Scope Highlights

Security-sensitive areas include:

- Supabase RLS policies and SQL functions
- auth/session handling
- rate limiting and abuse controls
- edge function input validation
- user-generated content rendering and sanitization
