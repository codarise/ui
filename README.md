# codarise-ui

Polarise design system as a [shadcn/ui](https://ui.shadcn.com) registry — distributed directly from this GitHub repo (no build/hosting needed for consumption). Built on the [`nova`](https://ui.shadcn.com/r/styles/nova/nova.json) preset (`style: radix-nova`).

## Usage

Add any item by pointing the shadcn CLI at this repo:

```bash
npx shadcn@latest add felixhoebel/codarise-ui/button
```

Multiple items at once:

```bash
npx shadcn@latest add felixhoebel/codarise-ui/button felixhoebel/codarise-ui/dialog felixhoebel/codarise-ui/polarise-theme
```

Browse all items from the CLI:

```bash
npx shadcn@latest list felixhoebel/codarise-ui
```

The CLI reads the source files directly from GitHub — no published bundle required. Same-repo `registryDependencies` resolve automatically (e.g. adding `dialog` pulls in `button`).

### Pinning a version

Pin to a tag, branch, or commit SHA for reproducible installs:

```bash
npx shadcn@latest add felixhoebel/codarise-ui/button#v1.0.0
npx shadcn@latest add felixhoebel/codarise-ui/button#<40-char-sha>
```

Refs are **not** inherited — pin each dependency explicitly if you need fixed versions.

## Available items

52 items across 5 registries.

### UI primitives (39)

Standard shadcn primitives plus fe-agentic originals, registered with cross-dependencies and per-item npm `dependencies`.

`accordion` · `alert` · `alert-dialog` · `attachment` · `avatar` · `badge` · `bubble` · `button` · `calendar` · `card` · `chart` · `checkbox` · `collapsible` · `command` · `dialog` · `drawer` · `dropdown-menu` · `empty` · `form` · `input` · `input-group` · `item` · `label` · `message` · `popover` · `progress` · `scroll-area` · `select` · `separator` · `sheet` · `skeleton` · `slider` · `sonner` · `spinner` · `switch` · `table` · `tabs` · `textarea` · `tooltip`

### Lib (1)

- `utils` — the `cn` class-merge helper (`clsx` + `tailwind-merge`). Standalone consumers can add it; projects bootstrapped via `shadcn init` already have it.

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

- `polarise-theme` — design-system extensions layered on the nova base: `--success`/`--warning` semantic colors, `--ai-green`/`--ai-teal` brand colors, motion easing tokens (`--ease-out`/`--ease-in-out`/`--ease-drawer`), a custom shadow scale (`--shadow-2xs`…`--shadow-2xl`), `--spacing`, plus `@utility scrollbar-none`/`scrollbar-thin`/`scrollbar-gutter-stable`/`wrap-break-word`/`shimmer` and autofill fixes.

### Fonts (2)

- `font-inter` — Inter variable font → `--font-sans`
- `font-ibm-plex-mono` — IBM Plex Mono variable font → `--font-mono`

## Development

This repo is also a Vite playground for iterating on registry items.

```bash
npm install
npm run dev          # Vite playground (src/App.tsx imports from ../registry/ui/...)
npm run typecheck    # tsc --noEmit
npx shadcn@latest registry validate ./registry.json   # CI gate
npx shadcn@latest build ./registry.json --output /tmp/build   # smoke build
```

Registry layout (modular `include` files):

```
registry.json                    # root, includes the files below
registry/ui/registry.json        # 39 UI primitives (standard + fe-agentic originals)
registry/lib/registry.json       # utils (cn)
registry/custom/registry.json    # 9 custom primitives
registry/theme/registry.json     # polarise-theme + 2 fonts
registry/blocks/registry.json    # composed blocks (empty)
```

CI runs `typecheck` + `registry validate` + `shadcn build` on every PR (`.github/workflows/registry-validate.yml`).
