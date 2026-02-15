# DATA RECOVERY PLAN

## Current Situation
- Data was in Supabase 1 hour ago
- Now appears to be missing/empty
- JSON backup exists: `data/portfolio_projects.json` (195K, Feb 11)

## IMMEDIATE ACTIONS TO CHECK

### 1. Supabase Backups (DO THIS FIRST)
Go to: https://supabase.com/dashboard/project/xibkuwouvisabnfowthn/database/backups

Supabase has automatic **Point-in-Time Recovery**:
- Free tier: 7 days of backups
- Can restore to any point in the last 7 days
- Look for backup from ~1 hour ago

### 2. Check if tables exist but are empty
In Supabase Dashboard → Table Editor, verify:
- Do `projects`, `news`, `articles` tables exist?
- Are they empty or do they have data?

### 3. Check Supabase Logs
Dashboard → Logs → check for:
- DELETE statements
- DROP TABLE statements  
- Any errors from the last hour

## RECOVERY OPTIONS

### Option A: Restore from Supabase Backup (BEST)
If backups available:
1. Go to Database → Backups
2. Select backup from before the issue
3. Click "Restore"
4. Wait 5-10 minutes

### Option B: Re-import from JSON
If no backup available:
1. Run: `tsx scripts/import-from-json.ts` (need to create this)
2. Maps JSON data to Supabase tables
3. Takes ~5 minutes

### Option C: Check if Manus/Antigravity has backup
- They built the original site
- May have database exports

## What My Changes Did
My commit 29b272c **only changed**:
- File: `client/src/pages/admin/AdminAnalytics.tsx`
- Change: Added `{ enabled: false }` to 4 queries
- This is READ-ONLY - cannot delete data

## Next Steps
1. Check Supabase backups NOW
2. Let me know what you find
3. We'll recover from there
