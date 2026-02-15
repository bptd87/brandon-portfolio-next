# Railway Deployment Guide

## Current Setup

This project is deployed on **Railway** (not Vercel).

- **GitHub Repository:** https://github.com/bptd87/brandon-portfolio-v2
- **Deployment:** Railway (auto-deploys from `main` branch)
- **Configuration:** [railway.toml](railway.toml)

## Deployment Workflow

### 1. Commit and Push Changes

```bash
# Stage all changes
git add .

# Commit with descriptive message
git commit -m "Your commit message"

# Push to GitHub main branch
git push origin main
```

### 2. Automatic Deployment

Railway automatically detects the push to `main` and:
1. Installs dependencies with `pnpm install`
2. Builds the project with `pnpm run build`
3. Starts the server with `pnpm start`
4. Performs health checks on `/api/health`

### 3. Monitor Deployment

- Visit your Railway dashboard
- Check the deployment logs
- Verify the build completes successfully
- Test the live application

## Environment Variables

All environment variables are configured in Railway Dashboard → Variables.

See [RAILWAY_ENV_VARIABLES.txt](RAILWAY_ENV_VARIABLES.txt) for the complete list of required variables.

### Required Variables:

**Supabase:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`
- `VITE_SUPABASE_URL` (frontend)
- `VITE_SUPABASE_ANON_KEY` (frontend)

**Cloudinary:**
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

**Authentication:**
- `OWNER_OPEN_ID`
- `JWT_SECRET`

**Database:**
- `DATABASE_URL` (legacy TiDB connection)

**Application:**
- `VITE_APP_TITLE`
- `VITE_APP_LOGO`
- `NODE_ENV=production`

## Database Migrations

After deploying code changes, if you have new database migrations:

### Analytics Migration (Pending)

```bash
# Display the migration SQL
npm run migrate:show

# Copy the output and run it in Supabase Dashboard → SQL Editor
# This creates: analytics_sessions, analytics_project_views, analytics_events
```

### Drizzle Migrations

```bash
# If you have drizzle schema changes
npm run db:push
```

## Build Commands (Railway Configuration)

Defined in [railway.toml](railway.toml):

- **Install:** `pnpm install`
- **Build:** `pnpm run build`
- **Start:** `pnpm start`
- **Health Check:** `/api/health` (60s interval, 100s timeout)

## Troubleshooting

### Build Fails
- Check Railway logs for specific errors
- Verify all environment variables are set
- Ensure Node.js version is 20+ (specified in package.json engines)

### App Won't Start
- Check `pnpm start` command works locally
- Verify PORT environment variable (Railway sets this automatically)
- Check server logs for startup errors

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check Supabase service is running
- Ensure IP allowlist includes Railway IPs (if applicable)

## Recent Deployments

### Pending Changes (Not Yet Deployed)

The following changes are ready to deploy:

**Enhanced Analytics System:**
- Session-based tracking with IP geolocation
- Project view tracking
- Conversion funnel analysis
- New analytics dashboard with KPIs

**Mobile Admin Interface:**
- Responsive navigation with hamburger menu
- Card-based table views for mobile
- Touch-friendly UI with 44x44px buttons
- Backward compatible (desktop unchanged)

**Documentation:**
- `ANALYTICS_SETUP.md` - Analytics migration guide
- `MOBILE_ADMIN.md` - Mobile features documentation
- `MOBILE_ADMIN_SUMMARY.md` - Implementation overview
- `MOBILE_ADMIN_QUICK_REFERENCE.md` - Quick patterns guide

### To Deploy These Changes:

```bash
git add .
git commit -m "Add enhanced analytics and mobile admin interface"
git push origin main
```

Then run the analytics migration SQL in Supabase (see Analytics Migration section above).

## Legacy Files

- `vercel.json` - Old Vercel configuration (can be removed)
- Uses Railway-specific configuration now

## Support

For Railway-specific issues, visit: https://railway.app/help
