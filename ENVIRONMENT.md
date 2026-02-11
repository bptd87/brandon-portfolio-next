# Environment Variables

This document lists all environment variables required for local development.

## Required Variables

Contact the project owner to obtain values for these variables.

### Database

```bash
# MySQL/TiDB connection string
DATABASE_URL="mysql://user:password@host:port/database?ssl=true"
```

### Authentication

```bash
# JWT secret for session cookies
JWT_SECRET="your-secret-key-here"

# Manus OAuth configuration
VITE_APP_ID="your-app-id"
OAUTH_SERVER_URL="https://api.manus.im"
VITE_OAUTH_PORTAL_URL="https://oauth.manus.im"
OWNER_OPEN_ID="owner-open-id"
OWNER_NAME="Brandon PT Davis"
```

### Cloudinary (Image CDN)

```bash
# Cloudinary account credentials
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Manus Built-in Services

```bash
# Manus Forge API (LLM, Storage, Notifications)
BUILT_IN_FORGE_API_URL="https://forge.manus.im"
BUILT_IN_FORGE_API_KEY="your-server-api-key"
VITE_FRONTEND_FORGE_API_KEY="your-frontend-api-key"
VITE_FRONTEND_FORGE_API_URL="https://forge.manus.im"
```

### Analytics

```bash
# Manus Analytics
VITE_ANALYTICS_ENDPOINT="https://manus-analytics.com"
VITE_ANALYTICS_WEBSITE_ID="your-website-id"
```

### Application

```bash
# App branding
VITE_APP_TITLE="Brandon PT Davis | Scenic & Experiential Design"
VITE_APP_LOGO="/logo.svg"
```

## Setting Up Locally

1. **Create `.env` file**
   ```bash
   touch .env
   ```

2. **Add variables**
   Copy the required variables above and fill in the values provided by the project owner.

3. **Verify setup**
   ```bash
   pnpm dev
   ```
   
   If environment variables are missing, you'll see errors in the console.

## Security Notes

- **NEVER commit `.env` files to Git**
- The `.gitignore` file already excludes `.env`
- Keep credentials secure and private
- Rotate secrets if accidentally exposed
- Use different credentials for development vs production

## Production Environment

Production environment variables are managed through the Manus Platform:
- Set via Management UI → Settings → Secrets
- Automatically injected at runtime
- Not stored in code repository

## Troubleshooting

### Missing Environment Variables

If you see errors like `DATABASE_URL is not defined`:

1. Check `.env` file exists in project root
2. Verify variable names match exactly (case-sensitive)
3. Restart development server after adding variables
4. Contact project owner for correct values

### Database Connection Errors

- Verify `DATABASE_URL` format is correct
- Check database is accessible from your network
- Ensure SSL is enabled if required
- Test connection with database client

### Cloudinary Errors

- Verify all three Cloudinary variables are set
- Check credentials are correct in Cloudinary dashboard
- Ensure API access is enabled for your account

## Environment Variable Reference

See `server/_core/env.ts` for the complete list of environment variables used by the application.
