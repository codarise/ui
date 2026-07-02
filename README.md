# codarise-ui

Polarise design system as a [shadcn/ui](https://ui.shadcn.com) registry — distributed directly from this GitHub repo (no build/hosting needed for consumption). Built on the [`new-york`](https://ui.shadcn.com/r/styles/new-york/new-york.json) preset.

## Usage

Add any item by pointing the shadcn CLI at this repo:

```bash
npx shadcn@latest add codarise/ui/button
```

Multiple items at once:

```bash
npx shadcn@latest add codarise/ui/button codarise/ui/dialog codarise/ui/polarise-theme
```

Browse all items from the CLI:

```bash
npx shadcn@latest list codarise/ui
```

The CLI reads the source files directly from GitHub — no published bundle required. Same-repo `registryDependencies` resolve automatically (e.g. adding `dialog` pulls in `button`).

### Pinning a version

Pin to a tag, branch, or commit SHA for reproducible installs:

```bash
npx shadcn@latest add codarise/ui/button#v1.0.0
npx shadcn@latest add codarise/ui/button#<40-char-sha>
```

Refs are **not** inherited — pin each dependency explicitly if you need fixed versions.

## Available items

67 items across 5 registries.

### UI primitives (39)

Standard shadcn primitives plus fe-agentic originals, registered with cross-dependencies and per-item npm `dependencies`.

`accordion` · `alert` · `alert-dialog` · `attachment` · `avatar` · `badge` · `bubble` · `button` · `calendar` · `card` · `chart` · `checkbox` · `collapsible` · `command` · `dialog` · `drawer` · `dropdown-menu` · `empty` · `form` · `input` · `input-group` · `item` · `label` · `message` · `popover` · `progress` · `scroll-area` · `select` · `separator` · `sheet` · `skeleton` · `slider` · `sonner` · `spinner` · `switch` · `table` · `tabs` · `textarea` · `tooltip`

### Lib (3)

- `utils` — the `cn` class-merge helper (`clsx` + `tailwind-merge`). Standalone consumers can add it; projects bootstrapped via `shadcn init` already have it.
- `model-colors` — consistent color assignment for AI models. Specific colors for known models (Llama, Mistral, Gemma) and hash-based fallback for unknown ones. Returns hex or Tailwind class.
- `project-themes` — 40+ named gradient themes (Ocean Blue, Cyberpunk, Aurora Borealis, …) with id, gradient classes, bg hex, icon, and contrast text color. Includes `getRandomTheme`, `getThemeById`, and `themeToSettings` helpers. The `drive-agent` theme uses the polarise-theme AI brand tokens.

### Custom primitives (9)

Polarise-specific UI built on top of the standard set.

- `glow-backdrop` — decorative backdrop with centered glow + gradient fades
- `kbd` — keyboard key indicator for shortcuts
- `sparklespinner` — custom SVG spinner with twinkling dots on a deterministic loop
- `text-shimmer` — animated shimmer over text, light/dark + color variants
- `copy-button` — clipboard copy button with transient success state
- `icon-wrapper` — icon wrapper with gradient background variant
- `marker` — timeline marker with separator and border variants
- `stepper` — compact horizontal step progress indicator
- `search-input` — input with leading search icon

### Theme (1)

- `polarise-theme` — design-system extensions layered on the new-york base: `--success`/`--warning` semantic colors, `--ai-green`/`--ai-teal` brand colors, motion easing tokens (`--ease-out`/`--ease-in-out`/`--ease-drawer`), a custom shadow scale (`--shadow-2xs`…`--shadow-2xl`), `--spacing`, plus `@utility scrollbar-none`/`scrollbar-thin`/`scrollbar-gutter-stable`/`wrap-break-word`/`shimmer`/`bg-dither` and autofill fixes.

### Fonts (2)

- `font-inter` — Inter variable font → `--font-sans`
- `font-ibm-plex-mono` — IBM Plex Mono font → `--font-mono`

### Blocks (13)

Composed blocks built on top of the primitives — page layouts, state views, chat patterns, and model-related UI.

- `featured-card` — gradient border strip with faded icon, headline, and CTA or custom action
- `bento-card` — bento-style dashboard card with gradient header (dither + animated blur blobs), icon or custom headerContent, title, badge, and body. Pass a `gradient` id from `project-themes`. Router-agnostic — use `onClick` for navigation
- `loading-state` — centered loading state with spinner, title, and description
- `error-state` — centered error state with icon, description, and optional retry button or custom action
- `chat-bubble` — chat bubble wrapper with role-to-variant mapping helpers (user, assistant, system, error)
- `chat-marker` — chat marker with optional leading icon, built on the Marker primitive
- `chat-message-row` — shared chat row shell aligning avatar, header, content, and footer
- `page-layout` — page composition primitives: `PageLayout`, `PageHeader` (with back button), `PageSection`, `PageContent` — router-agnostic
- `thinking-display` — collapsible thinking/reasoning panel with streaming-aware auto-open/collapse, shimmer label, scroll fade, and copy button
- `sidebar` — complete sidebar system: provider with localStorage + breakpoint tracking, collapsible shell, header (logo slots), nav (groups + items with active state), footer (user menu dropdown), mobile sheet, and toggle button. Uses plain `<a>` tags — swap for your router's Link in your app
- `model-card` — model card with gradient background derived from the model name. Generic — pass badges, metadata, features, and footer as ReactNode. Color auto-derived via `model-colors` or overridable per card
- `model-select` — model selector with popover list, keyboard navigation, favorites (localStorage), and optional details panel showing pricing, capabilities, and features. Generic — uses `ModelOption` type instead of a domain type. Includes trigger button, model list, and details panel
- `upload-dropzone` — drag & drop file upload zone with click-to-select. Uses a drag counter to avoid flicker. Supports `compact` and `prominent` variants

## Development

This repo is also a Vite showcase playground — `npm run dev` launches an automated component gallery with live previews, search, and copy-import/install buttons for every item.

```bash
npm install
npm run dev          # Showcase playground (gen:manifest → vite)
npm run typecheck    # tsc --noEmit
npm run lint         # eslint
npm run build        # gen:manifest → tsc -b → vite build
npx shadcn@latest registry validate ./registry.json   # CI gate
npx shadcn@latest build ./registry.json --output /tmp/build   # smoke build
npx fallow           # codebase intelligence: quality, risk, architecture, cleanup
```

Registry layout (modular `include` files):

```
registry.json                    # root, includes the files below
registry/ui/registry.json        # 39 UI primitives (standard + fe-agentic originals)
registry/lib/registry.json       # utils (cn) + model-colors + project-themes
registry/custom/registry.json    # 9 custom primitives
registry/theme/registry.json     # polarise-theme + 2 fonts
registry/blocks/registry.json    # 12 composed blocks
```

CI runs `typecheck` + `registry validate` + `shadcn build` on every PR (`.github/workflows/registry-validate.yml`).

The showcase manifest is auto-generated from the registry JSON files via `npm run gen:manifest` (runs automatically on `predev`/`prebuild`). Adding a component to any `registry.json` makes it appear in the showcase automatically.
