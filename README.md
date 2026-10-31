# Phone Numbers Web

![CI](https://github.com/qsweber/phone-numbers-web/actions/workflows/production.yml/badge.svg)

This is the front-end for https://github.com/qsweber/phone-numbers. Enter a phone number and get a
memorable, alphanumeric representation of it.

Production: https://phone-numbers.quinnweber.com/ (dev: https://dev-phone-numbers.quinnweber.com/)

Built with [Next.js](https://nextjs.org/) (App Router) as a fully static export, following the CI
and CDK patterns from [website-template](https://github.com/qsweber/website-template) (without the
Cognito/auth pieces).

## API

The site calls `GET {NEXT_PUBLIC_API_URL}/match?value=<phone number>` on the phone-numbers API:

| Environment | API URL                                           |
| ----------- | ------------------------------------------------- |
| dev         | `https://dev-phone-numbers-api.quinnweber.com/v1` |
| production  | `https://phone-numbers-api.quinnweber.com/v1`     |

These live in `cdk/config/*.json`, are exposed as the stack's `ApiUrl` output, and CI passes that
output to the build as `NEXT_PUBLIC_API_URL`.

For local development, create `.env.local`:

```
NEXT_PUBLIC_API_URL=https://dev-phone-numbers-api.quinnweber.com/v1
```

## Available Scripts

- `npm run dev`: run the app in development mode at http://localhost:3000
- `npm run build`: build and export the static site to `out/`
- `npm run lint`: run ESLint (with Prettier) across the project
- `npm run test:smoke`: run the Playwright smoke tests against `out/` (run `npm run build` first)

## Deployment

AWS CDK (`cdk/`) manages the S3 + CloudFront + Route 53 infrastructure. To work with it locally:

```bash
cd cdk
npm install
npx cdk diff phone-numbers-web-dev        # or phone-numbers-web-production
npx cdk deploy phone-numbers-web-dev
```

CI (`.github/workflows/ci.yml`) is a reusable workflow that lints/type-checks, runs `cdk deploy`,
builds the site against the stack's `ApiUrl`, runs Playwright smoke tests, syncs `out/` to S3,
invalidates CloudFront, and then checks the live site and API respond.

- Pull requests to `master` deploy `phone-numbers-web-dev` and show a CDK diff for production.
- Pushes to `master` deploy `phone-numbers-web-production` and cut a GitHub release.

Required repository secrets: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`. The `dev` and
`production` GitHub environments are used for the deploy job.
