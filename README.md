# Brandon PT Davis Portfolio

Professional portfolio website for scenic and experiential designer Brandon PT Davis, rebuilt as a Next.js site with static public pages and a protected media-first admin workspace.

## Tech Stack

- **App**: Next.js 16 + React 19 + Tailwind CSS 4
- **Admin/API**: Next App Router + tRPC 11
- **Content model**: local snapshot files in `shared/*`
- **Media**: Supabase Storage public URLs
- **Authentication**: Supabase-backed admin sign-in
- **Deployment target**: Vercel

## Getting Started

### Prerequisites

- Node.js 22.x
- pnpm (package manager)
- Access to environment variables (contact project owner)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/bptd87/brandon-portfolio-v2.git
   cd brandon-portfolio-v2
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   See [ENVIRONMENT.md](/Users/brandonptdavis/Documents/Code/brandon-portfolio-v2/ENVIRONMENT.md) for the current Next/Vercel env contract.

   At minimum for the modern app you will usually need:

   - `SITE_URL`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `RESEND_API_KEY`
   - `CONTACT_FROM_EMAIL`
   - `CONTACT_TO_EMAIL`

4. **Run development server**
   ```bash
   pnpm dev
   ```
   
   The app will be available at `http://localhost:3000`

## Project Structure

```
brandon-portfolio-v2/
├── client/               # Frontend React application
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page-level components
│   │   ├── lib/         # tRPC client & utilities
│   │   ├── App.tsx      # Routes & layout
│   │   └── main.tsx     # App entry point
├── server/              # Backend Express + tRPC
│   ├── _core/          # Framework plumbing (OAuth, context, etc.)
│   ├── db.ts           # Database query helpers
│   └── routers.ts      # tRPC procedures (API endpoints)
├── drizzle/            # Database schema & migrations
│   └── schema.ts       # Table definitions
├── storage/            # S3/Cloudinary helpers
└── shared/             # Shared types & constants
```

## Development Workflow

### Database Changes

1. Edit schema in `drizzle/schema.ts`
2. Generate migration: `pnpm drizzle-kit generate`
3. Review generated SQL in `drizzle/migrations/`
4. Apply via Manus UI or `webdev_execute_sql` tool
5. Update query helpers in `server/db.ts`

### Adding Features

1. Create/update database schema (if needed)
2. Add query helpers in `server/db.ts`
3. Create tRPC procedures in `server/routers.ts`
4. Build UI in `client/src/pages/`
5. Use `trpc.*.useQuery/useMutation` hooks in components
6. Write tests in `server/*.test.ts`
7. Run tests: `pnpm test`

### Image Optimization

All images are served through Cloudinary with automatic optimization:

- **Format**: Auto WebP with fallback
- **Quality**: 85% (configurable)
- **Responsive**: Automatic srcset generation
- **Loading**: Progressive blur-to-sharp with scroll animations

Use the `<ProgressiveImage>` component for all images.

## Key Features

### Progressive Image Loading

- 10px blurred placeholder (instant load)
- Smooth cross-fade to sharp image (500ms)
- Intersection observer preloading (200px margin)
- Scroll-triggered fade-in animations
- Automatic Cloudinary transformations

### Authentication

- Manus OAuth integration
- Protected procedures via `protectedProcedure`
- Session management with JWT cookies
- Use `useAuth()` hook for current user state

### tRPC API

All backend communication uses tRPC for end-to-end type safety:

```tsx
// Query data
const { data, isLoading } = trpc.projects.list.useQuery();

// Mutate data
const createProject = trpc.projects.create.useMutation({
  onSuccess: () => {
    trpc.useUtils().projects.list.invalidate();
  }
});
```

## Testing

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test server/auth.logout.test.ts

# Watch mode
pnpm test --watch
```

## Deployment

The active deployment target is Vercel.

Before deployment:
1. Configure the variables listed in [ENVIRONMENT.md](/Users/brandonptdavis/Documents/Code/brandon-portfolio-v2/ENVIRONMENT.md)
2. Verify `/admin` sign-in works with production env values
3. Smoke test key public routes and asset browsing in the built app

## Contributing

### Branch Strategy

- `main` - Production-ready code
- Feature branches: `feature/your-feature-name`
- Bug fixes: `fix/bug-description`

### Commit Messages

Use conventional commits:
- `feat: Add project filtering`
- `fix: Resolve image loading issue`
- `docs: Update README`
- `style: Format code`
- `refactor: Simplify auth logic`
- `test: Add project tests`

### Pull Request Process

1. Create feature branch from `main`
2. Make changes and test locally
3. Run tests: `pnpm test`
4. Commit with descriptive message
5. Push to GitHub
6. Create PR with description
7. Request review from project owner
8. Merge after approval

## Troubleshooting

### Database Connection Issues

- Verify `DATABASE_URL` in `.env`
- Check database is accessible from your network
- Enable SSL if required

### Image Loading Failures

- Verify Cloudinary credentials
- Check image URLs in database
- Review browser console for errors

### Build Errors

- Clear node_modules: `rm -rf node_modules && pnpm install`
- Clear build cache: `rm -rf dist .vite`
- Check Node.js version: `node -v` (should be 22.x)

## Resources

- [tRPC Documentation](https://trpc.io)
- [Drizzle ORM](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [Cloudinary](https://cloudinary.com/documentation)
- [Manus Platform](https://manus.im)

## License

Private - All Rights Reserved

## Contact

Brandon PT Davis - [Website](https://www.brandonptdavis.com)

For development questions or access requests, contact the repository owner.
