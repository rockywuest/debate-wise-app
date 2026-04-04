# SOP: Close `CIIBestPracticesID` (Scorecard)

Last updated: April 4, 2026

## Goal

Close the open GitHub code-scanning alert `CIIBestPracticesID` by registering the repository on OpenSSF Best Practices and adding the badge to `README.md`.

## Procedure

1. Go to [OpenSSF Best Practices](https://www.bestpractices.dev/projects/new).
2. Sign in with GitHub and submit the project:
   - repository URL: `https://github.com/rockywuest/debate-wise-app`
   - project name: `Debate Wise`
3. Complete the project profile and save.
4. Copy the generated badge snippet or project ID.
5. Add the badge in `README.md` near the other status badges.
6. Merge the badge update through an approved PR.
7. Trigger and verify:
   - run `scorecard.yml` on `main`
   - check code-scanning alert state

## Badge snippet template

Replace `<project-id>` with the value from bestpractices.dev:

```md
[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/<project-id>/badge)](https://www.bestpractices.dev/projects/<project-id>)
```

## Verification checklist

- [ ] Project is registered at bestpractices.dev.
- [ ] `README.md` includes the OpenSSF badge with correct URL.
- [ ] Badge update was merged via approved PR.
- [ ] Scorecard workflow completed successfully on `main`.
- [ ] `CIIBestPracticesID` is closed in code scanning.

