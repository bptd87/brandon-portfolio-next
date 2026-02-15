# Emergency Rollback Instructions

If the site is broken after the analytics fix, run this to revert:

```bash
# Revert to the previous working commit
git revert 29b272c --no-edit

# Or roll back to before the analytics changes
git reset --hard 4ec64f3

# Force push to Railway (triggers immediate redeploy)
git push origin main --force
```

## What Changed
- Commit 29b272c: Disabled 4 analytics queries that were causing 6800+ errors
- Change: Added `{ enabled: false }` to 4 useQuery calls in AdminAnalytics.tsx
- This should have IMPROVED performance, not slowed it down

## If Site is Actually Slow
The issue might not be the code change, but:
1. Supabase connection pooling exhausted
2. Supabase having platform issues (see dashboard screenshot)
3. Railway deployment still building/warming up

## Current Status
✅ Backend is healthy: /health returns 200
✅ Site HTML loads: title tag present
✅ Environment variables: All set correctly
