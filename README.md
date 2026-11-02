# Project Log

A log of the projects I've worked on, grouped by company.

## Editing

Go to `/admin` and sign in with `ADMIN_PASSWORD`. Once signed in, every page shows
**Edit** / **+ Add** links, and 1:1 notes become visible (they're hidden from everyone else).

`data/career.ts` holds the types and the starting content. After the first save from
`/admin`, the stored copy is used instead and edits to that file have no effect.

## Where the data lives

- **Production:** Upstash Redis, as a single JSON value under the key `career:companies`.
- **Locally, with no Redis env vars:** `.data/career.json` (gitignored).

## Running locally

```bash
echo 'ADMIN_PASSWORD=pick-something-long' > .env.local
npm run dev
```

## Deploying to Vercel

1. Push this folder to its own GitHub repo and import it in Vercel.
2. In the project's **Storage** tab, add **Upstash for Redis** (free tier). This sets
   `KV_REST_API_URL` and `KV_REST_API_TOKEN` for you.
3. Add an `ADMIN_PASSWORD` environment variable, then redeploy.

Changing `ADMIN_PASSWORD` signs out every device.
# career-projects
