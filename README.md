# Well Formed Studio

A one-page, responsive TypeScript website for Well Formed Studio, operated by Kristian Salmeron. It is an isolated static project, prepared for Render static hosting.

The site is deliberately in **prelaunch** mode. It does not collect inquiries, expose a personal email address, accept payment, or create a repair booking. No backend, Stripe secret key, payment form, or customer database is included.

## Offer and payment order

The offer is **$195 USD for one agreed website defect**, estimated at **60–90 minutes of implementation and verification**. That is an effort estimate, not a delivery promise or a guarantee that every issue qualifies.

Before requesting payment, Kristian and the customer must agree in writing on:

- The customer's authority to commission the work, including agency/client authorization where applicable.
- The single defect, the expected result, and whether the repair is feasible within the offer.
- The access and materials needed to implement and verify the change.
- Kristian's available capacity and the delivery timeframe.
- How the customer will review the result and who may publish the change.

Only after that agreement should the customer receive a real, approved Stripe hosted checkout link. A public static page cannot verify a customer's authorization or enforce this agreement. A UI flag is a presentation control, not a qualification or access-control system.

## Local development

Use Node.js 22.12.0 or newer and npm. From this project directory:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To run the checks and produce the static output:

```sh
npm run lint
npm test
npm run build
```

The production files are emitted to `dist/`. The build has no runtime server requirement.

`npm run check` runs lint, tests, and the production build together. Here, `lint` means strict TypeScript checking plus the assertions in `scripts/check-source.mjs`; it does not run ESLint. `npm test` runs four Node test cases covering closed defaults, readiness requirements, the allowed Stripe URL shape, and rejected unsafe/test URLs. `npm run preview` serves the existing production build for local inspection.

## Configuration

Review `src/config.ts` before changing the prelaunch state. The shipped `siteConfig` has `status: 'prelaunch'`, `operator: 'Kristian Salmeron'`, contact disabled with an empty URL, and checkout configured with `paymentsReady: false`, `repairAgreed: false`, and an empty `stripePaymentLink`.

The public marketing page always keeps checkout unavailable and does not bind a payment URL, even if checkout configuration is edited. Its contact button is also hard-disabled; editing `contact` alone does not create or enable an inquiry workflow. A later launch change needs an appropriate business contact channel, implementation review, and updated checks.

Everything in this static project, including build-time environment values and configuration, is public once deployed. Never add Stripe API keys, webhook secrets, account credentials, customer information, private repair scopes, or personal contact information.

This source does not activate Stripe. Complete merchant setup separately, verify the merchant details and approved offer, and create a real Stripe hosted checkout link. Test the full checkout flow separately in Stripe's test environment, then verify the live amount and currency are $195 USD for the agreed repair. Never treat a successful redirect back to the site as proof of payment.

`src/payments.ts` provides `getApprovedPaymentLink({ repairAgreed, paymentsReady, stripePaymentLink })` for a future approved-repair flow. It returns a link only when both readiness flags are true and the URL is an allowed, non-test `https://buy.stripe.com/…` link with a single alphanumeric path segment. Other hosts, protocols, credentials, nondefault ports, query strings, fragments, empty paths, and Stripe test links are rejected. The helper does not verify Stripe activation, the checkout amount, payment status, the customer's identity, or the existence of an agreement. No part of the public page uses it to expose payment.

For the intended qualification-first workflow, keep payment unavailable on the public site and send the approved repair's payment link privately after the written agreement. Do not place a reusable general payment link on this page as a shortcut around qualification.

## Render handoff

This project is suitable for a Render **Static Site** with:

| Setting | Value |
| --- | --- |
| Build command | `npm ci && npm run build` |
| Publish directory | `dist` |
| Runtime | Static |
| Start command | None |

If this directory is placed inside a larger repository, set the Static Site's root directory to `well-formed-studio`. If this directory becomes the repository root, leave the root directory unset.

`render.yaml` declares one static service with automatic deployment turned off, build command `npm ci && npm run build`, and output `./dist`. `SKIP_INSTALL_DEPS: true` avoids a separate automatic dependency installation before that build command. It specifies no service plan, region, database, disk, worker, or paid resource. Headers include a content security policy, clickjacking and MIME protections, restricted browser permissions, and prelaunch indexing controls.

Before applying the Blueprint, validate it against Render's current schema and review the target workspace, repository, domain, and service settings. Review the current Static Site offering and usage limits. The source requires only static hosting.

## Search indexing at launch

Prelaunch indexing is disabled in three places: the robots meta tag in `index.html`, `public/robots.txt`, and the `X-Robots-Tag` header in `render.yaml`. When public indexing is explicitly intended, review and change all three together, then update the prelaunch-only assertions in `scripts/check-source.mjs` and relevant tests. Rebuild and verify the deployed HTML, `/robots.txt`, and HTTP headers. These controls are indexing requests, not access restrictions.

## Before enabling enquiries or payment

- Configure and verify an appropriate business contact channel and a working inquiry process. Do not substitute personal contact information.
- Complete the merchant setup and verify any live checkout link against the agreed repair, amount, and currency.
- Finalize the qualification, scope, timing, access, review/publication, payment, cancellation/refund, and business disclosures required for the customer workflow.
- Run the checks and review desktop, mobile, keyboard navigation, and the deployed HTTPS assets after any launch change.

The page contains no fabricated customers, testimonials, credentials, service guarantees, or delivery SLA.
