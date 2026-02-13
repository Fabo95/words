# Words Design Principles

This document defines the design system and UI guidelines for the Words vocabulary learning application.

## I. Core Design Philosophy

- **Users First:** Prioritize learner workflows—adding words, reviewing flashcards, tracking progress.
- **Meticulous Craft:** Aim for precision, polish, and high quality in every UI element.
- **Speed & Performance:** Design for fast interactions; vocabulary review must feel instant.
- **Simplicity & Clarity:** Clean, uncluttered interface focused on learning.
- **Focus & Efficiency:** Help users achieve daily goals with minimal friction.
- **Consistency:** Maintain uniform design language across all features.
- **Accessibility (WCAG AA):** Ensure sufficient contrast, keyboard navigation, and screen reader support.

---

## II. Design System

### Stack

- **Framework:** Next.js 16 with App Router, React 19
- **Component Library:** shadcn/ui
- **Primitives:** Radix UI
- **Styling:** Tailwind CSS 4 with CSS variables (oklch color space)
- **Variants:** class-variance-authority (CVA)
- **Utilities:** tailwind-merge, clsx
- **Icons:** Lucide React
- **Animations:** Motion (framer-motion), tailwindcss-animate
- **Forms:** React Hook Form + Zod validation

### Typography

- **Font:** System font stack (--font-sans)
- **Monospace:** Geist Mono (--font-geist-mono)
- **Headings:** Use font-semibold (600) or font-bold (700)
- **Body:** Use font-normal (400) or font-medium (500)

### Color Palette (CSS Variables - oklch format)

**Dark Theme Only:**

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | oklch(0.145 0 0) | Page background (near black) |
| `--foreground` | oklch(0.985 0 0) | Primary text (near white) |
| `--card` | oklch(0.205 0 0) | Card backgrounds |
| `--card-foreground` | oklch(0.985 0 0) | Card text |
| `--popover` | oklch(0.205 0 0) | Popover/dropdown backgrounds |
| `--primary` | oklch(0.77 0.16 70) | Primary actions (warm amber) |
| `--primary-foreground` | oklch(0.28 0.07 46) | Text on primary |
| `--secondary` | oklch(0.274 0.006 286) | Secondary elements |
| `--muted` | oklch(0.269 0 0) | Muted backgrounds |
| `--muted-foreground` | oklch(0.708 0 0) | Secondary text |
| `--accent` | oklch(0.371 0 0) | Hover states |
| `--destructive` | oklch(0.704 0.191 22) | Destructive actions (red) |
| `--border` | oklch(1 0 0 / 10%) | Borders (white 10%) |
| `--input` | oklch(1 0 0 / 15%) | Input backgrounds |
| `--ring` | oklch(0.556 0 0) | Focus rings |

**Chart Colors (for statistics):**
| Token | Value |
|-------|-------|
| `--chart-1` | oklch(0.88 0.15 92) |
| `--chart-2` | oklch(0.77 0.16 70) |
| `--chart-3` | oklch(0.67 0.16 58) |
| `--chart-4` | oklch(0.56 0.15 49) |
| `--chart-5` | oklch(0.47 0.12 46) |

**Sidebar Colors:**
| Token | Usage |
|-------|-------|
| `--sidebar` | Sidebar background |
| `--sidebar-foreground` | Sidebar text |
| `--sidebar-primary` | Active nav items |
| `--sidebar-accent` | Hover states |

### Breakpoints

| Name | Size | Usage |
|------|------|-------|
| `sm` | 640px | Large phones |
| `md` | 768px | **Primary breakpoint** (mobile/desktop switch) |
| `lg` | 1024px | Small laptops |
| `xl` | 1280px | Desktop |

**Key:** The `useIsMobile()` hook uses 768px as the breakpoint.

### Spacing & Layout

- **Base unit:** 4px (Tailwind default)
- **Border radius:** `--radius: 0.625rem` (10px)
- **Radius variants:** sm (-4px), md (-2px), lg (base), xl (+4px), 2xl (+8px)

---

## III. Component Guidelines

### Buttons

**Variants (CVA):**
| Variant | Usage |
|---------|-------|
| `default` | Primary action (amber bg) |
| `destructive` | Dangerous actions (red) |
| `outline` | Secondary with border |
| `secondary` | Muted secondary action |
| `ghost` | Minimal, hover-only background |
| `link` | Text link with underline on hover |

**Sizes:**
| Size | Dimensions |
|------|------------|
| `default` | h-9, px-4, py-2 |
| `sm` | h-8, px-3, text-xs |
| `lg` | h-10, px-8 |
| `icon` | h-9, w-9 |

**Loading State:** Use `isLoading` prop to show spinner overlay.

### Form Inputs

- Labels above inputs
- Error messages with `text-destructive`
- Focus states with `ring` color
- Use React Hook Form + Zod for validation
- Pattern: `services/web/src/components/forms/{formName}/`

### Cards

- Use `card` and `card-foreground` colors
- Consistent padding (p-4 or p-6)
- Border radius from `--radius`
- Use for content grouping (stats, streaks, etc.)

### Dialogs & Drawers

**Use `DialogOrDrawer` component for responsive modals:**
- Desktop (≥768px): Renders as Dialog (centered modal)
- Mobile (<768px): Renders as Drawer (bottom sheet)

```tsx
import { DialogOrDrawer, DialogOrDrawerContent, ... } from "@app/components/ui/dialogOrDrawer"
```

### Progress Indicators

- `ProgressRing`: Circular SVG progress for daily goals
- Linear progress bar for detailed views
- Flame icon (Lucide) for streak indicators

### Tables

- Use `@tanstack/react-table` for data tables
- Left-align text, right-align numbers
- Pagination for large datasets

---

## IV. Interaction & Animation

### Animation Guidelines

- **Duration:** 150-300ms for micro-interactions
- **Easing:** ease-out for entrances, ease-in for exits
- **Transitions:** Use `transition-colors`, `transition-all duration-300`

### Loading States

- `Spinner` component for buttons and inline loading
- `Skeleton` component for content placeholders
- Suspense boundaries with skeleton fallbacks

### Toast Notifications

- Use Radix Toast via `useToast()` hook
- Success/error feedback for mutations
- Auto-dismiss after ~5 seconds

---

## V. Accessibility Checklist

- **Color Contrast:** Minimum 4.5:1 for normal text (important for dark theme)
- **Focus States:** Visible focus rings using `--ring` color
- **Keyboard Navigation:** All interactive elements reachable via Tab
- **ARIA Labels:** Provide labels for icon-only buttons
- **Semantic HTML:** Use appropriate heading levels, landmarks
- **Motion:** Respect `prefers-reduced-motion`
- **Radix UI:** Leverages built-in accessibility features

---

## VI. Responsive Design

### Mobile First

- Design for mobile (375px) first
- Enhance for larger screens with `md:` prefix

### Key Responsive Patterns

| Pattern | Mobile (<768px) | Desktop (≥768px) |
|---------|-----------------|------------------|
| `DialogOrDrawer` | Bottom drawer | Centered dialog |
| Sidebar | Collapsed/hidden | Visible |
| Button sizes | `h-9 w-9` | `h-7 w-7` |
| Navigation | Bottom nav or hamburger | Sidebar |

### Touch Targets

- Minimum 44x44px for touch targets on mobile
- Larger tap areas for primary actions

---

## VII. Internationalization (i18n)

### Locales

- `de-DE` (German)
- `en-GB` (English)

### URL Structure

- All routes prefixed with locale: `/en-GB/home`, `/de-DE/translations`

### Translation Files

- Location: `services/web/messages/{locale}.json`
- Structure: `forms.*`, `components.*`, `pages.*`, `common.*`
- **Always update both locale files together**

### Considerations

- German text is often longer—test for overflow
- Use `next-intl` `useTranslations()` hook
- Format dates/numbers with locale-aware formatters

---

## VIII. File Organization

```
services/web/src/
├── app/
│   └── [lang]/
│       └── (loggedIn)/
│           └── _content/     # Page-specific client components
├── components/
│   ├── ui/                   # shadcn/ui components (flat)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── dialogOrDrawer.tsx
│   │   └── ...
│   └── forms/                # Form components
│       └── {formName}/
│           ├── {formName}.tsx
│           └── utils/
│               ├── {formName}Schema.ts
│               └── {formName}Types.ts
├── hooks/
│   └── use-mobile.tsx        # Mobile detection hook
├── lib/
│   └── utils.ts              # cn() utility
├── styles/
│   └── globals.css           # CSS variables, Tailwind imports
└── utils/
    ├── reactQuery/
    │   └── queryOptions.ts   # React Query options
    └── shadcn/
        └── shadcnHelpers.ts  # cn() alias
```

---

## IX. Quick Reference

### Adding New Colors

1. Add CSS variable to `globals.css` under `:root`
2. Add theme mapping in `@theme inline` block
3. Use via Tailwind: `bg-{color}`, `text-{color}`

### Creating New Components

1. Use CVA for variants: `cva("base-classes", { variants: {...} })`
2. Use `cn()` for conditional classes
3. Forward refs for form elements
4. Add `isLoading` prop where appropriate

### Creating New Forms

1. Create folder: `components/forms/{formName}/`
2. Add schema: `utils/{formName}Schema.ts` with `get{FormName}Schema(t)`
3. Add types: `utils/{formName}Types.ts`
4. Add component: `{formName}.tsx`
5. Add translations to both locale files under `forms.{formName}`

### Using React Query

```tsx
// Query options
export const getXQueryOptions = (authCookieValue?: string) =>
  $api.queryOptions("get", "/endpoint", { ... })

// In component
const { data } = useSuspenseQuery(getXQueryOptions())

// Mutations
const mutation = $api.useMutation("post", "/endpoint", {
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ... })
})
```
