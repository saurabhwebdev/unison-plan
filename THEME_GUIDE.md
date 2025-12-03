# Theme Guide - Project Tracker

## Central Theme Configuration

This project uses a **centralized theme system** where all colors are defined in one place (`app/globals.css`). Any new page or component you create will **automatically inherit** these colors without needing to define them explicitly.

## Color Palette

### Primary Colors

**Brand Green** - `#77c044`
- Used for primary buttons, active states, links, and key actions
- Automatically applied via `bg-primary`, `text-primary`, etc.

**Text/Foreground Blue** - `#0d6eb8`
- Used for all text and foreground elements
- Multiple shades generated automatically for different contexts
- Automatically applied via `text-foreground`, `text-muted-foreground`, etc.

## How It Works

### Automatic Inheritance

The theme is defined using CSS custom properties (CSS variables) in `app/globals.css`. Tailwind CSS then maps these variables to utility classes. This means:

✅ **No manual color definitions needed**
✅ **Consistent colors across all pages**
✅ **Easy to update the entire theme from one file**
✅ **Dark mode support included**

### Example: Creating a New Page

When you create a new page, colors are applied automatically:

```tsx
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">My Page</h1>
      {/* Text is automatically blue (#0d6eb8) */}

      <Button>Click Me</Button>
      {/* Button is automatically green (#77c044) */}

      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          {/* All text inherits blue color automatically */}
        </CardHeader>
      </Card>
    </div>
  );
}
```

No need to specify `text-blue-500` or `bg-green-500` - it's all automatic!

## Color Tokens Reference

### Primary (Green #77c044)
- `bg-primary` - Primary background
- `text-primary` - Primary text
- `border-primary` - Primary border
- `ring-primary` - Focus ring

### Foreground/Text (Blue #0d6eb8 and shades)
- `text-foreground` - Main text color
- `text-muted-foreground` - Subtle/secondary text
- `text-card-foreground` - Card text
- `text-popover-foreground` - Popover text

### Background
- `bg-background` - Page background (white)
- `bg-card` - Card background (white)
- `bg-muted` - Muted/subtle background (light blue)

### Semantic Colors
- `bg-secondary` - Secondary actions (light blue)
- `bg-accent` - Accent elements (light green)
- `bg-destructive` - Error/delete actions (red)

### Borders & Inputs
- `border-border` - Default borders (light blue)
- `border-input` - Input borders (light blue)

## Dark Mode

Dark mode is automatically supported with the same color scheme:

- **Primary green stays the same** (#77c044)
- **Background becomes dark blue**
- **Text becomes light blue**
- **All components adapt automatically**

To enable dark mode, add `class="dark"` to the `<html>` element.

## Customizing Colors

To change the theme colors, edit **one file only**: `app/globals.css`

### Example: Change Primary Color

```css
/* In app/globals.css */
:root {
  /* Change from green to another color */
  --primary: 220 70% 50%; /* Blue example */
}
```

That's it! All buttons, links, and primary elements will update automatically across the entire app.

### Example: Change Text Color

```css
/* In app/globals.css */
:root {
  /* Change from blue to another color */
  --foreground: 280 60% 40%; /* Purple example */
}
```

All text across the app will update automatically.

## Component Usage

### Using shadcn/ui Components

All shadcn/ui components automatically use the theme:

```tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// All these use the theme colors automatically
<Button>Primary Action</Button>  {/* Green background, white text */}
<Button variant="secondary">Secondary</Button>  {/* Light blue background */}
<Button variant="outline">Outline</Button>  {/* Blue border */}

<Card>...</Card>  {/* White background, blue text */}

<Badge>Status</Badge>  {/* Green background */}
<Badge variant="secondary">Info</Badge>  {/* Light blue background */}
```

### Text Colors

```tsx
<h1 className="text-3xl font-bold">Heading</h1>
{/* Automatically blue (#0d6eb8) */}

<p className="text-muted-foreground">Subtitle</p>
{/* Automatically lighter blue shade */}

<p className="text-primary">Highlighted text</p>
{/* Automatically green (#77c044) */}
```

### Backgrounds

```tsx
<div className="bg-background">
  {/* White background */}
</div>

<div className="bg-muted">
  {/* Light blue background */}
</div>

<div className="bg-primary">
  {/* Green background (#77c044) */}
</div>
```

## Color Mapping

| Utility Class | Color | Usage |
|--------------|-------|-------|
| `text-foreground` | Blue (#0d6eb8) | Main text |
| `text-muted-foreground` | Light Blue | Secondary text |
| `bg-primary` | Green (#77c044) | Primary buttons, active states |
| `text-primary` | Green (#77c044) | Highlighted text |
| `bg-secondary` | Light Blue | Secondary actions |
| `bg-accent` | Light Green | Accent elements |
| `border-border` | Light Blue | Default borders |
| `bg-muted` | Very Light Blue | Subtle backgrounds |

## Best Practices

### ✅ DO

- Use semantic class names (`bg-primary`, `text-foreground`, etc.)
- Let components inherit theme colors automatically
- Update colors in `app/globals.css` only
- Use existing color tokens for consistency

### ❌ DON'T

- Don't use arbitrary colors like `bg-[#77c044]`
- Don't hardcode colors in components
- Don't define custom colors in individual pages
- Don't override theme colors inline

## Examples

### Good ✅

```tsx
<Button>Click Me</Button>
<h1 className="text-2xl font-bold">Title</h1>
<Card>Content</Card>
```

### Bad ❌

```tsx
<button className="bg-[#77c044]">Click Me</button>
<h1 className="text-[#0d6eb8]">Title</h1>
<div style={{ color: '#0d6eb8' }}>Content</div>
```

## Adding New Pages

When adding new pages, simply use the authenticated layout:

```tsx
"use client";

import { AuthenticatedLayout } from "@/components/layout/AuthenticatedLayout";
import { Card } from "@/components/ui/card";

export default function NewPage() {
  return (
    <AuthenticatedLayout>
      <h1>New Page</h1>
      {/* Everything inherits theme automatically */}
    </AuthenticatedLayout>
  );
}
```

No color configuration needed - it just works!

## Summary

🎨 **Colors defined once** in `app/globals.css`
🔄 **Automatically inherited** by all components
✨ **No manual styling** required on pages
🌙 **Dark mode** included automatically
📦 **All shadcn/ui components** themed automatically
⚡ **Update once, apply everywhere**

---

**Current Theme:**
- Primary: Green (#77c044)
- Text: Blue (#0d6eb8)
- Location: `app/globals.css`
