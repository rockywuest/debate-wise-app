# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Playwright end-to-end smoke tests and CI `e2e` job
- Bundle budget guardrail in quality checks
- Not-found fallback route for unknown paths

### Changed
- Dependabot configuration now groups updates and limits open PR volume
- i18n consistency check now works even when `rg` is unavailable

### Removed
- legacy, unreferenced router/pages stack (`AppContent`, `Landing`, `Imprint`, `Privacy`, old `Debate` aliases)
- `bun.lockb` (npm is the canonical package manager for this repository)
