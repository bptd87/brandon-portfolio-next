# Mobile Admin Interface

The admin interface now includes full mobile support with a responsive design that adapts to all device sizes.

## Features

### Mobile Navigation
- **Hamburger menu** on mobile devices (hidden on desktop)
- **Slide-out drawer** navigation with all admin sections
- **Quick actions** in mobile header (view site, menu toggle)
- **User profile** in navigation drawer

### Responsive Layout
- **Auto-hiding sidebar** on mobile (visible on desktop)
- **Stacked forms** on mobile, side-by-side on desktop  
- **Responsive tables** - Cards on mobile, full tables on desktop
- **Properly sized typography** - Scales based on device size
- **Touch-friendly buttons** - Minimum 44x44px tap targets

### Component Updates

#### AdminLayout
- Flex layout switches from `flex-row` to `flex-col` on mobile
- Sidebar hidden on `md:` breakpoint with `hidden md:flex`
- Content padding adjusted: `p-4 md:p-8 lg:p-12`
- Proper navigation for both mobile and desktop

#### ProjectsManager
- **Desktop (md+)**: Full HTML table with all columns
- **Mobile**: Card-based layout using `MobileTableView` component
- Responsive button layout: `flex flex-col md:flex-row`
- Responsive typography: `text-xl md:text-2xl`

#### MobileTableView Component
New component for displaying list data on mobile:
- Card-based layout instead of tables
- Label + value pairs for each field
- Action buttons (View, Edit, Delete) below content
- Shows up to 3 actions for each item

## Responsive Breakpoints

```
Mobile-first approach using Tailwind breakpoints:

- Default (0px+)     : Mobile layout
- md (768px+)        : Tablet/Desktop layout
- lg (1024px+)       : Large desktop optimizations
```

## Using the Mobile Component

### MobileTableView

```tsx
import { MobileTableView } from "@/components/admin/MobileTableView";

<MobileTableView
  data={items}
  idKey="id"
  columns={[
    {
      key: 'name',
      label: 'Name',
      render: (value, item) => <strong>{value}</strong>
    },
    {
      key: 'status',
      label: 'Status',
      badge: true  // Renders as a badge
    },
    {
      key: 'date',
      label: 'Date'
    }
  ]}
  onEdit={(item) => navigate(`/admin/edit/${item.id}`)}
  onDelete={(item) => handleDelete(item)}
  isLoading={isLoading}
/>
```

## Design Patterns

### Responsive Headers
```tsx
<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
  <div>
    <h1 className="text-2xl md:text-4xl">Title</h1>
    <p className="text-sm md:text-base">Description</p>
  </div>
  <Button>Action</Button>
</div>
```

### Responsive Forms
- Place form fields in single column on mobile
- Use `md:grid-cols-2` or `md:grid-cols-3` on larger screens
- Ensure inputs are full-width on mobile

### Responsive Tables
```tsx
{/* Desktop Table */}
<div className="hidden md:block overflow-x-auto">
  <Table>...</Table>
</div>

{/* Mobile Cards */}
<div className="md:hidden">
  <MobileTableView ... />
</div>
```

## Touch-Friendly Design

All interactive elements on mobile follow these guidelines:
- Minimum 44x44px tap targets
- Adequate spacing between buttons (gap-2 to gap-4)
- Clear visual feedback on interaction
- Easy-to-read text sizes (16px minimum for inputs)

## Best Practices

1. **Always test on mobile**: Use Chrome DevTools device emulation
2. **Use Tailwind's responsive prefixes**: `md:`, `lg:` for responsive design
3. **Hide complex on mobile**: Tables → Cards, multiple columns → single column
4. **Keep navigation simple**: Use hamburger menu instead of full sidebar
5. **Stack vertically on mobile**: Forms, buttons, content should stack
6. **Optimize images**: Use smaller sizes for mobile devices
7. **Test touch targets**: Ensure all buttons are easily tappable

## Mobile Admin Checklist

- ✅ Sidebar hidden on mobile (hamburger menu instead)
- ✅ Navigation drawer with all sections
- ✅ ProjectsManager responsive (table on desktop, cards on mobile)
- ✅ Form fields stack on mobile
- ✅ Responsive typography
- ✅ Touch-friendly button sizes
- ✅ Proper padding/spacing on all screen sizes
- 🔄 Apply same patterns to other admin pages (News, Articles, etc.)

## Next Steps

To apply the same mobile optimization to other admin components:

1. Import `MobileTableView` component
2. Wrap table in `<div className="hidden md:block">` for desktop
3. Wrap `MobileTableView` in `<div className="md:hidden">` for mobile
4. Define columns with label, key, and optional render function
5. Connect action handlers (onEdit, onDelete, etc.)

Example pattern already applied to:
- **ProjectsManager** - Full example with cards and formatting

Can be applied to:
- **NewsManager**
- **ArticlesManager**
- **TutorialsManager**
- **CategoriesManager**
- **TagsManager**
- **ScenicDirectoryManager**
- **CollaboratorsManager**
