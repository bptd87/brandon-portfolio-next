# Vercel Migration Plan

This is the working handoff plan for moving the live project from the older Railway-oriented setup to a Vercel-hosted Next.js deployment.

## Current Direction

- Public site: static Next.js routes
- Admin: protected Next-native workbench
- Media: Supabase Storage
- Analytics direction: Vercel-native traffic reporting, while preserving coarse city/location signal

## Phase 1: Source Control Decision

Before connecting Vercel, choose one Git source-of-truth path.

### Option A: Keep the current GitHub repository

Use this if:
- the current repo history is still useful
- you want the fastest Vercel cutover
- you do not need to separate the old Railway era into a fresh repository

### Option B: Start a new GitHub repository

Use this if:
- you want a clean deployment history for the Next/Vercel era
- you want to leave the Railway-era repo untouched
- you want the new repo to be the permanent source of truth for production

If you choose a new GitHub repo, mirror the current repository into it so branches and tags stay intact.

### New Repo Command Path

After the new empty GitHub repository exists, use this sequence locally:

```bash
git remote rename origin old-origin
git remote add origin https://github.com/YOUR-OWNER/YOUR-NEW-REPO.git
git push -u origin main
```

If you want the full branch/tag history mirrored instead of just `main`:

```bash
git remote rename origin old-origin
git remote add origin https://github.com/YOUR-OWNER/YOUR-NEW-REPO.git
git push --mirror origin
```

Recommended for this project:
- keep the old remote as `old-origin`
- push `main` first
- connect Vercel to the new repo only after the new remote is confirmed

## Phase 2: Vercel Project Setup

1. Create or choose the GitHub repository that will become the source of truth.
2. Import that repository into Vercel.
3. Let Vercel detect the Next.js project from the repo root.
4. Set the production environment variables listed in [ENVIRONMENT.md](/Users/brandonptdavis/Documents/Code/brandon-portfolio-v2/ENVIRONMENT.md).
5. Deploy a preview build first.
6. Verify:
   - `/`
   - `/projects`
   - `/articles`
   - `/studio`
   - `/admin`
   - `/admin/assets`
   - `/api/contact`

## Phase 3: Domain / DNS Decision

There are two valid domain approaches.

### Option A: Keep DNS in Cloudflare and point records to Vercel

Use this if:
- you still want Cloudflare managing DNS
- you want a lower-risk first cutover
- you do not need Vercel nameservers yet

Typical shape:
- apex domain uses Vercel-provided A record(s)
- subdomains use the Vercel-provided CNAME target

### Option B: Move authoritative DNS to Vercel

Use this if:
- you want domain management to live with the deployed app
- you want to stop managing DNS inside Cloudflare
- you want Vercel DNS to own the production domain records

Important:
- if the domain is currently using Cloudflare nameservers, you do **not** change that inside Cloudflare
- you change the nameservers at the domain registrar
- Vercel’s nameservers are:
  - `ns1.vercel-dns.com`
  - `ns2.vercel-dns.com`

Propagation can take up to 48 hours.

## Recommended Order

1. Finalize the Git source-of-truth decision.
2. Import the repo into Vercel and get a stable preview deployment.
3. Set production env vars in Vercel.
4. Verify admin login, assets, snippets, and contact flow on the Vercel preview.
5. Only then change domain records or nameservers.

## Production Checks Before DNS Cutover

- `SITE_URL` and `NEXT_PUBLIC_SITE_URL` are set
- Supabase auth vars are set
- contact email vars are set
- analytics/dashboard vars are set as needed
- `/admin` login works
- media uploads and copied URLs work
- public routes render correctly from the deployed Vercel URL
- no chunk-loading or stale-build issues

## After DNS Cutover

- verify apex domain
- verify `www` redirect behavior
- verify SSL certificate issuance
- verify admin login on the real domain
- verify contact form from the real domain
- verify asset URLs and media hotlinks still resolve

## Notes For Our Next Session

When you are ready, I can help with either of these live migration paths:

### Existing repo -> Vercel

- connect current GitHub repo to Vercel
- configure env vars
- create preview deployment
- cut DNS over after verification

### New repo -> Vercel

- create the new GitHub repo
- mirror-push this codebase into it
- connect the new repo to Vercel
- configure env vars
- cut DNS over after verification

## Official References

- Vercel Git deployments:
  [https://vercel.com/docs/git](https://vercel.com/docs/git)
- Vercel import flow:
  [https://vercel.com/docs/getting-started-with-vercel/import](https://vercel.com/docs/getting-started-with-vercel/import)
- Vercel nameservers:
  [https://vercel.com/docs/domains/working-with-nameservers](https://vercel.com/docs/domains/working-with-nameservers)
- GitHub repository transfer:
  [https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/transferring-a-repository)
- GitHub new repository:
  [https://docs.github.com/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/creating-a-new-repository](https://docs.github.com/github/creating-cloning-and-archiving-repositories/creating-a-repository-on-github/creating-a-new-repository)
