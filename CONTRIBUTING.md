# Contributing to Brandon PT Davis Portfolio

Thank you for contributing to this project! This guide will help you get started.

## Development Setup

See [README.md](./README.md) for initial setup instructions.

## Code Style

### TypeScript

- Use TypeScript for all new code
- Enable strict mode
- Define types explicitly (avoid `any`)
- Use interfaces for object shapes
- Use type aliases for unions/primitives

### React

- Use functional components with hooks
- Prefer `const` for component declarations
- Extract reusable logic into custom hooks
- Keep components focused and single-purpose
- Use `memo` for expensive components

### Naming Conventions

- **Components**: PascalCase (`ProjectCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- **Types/Interfaces**: PascalCase (`ProjectItem`, `UserRole`)

### File Organization

```
client/src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── ProjectCard.tsx  # Feature components
│   └── ...
├── pages/
│   ├── Home.tsx         # Page components
│   └── ...
├── hooks/
│   ├── useAuth.ts       # Custom hooks
│   └── ...
├── lib/
│   ├── trpc.ts          # tRPC client
│   └── utils.ts         # Utilities
└── contexts/            # React contexts
```

## Git Workflow

### Branching

1. **Create feature branch**
   ```bash
   git checkout -b feature/add-project-filter
   ```

2. **Make changes**
   - Write code
   - Add tests
   - Update documentation

3. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: Add project category filter"
   ```

4. **Push to GitHub**
   ```bash
   git push origin feature/add-project-filter
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Add description
   - Request review

### Commit Message Format

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(projects): Add filtering by category
fix(images): Resolve Cloudinary transformation issue
docs(readme): Update installation instructions
style(components): Format with Prettier
refactor(auth): Simplify session handling
test(projects): Add project creation tests
chore(deps): Update dependencies
```

## Testing

### Writing Tests

Tests use Vitest and are located alongside source files:

```typescript
// server/projects.test.ts
import { describe, it, expect } from 'vitest';
import { getProjects } from './db';

describe('getProjects', () => {
  it('should return all projects', async () => {
    const projects = await getProjects();
    expect(projects).toBeInstanceOf(Array);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test projects.test.ts

# Watch mode
pnpm test --watch

# Coverage
pnpm test --coverage
```

### Test Guidelines

- Write tests for all new features
- Test edge cases and error conditions
- Use descriptive test names
- Mock external dependencies
- Aim for >80% coverage

## Database Changes

### Schema Modifications

1. **Edit schema**
   ```typescript
   // drizzle/schema.ts
   export const projects = sqliteTable('projects', {
     id: text('id').primaryKey(),
     title: text('title').notNull(),
     newField: text('new_field'), // Add new field
   });
   ```

2. **Generate migration**
   ```bash
   pnpm drizzle-kit generate
   ```

3. **Review SQL**
   Check `drizzle/migrations/` for generated SQL

4. **Apply migration**
   - Use Manus UI Database panel
   - Or contact project owner

5. **Update query helpers**
   ```typescript
   // server/db.ts
   export async function getProjects() {
     return db.select().from(projects);
   }
   ```

### Migration Best Practices

- Never edit generated migration files
- Always review SQL before applying
- Test migrations on development database first
- Add NOT NULL constraints carefully (may fail on existing data)
- Use default values for new required fields

## tRPC Procedures

### Adding New Endpoints

1. **Define input schema**
   ```typescript
   // server/routers.ts
   import { z } from 'zod';
   
   const createProjectInput = z.object({
     title: z.string(),
     description: z.string(),
   });
   ```

2. **Create procedure**
   ```typescript
   export const appRouter = router({
     projects: {
       create: protectedProcedure
         .input(createProjectInput)
         .mutation(async ({ input, ctx }) => {
           return createProject(input, ctx.user.id);
         }),
     },
   });
   ```

3. **Use in frontend**
   ```tsx
   const createProject = trpc.projects.create.useMutation({
     onSuccess: () => {
       trpc.useUtils().projects.list.invalidate();
     },
   });
   ```

### Procedure Types

- **`publicProcedure`**: No authentication required
- **`protectedProcedure`**: Requires authenticated user
- **`adminProcedure`**: Requires admin role (if implemented)

### Query vs Mutation

- **Query**: Read operations (GET)
  - Use `.query()`
  - Automatically cached
  - Can be prefetched

- **Mutation**: Write operations (POST/PUT/DELETE)
  - Use `.mutation()`
  - Not cached
  - Invalidate related queries after success

## UI Components

### Using shadcn/ui

This project uses shadcn/ui components. To add new components:

```bash
npx shadcn-ui@latest add button
```

Components are added to `client/src/components/ui/`.

### Component Guidelines

- Use Tailwind CSS for styling
- Follow existing design patterns
- Ensure mobile responsiveness
- Add loading states
- Handle error states
- Use semantic HTML

### Progressive Image Component

Always use `<ProgressiveImage>` for images:

```tsx
import { ProgressiveImage } from '@/components/ProgressiveImage';

<ProgressiveImage
  src={project.coverImageUrl}
  alt={`${project.title} - Scenic design by Brandon PT Davis`}
  aspectRatio="16/9"
  loading="lazy"
  enableScrollAnimation={true}
/>
```

## Code Review

### Before Requesting Review

- [ ] Code follows style guidelines
- [ ] Tests pass locally
- [ ] No console errors/warnings
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] Branch is up-to-date with main

### Review Checklist

Reviewers should check:

- [ ] Code quality and readability
- [ ] Test coverage
- [ ] Performance implications
- [ ] Security considerations
- [ ] Accessibility compliance
- [ ] Mobile responsiveness
- [ ] Error handling

## Performance

### Image Optimization

- Use Cloudinary transformations
- Set appropriate quality levels
- Use responsive images (srcset)
- Lazy load below-the-fold images
- Preload critical images

### Code Splitting

- Use dynamic imports for large components
- Split routes with React.lazy
- Defer non-critical JavaScript

### Database Queries

- Use indexes for frequently queried fields
- Avoid N+1 queries
- Batch related queries
- Cache expensive computations

## Accessibility

- Use semantic HTML elements
- Add ARIA labels where needed
- Ensure keyboard navigation
- Maintain color contrast ratios
- Test with screen readers
- Add alt text to all images

## Security

- Never commit secrets or API keys
- Validate all user inputs
- Sanitize data before database insertion
- Use parameterized queries (Drizzle handles this)
- Implement rate limiting for sensitive endpoints
- Keep dependencies updated

## Questions?

- Check existing code for examples
- Review documentation links in README
- Ask in pull request comments
- Contact project owner

Thank you for contributing! 🎭
