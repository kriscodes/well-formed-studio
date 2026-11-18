# Well Formed Studio staging

Import [`render.staging.yaml`](../render.staging.yaml) only after review, in the **Well Formed Studio** workspace. It creates `well-formed-studio-staging` at `staging.wellformedstudio.com`. This site is static: no API, database, payment backend, or contact service is needed.

The proposed production Blueprint now follows `main` after CI passes; the live provider currently has automatic deployment off. This local change does not enable it. Both environments retain prelaunch protections, noindex, disabled contact/payment actions, and the existing CSP. The new CI runs source checks, TypeScript, payment-link tests, and a production build with Node 22.23.4.

## Promotion workflow

1. Work on a feature/review branch. Open a pull request to `staging` and require the repository's existing CI checks. CI runs on pull requests and pushes to both `staging` and `main`.
2. After initial activation, staging services follow `staging` with `autoDeployTrigger: checksPass`. Wait for the actual deployed revision, then verify the UI, API health, error/denial behavior, and relevant persistence using synthetic data.
3. Promote the reviewed changes through a `staging` → `main` pull request. Require CI again and verify its source tree matches the version reviewed in staging, apart from documented environment settings. If it differs, test that candidate in staging first.
4. Production remains a deliberate promotion to its configured production branch. Do not merge or change a Blueprint while review-only work is pending: Blueprint sync can itself change infrastructure or trigger a build.
5. Retain the previous successful deployment. Roll back application code only after checking database compatibility; application rollback does not roll back database contents. Rehearse restore/migration work on an isolated copy with synthetic fixtures.

## Initial activation — still pending

These commits prepare configuration; no resource, DNS record, remote branch, provider setting, or deployment was changed. Creating a Render service triggers its first deployment even when automatic deployments are off. Activate only after the user reviews the result and asks to deploy.

At activation, create `staging` from the approved source, review the provider's Blueprint plan, confirm workspace/resource names and costs, configure stage-only secrets, and install the exact DNS records Render provides. Set up branch protection separately; workflow files do not create branch protection. Keep Blueprint Auto Sync off during initial wiring and review future configuration syncs explicitly.

Use the custom staging domains for end-to-end checks. `onrender.com` aliases are not automatically included in browser origin allowlists. Staging is public unless separately access-controlled; `X-Robots-Tag: noindex, nofollow, noarchive` discourages indexing but is not authentication. Use synthetic data only.
