# Mobile Admin Quick Reference

## Quick Checklist for Making Admin Components Mobile-Responsive

### Step 1: Import Mobile Components
```tsx
import { MobileTableView } from "@/components/admin/MobileTableView";
```

### Step 2: Make Header Responsive
Change from:
```tsx
<div className="flex items-center justify-between">
```

To:
```tsx
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
```

### Step 3: Hide Table, Show Cards on Mobile

```tsx
{/* Desktop Table */}
<div className="hidden md:block overflow-x-auto">
  <Table>
    {/* existing table code */}
  </Table>
</div>

{/* Mobile Card View */}
<div className="md:hidden">
  <MobileTableView
    data={items}
    idKey="id"
    columns={[
      {
        key: 'fieldName',
        label: 'Display Label',
        render: (value, item) => <>{value}</>,
        badge: false  // set true for badge style
      },
      // add more columns...
    ]}
    onEdit={(item) => navigate(`/edit/${item.id}`)}
    onDelete={(item) => handleDelete(item.id, item.title)}
    isLoading={isLoading}
  />
</div>
```

### Step 4: Responsive Typography
```tsx
{/* Before */}
<CardTitle>Title</CardTitle>

{/* After */}
<CardTitle className="text-xl md:text-2xl">Title</CardTitle>
```

### Step 5: Test on Mobile
1. Open Chrome DevTools (F12)
2. Click Device Toggle Toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Test table → cards conversion
5. Test navigation drawer
6. Test all buttons

## Component Examples

### Example: Simple List (e.g., Tags)
```tsx
<MobileTableView
  data={tags}
  idKey="id"
  columns={[
    {
      key: 'name',
      label: 'Tag Name'
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (slug) => `/${slug}`
    },
    {
      key: 'color',
      label: 'Color',
      render: (color) => (
        <div 
          className="w-6 h-6 rounded border"
          style={{ backgroundColor: color }}
        />
      )
    }
  ]}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### Example: Complex Item (e.g., Projects)
```tsx
<MobileTableView
  data={projects}
  idKey="id"
  columns={[
    {
      key: 'title',
      label: 'Project',
      render: (_, project) => (
        <div>
          <p className="font-medium">{project.title}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {project.discipline} • {project.images?.length || 0} images
          </p>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      badge: true,
      render: (status, project) => (
        <>
          <Badge>{status}</Badge>
          {project.featured && <Badge>★ Featured</Badge>}
        </>
      )
    },
    {
      key: 'year',
      label: 'Date',
      render: (_, project) => `${project.month}/${project.year}`
    }
  ]}
  onEdit={handleEdit}
  onDelete={handleDelete}
  onView={handleView}
/>
```

## MobileTableView Props

```tsx
interface MobileTableViewProps<T> {
  data: T[];                    // Array of items
  columns: MobileTableColumn<T>[]; // Column definitions
  idKey: keyof T;              // Unique identifier field
  onEdit?: (item: T) => void;  // Edit handler
  onDelete?: (item: T) => void; // Delete handler
  onView?: (item: T) => void;  // View handler
  isLoading?: boolean;         // Show loading state
}

interface MobileTableColumn<T> {
  key: keyof T;               // Field name
  label: string;              // Display label
  render?: (value, item, index) => ReactNode; // Custom render
  badge?: boolean;            // Show as badge
  className?: string;         // Custom styling
}
```

## Responsive Typography Scale

```
Mobile (default)    Tablet (md:)        Desktop (lg:)
text-xs (12px)
text-sm (14px)      
text-base (16px)    
text-lg (18px)      text-xl
text-xl (20px)      text-2xl            text-3xl
text-2xl (24px)     text-3xl            text-4xl
text-3xl (30px)     text-4xl
text-4xl (36px)     text-5xl
```

Example:
```tsx
<h1 className="text-2xl md:text-3xl lg:text-4xl">Title</h1>
```

## Responsive Spacing

```
Mobile      Tablet      Desktop
p-2         md:p-4      lg:p-6
p-4         md:p-6      lg:p-8
gap-2       md:gap-3    lg:gap-4
```

Example:
```tsx
<div className="p-4 md:p-6 gap-3 md:gap-4">
```

## Common Patterns

### Responsive Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* items */}
</div>
```

### Responsive Flex
```tsx
<div className="flex flex-col md:flex-row gap-4">
  {/* items */}
</div>
```

### Responsive Button Sizes
```tsx
<Button size="sm" className="md:size-default">
  Action
</Button>
```

### Hide/Show Elements
```tsx
{/* Show only on mobile */}
<div className="md:hidden">Mobile content</div>

{/* Show only on tablet+ */}
<div className="hidden md:block">Desktop content</div>

{/* Show only on large desktop */}
<div className="hidden lg:block">Large desktop content</div>
```

## Testing Checklist

- [ ] Mobile layout (375px - iPhone SE)
- [ ] Tablet layout (768px - iPad)
- [ ] Desktop layout (1024px+)
- [ ] Landscape orientation
- [ ] All buttons are tappable (44x44px minimum)
- [ ] No horizontal scroll on mobile
- [ ] Text is readable (16px minimum)
- [ ] Touch doesn't trigger hover effects
- [ ] Navigation drawer closes after selection
- [ ] Images load and display correctly
- [ ] Form inputs are full-width on mobile
- [ ] No content overlaps or cutoff

## Performance Tips

1. **Use CSS for responsive** - Don't use media query in JS
2. **Avoid unnecessary renders** - Memoize components if needed
3. **Optimize images** - Provide responsive image sizes
4. **Mobile-first approach** - Start with mobile, add desktop

## Troubleshooting

**Table still showing on mobile?**
- Check if `hidden md:block` is on the table wrapper
- Check if `md:hidden` is on the MobileTableView wrapper

**Buttons not tappable?**
- Ensure `h-8 w-8` or larger (44x44px = 11 * 4px)
- Add padding if icon is small

**Typography too small?**
- Use `md:text-lg` for 18px on desktop
- Use `text-base` for 16px on mobile

**Layout broken on tablet?**
- Check breakpoints - `md:` is 768px
- Check flex/grid direction with `md:flex-row`

## Useful Tailwind Classes

**Responsive Display:**
- `block`, `inline`, `inline-block`, `flex`, `grid`, `hidden`
- `md:block`, `md:hidden`, `lg:flex`, etc.

**Responsive Sizing:**
- `w-full`, `md:w-1/2`, `lg:w-1/3`
- `h-auto`, `md:h-screen`, etc.

**Responsive Spacing:**
- `p-4`, `md:p-6`, `lg:p-8`
- `m-4`, `md:m-6`, `gap-3`, `md:gap-4`

**Responsive Text:**
- `text-sm`, `md:text-base`, `lg:text-lg`
- `font-medium`, `md:font-semibold`

## Need Help?

1. Check `ProjectsManager.tsx` for full example
2. Check `MobileTableView.tsx` for component API
3. Check `MOBILE_ADMIN.md` for detailed docs
4. Build and test with `npm run build`

## Done? Deploy!

```bash
npm run build    # Verify no errors
npm run dev      # Test locally
# Push to production!
```
