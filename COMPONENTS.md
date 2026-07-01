# Component Reference

Catalog of every component, block, lib, theme, and font in the codarise-ui (Polarise) registry. Use this as the single source of truth when picking building blocks for a UI. All items install via `npx shadcn@latest add codarise/<category>/<name>` — dependencies resolve automatically.

> **Import convention:** registry files use `@/components/ui`, `@/lib/utils`, etc. After adding an item, import from `@/components/ui/<name>` (or `@/components/<name>` for blocks/custom). Icons come from `lucide-react`.

---

## How to choose

1. **Need a whole page region or composed pattern?** Go to [Blocks](#blocks).
2. **Need a single primitive (button, input, dialog)?** Go to [UI primitives](#ui-primitives).
3. **Need a Polarise-specific visual flourish (glow, shimmer, kbd)?** Go to [Custom primitives](#custom-primitives).
4. **First time setting up the look?** Install [polarise-theme](#theme) + the [fonts](#fonts) first — many components assume the semantic tokens (`--success`, `--warning`, `--ai-green`, `--ai-teal`) it defines.

---

## UI primitives

Standard shadcn primitives plus fe-agentic originals. 39 items in `registry/ui/`.

| Component | Use it for | Notes |
| --- | --- | --- |
| `accordion` | Collapsible stacked sections (FAQs, settings groups) | Radix-based. |
| `alert` | Inline callouts for user attention (info, warning, success) | Static — not dismissible; use `sonner` for transient. |
| `alert-dialog` | Modal that demands a response before continuing (destructive confirms) | Has a built-in **loading action state** for async confirms. Pulls in `button` + `spinner`. |
| `attachment` | File attachment rows in lists/emails | Has media, content, and action slots; supports upload states. |
| `avatar` | User/entity image with text fallback | Radix `Avatar`. |
| `badge` | Small status/label tags | CVA variants. |
| `bubble` | Chat bubble in a conversation thread | Multiple variants for roles; pair with `message` for full chat rows. |
| `button` | Primary action trigger | Has `loading` state (shows spinner) and a **gradient default variant**. `asChild` via Radix Slot. Exports `buttonVariants` for styling links. |
| `calendar` | Date picker | `react-day-picker`; custom `buttonVariant` prop. |
| `card` | Grouping related content with header/content/footer | Compose from `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`. |
| `chart` | Data viz | Built on Recharts; use the theme's `--chart-1..5` tokens. |
| `checkbox` | Toggle a single boolean | Radix. |
| `collapsible` | Show/hide a panel (non-modal) | Radix. |
| `command` | Searchable command palette / combobox | `cmdk`; depends on `dialog`. |
| `dialog` | Modal overlay for focus tasks | Radix; depends on `button`. |
| `drawer` | Panel sliding from screen edge (mobile-first) | `vaul`. Use over `dialog` on touch. |
| `dropdown-menu` | Action menu from a trigger | Radix + lucide icons. |
| `empty` | Empty-state placeholder (no data yet) | Has its own loading/error sibling blocks — see `loading-state`, `error-state`. |
| `form` | Forms with labels, descriptions, errors | Built on `react-hook-form`; depends on `label`. |
| `input` | Single-line text field | Base for `search-input`, `input-group`. |
| `input-group` | Input with leading/trailing addons (icons, buttons, text) | Composes `button`, `input`, `textarea`. |
| `item` | Generic list row with media/title/description/action slots | Building block for custom lists. |
| `label` | Accessible label bound to a control | Radix Label. |
| `message` | Chat message shell (avatar + header + content + footer) | Framework-agnostic; map your message type to it. See also `chat-message-row`. |
| `popover` | Floating content from a trigger (pickers, menus) | Radix. |
| `progress` | Task completion bar | Radix. |
| `scroll-area` | Custom-styled scroll container | Radix. |
| `select` | Pick one value from a list | Radix + lucide. |
| `separator` | Visual divider between content | Radix. |
| `sheet` | Side panel overlay (desktop sidebar, filters) | Radix; depends on `button`. |
| `skeleton` | Loading placeholder while content fetches | Use for non-blocking loads; use `loading-state` for full-screen. |
| `slider` | Pick a value from a range | Radix. |
| `sonner` | Toast notifications | `sonner` + `next-themes`; theme-aware rich colors. Mount once near root. |
| `spinner` | Inline loading indicator (Loader2 icon) | Used by `button`, `alert-dialog`, `loading-state`. |
| `switch` | Toggle on/off (binary setting) | Radix. |
| `table` | Responsive data table with styled rows/cells | Pair with `empty` for no-data rows. |
| `tabs` | Layered content panels | CVA + Radix. |
| `textarea` | Multi-line text input | Base for `input-group` trailing actions. |
| `tooltip` | Hover/focus info popup | Radix. Keep text short. |

---

## Custom primitives

Polarise-specific visuals in `registry/custom/`. Compose on top of the standard set.

| Component | Use it for | Notes |
| --- | --- | --- |
| `glow-backdrop` | Decorative centered glow + gradient fades behind a hero/empty state | Purely visual. |
| `kbd` | Display keyboard shortcuts (e.g. `⌘K`) | Pair with `command` triggers. |
| `sparklespinner` | Branded SVG loading spinner with twinkling dots | Deterministic loop; alternative to `spinner` for AI/magic moments. |
| `text-shimmer` | Animated shimmer sweep over text | Light/dark + color variants. Used by `thinking-display`. |
| `copy-button` | Copy text to clipboard with transient success feedback | Depends on `button`. |
| `icon-wrapper` | Wrap an icon in a gradient badge-style container | Good for feature highlights, error/loading states. |
| `marker` | Timeline node with separator/border variants | Foundation for `chat-marker` and timeline UIs. |
| `stepper` | Compact horizontal step progress (wizard steps) | Pure presentational. |
| `search-input` | Input with leading search icon, controlled `value`/`onChange` | Depends on `input`. |

---

## Blocks

Composed patterns in `registry/blocks/`. Prefer these over hand-rolling when they fit.

| Block | Use it for | Notes |
| --- | --- | --- |
| `featured-card` | Highlighted strip with gradient border, faded icon, headline + CTA | Hero/banner moments. Depends on `card`. |
| `bento-card` | Bento-style dashboard card with gradient header, dither + animated blur blobs, icon/custom headerContent, title, badge, body | Pass a `gradient` id from `project-themes` for the header color. `featured` prop = larger highlight variant. Router-agnostic — pass `onClick` for navigation (e.g. `onClick={() => navigate({ to: href })}`). Lay out multiple in a `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 auto-rows-min`. Depends on `badge`, `card`, `project-themes`. |
| `loading-state` | Full-screen / centered loading with spinner + title + description | Use over `skeleton` for blocking loads. Depends on `spinner`. |
| `error-state` | Centered error with icon, title, description, retry/custom action | Depends on `icon-wrapper`, `button`. |
| `chat-bubble` | Role-aware chat bubble wrapper (user, assistant, system, error) | Depends on `bubble`. |
| `chat-marker` | Chat timeline marker with optional leading icon | Depends on `marker`. |
| `chat-message-row` | Shared chat row shell aligning avatar/header/content/footer | Framework-agnostic — map any message type to it. Depends on `message`. |
| `page-layout` | `PageLayout`, `PageHeader` (with back button), `PageSection`, `PageContent` | Router-agnostic. Depends on `button`. Use for consistent page structure. |
| `thinking-display` | Collapsible AI reasoning panel | Streaming-aware auto-open/collapse, shimmer label, scroll fade, copy button. Depends on `copy-button`, `text-shimmer`. |
| `sidebar` | Full app sidebar: provider + collapsible shell + header/nav/footer + mobile sheet + toggle | Uses plain `<a>` — swap for your router's `Link`. Wire `groups` + `activeHref` to `SidebarNav`, `user` + `menuItems` + `onLogout` to `SidebarFooter`. |
| `model-card` | Card for an AI model with auto-derived gradient background | Generic — pass badges/metadata/features/footer as ReactNode. Color via `model-colors` or override. Depends on `card`, `model-colors`. |
| `model-select` | Model picker: popover list, keyboard nav, favorites (localStorage), optional details panel | Generic — uses `ModelOption` (not a domain type). Depends on `badge`, `button`, `label`, `popover`, `tooltip`, `model-colors`. |
| `upload-dropzone` | Drag & drop file zone with click-to-select | Drag-counter avoids flicker. `compact` / `prominent` variants. Depends on `icon-wrapper`. |

---

## Lib

| Item | Use it for | Notes |
| --- | --- | --- |
| `utils` | `cn()` — merge Tailwind classes (`clsx` + `tailwind-merge`) | Already present in `shadcn init`'d projects. |
| `model-colors` | Consistent color for AI models | Named colors for Llama/Mistral/Gemma, hash fallback for unknown. Returns hex or Tailwind class. Used by `model-card` + `model-select`. |
| `project-themes` | 40+ named gradient themes for cards/badges/avatars | Each theme: `id`, `gradient` (Tailwind classes), `bgColorHex`, `icon`, `textColor`. Includes `getRandomTheme`, `getThemeById`, `themeToSettings` helpers. The `drive-agent` theme uses polarise-theme AI brand tokens (`--ai-teal` / `--ai-green`). Used by `bento-card`'s `gradient` prop. |

---

## Theme

| Item | Install when | Notes |
| --- | --- | --- |
| `polarise-theme` | Setting up the Polarise look on a fresh project | Adds `--success`/`--warning` semantic colors, `--ai-green`/`--ai-teal` brand colors, motion easing tokens (`--ease-out`/`--ease-in-out`/`--ease-drawer`), custom shadow scale (`--shadow-2xs`…`--shadow-2xl`), `--spacing`, plus utilities: `scrollbar-none`, `scrollbar-thin`, `scrollbar-gutter-stable`, `wrap-break-word`, `shimmer`, `bg-dither` (PNG noise texture used by `bento-card` + `featured-card` headers). Also colored charts, brand sidebar-primary, Inter + IBM Plex Mono fonts, and keyframes (`fadeIn`, `fadeInUp`, `fadeInWithBlur`, `border-rotate`, `text-shimmer-move`). |

**Install the theme first** — several components (e.g. anything using `success`/`warning`/AI brand colors, or the `shimmer` utility) assume these tokens exist.

---

## Fonts

| Item | Maps to | Notes |
| --- | --- | --- |
| `font-inter` | `--font-sans` | Inter variable — default body font. |
| `font-ibm-plex-mono` | `--font-mono` | IBM Plex Mono variable — code blocks, `kbd`. |

---

## Quick decision guide

- **Loading**: blocking → `loading-state`; inline → `spinner` / `skeleton`; AI moment → `sparklespinner`.
- **Empty / error data**: `empty` for no data, `error-state` for failure (with retry).
- **Overlay**: confirm action → `alert-dialog`; focus task → `dialog`; mobile → `drawer`; side panel → `sheet`; rich floating → `popover`.
- **Navigation**: app shell → `sidebar` + `page-layout`; steps → `stepper`; layered views → `tabs`.
- **Dashboard grids**: `bento-card` (gradient header + dither + blur blobs) with a `project-themes` gradient id; compose in a responsive grid.
- **Chat / AI**: message row → `chat-message-row`; bubble → `chat-bubble`; reasoning → `thinking-display`; model picker → `model-select`; model card → `model-card`.
- **Forms**: `form` + `input`/`textarea`/`select`/`checkbox`/`switch`/`slider`/`calendar`; addons via `input-group`; search via `search-input`.
- **Feedback**: transient → `sonner`; inline callout → `alert`; progress → `progress`; copy affordance → `copy-button`.
- **Visual polish**: glow → `glow-backdrop`; shimmer text → `text-shimmer`; icon emphasis → `icon-wrapper`; shortcuts → `kbd`.

---

## Adding a new component

1. Create the file under `registry/<ui|custom|blocks|lib|theme>/`.
2. Add an entry to that category's `registry.json` `items` array (include `dependencies` + `registryDependencies`).
3. Run `npm run gen:manifest` (or `npm run dev`) — it appears in the showcase automatically.
4. Validate: `npx shadcn@latest registry validate ./registry.json`.
