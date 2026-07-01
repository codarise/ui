# First Startup for Agents

Step-by-step guide to bootstrap a new Polarise project that uses the codarise-ui registry. Follow in order. Every command here is copy-pasteable.

> **What you're building:** a Vite + React 19 + Tailwind v4 SPA, wired to the codarise-ui shadcn registry, with dark mode, path aliases, lint/format, and git hooks. This is the baseline every Polarise frontend starts from.

---

## 0. Prerequisites

- Node 22+ (`node -v`)
- npm 10+ (`npm -v`)
- Git

---

## 1. Scaffold the Vite app

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
```

This gives you React 19, TypeScript, Vite, and ESLint out of the box.

---

## 2. Install core dependencies

These are the **non-negotiable** packages every Polarise frontend needs. Sourced from fe-agentic's `package.json`, stripped to essentials.

### Styling (Tailwind v4)

```bash
npm install tailwindcss @tailwindcss/vite @tailwindcss/typography tw-animate-css
```

### Fonts

```bash
npm install @fontsource-variable/inter @fontsource-variable/ibm-plex-mono
```

### shadcn / codarise-ui runtime deps

The registry components depend on these at runtime. Install once — `shadcn add` won't duplicate them.

```bash
npm install class-variance-authority clsx tailwind-merge
npm install radix-ui lucide-react
npm install cmdk vaul sonner next-themes
npm install react-day-picker recharts
```

| Package | Why |
| --- | --- |
| `class-variance-authority` + `clsx` + `tailwind-merge` | The `cn()` helper + variant system. Every component uses these. |
| `radix-ui` | Umbrella package — all primitives (dialog, dropdown, popover, etc.) live here. |
| `lucide-react` | Icon library. Every component imports from here. |
| `cmdk` | `command` palette component. |
| `vaul` | `drawer` component. |
| `sonner` | Toast notifications (`sonner` component). |
| `next-themes` | Theme switching — used by `sonner` for rich colors. Pair with the theme provider below. |
| `react-day-picker` | `calendar` component. |
| `recharts` | `chart` component. |

### Path alias

```bash
npm install -D @types/node
```

---

## 3. Install dev tooling

```bash
npm install -D prettier prettier-plugin-tailwindcss
npm install -D eslint-plugin-import
npm install -D husky lint-staged
```

### Optional but recommended

| Package | Why | When to add |
| --- | --- | --- |
| `@tanstack/react-router` + `@tanstack/router-vite-plugin` | File-based routing | Any multi-page app. |
| `@tanstack/react-query` + `@tanstack/react-query-devtools` | Server state / data fetching | Any app with an API. |
| `react-hook-form` + `@hookform/resolvers` + `zod` | Forms + validation | When you need forms. The `form` component requires `react-hook-form`. |
| `axios` | HTTP client | When calling APIs. |
| `framer-motion` | Animations beyond Tailwind | When you need complex motion. |
| `oidc-spa` + `oidc-spa/vite-plugin` | Keycloak/OIDC auth | When integrating with Polarise Keycloak. |
| `vitest` + `@testing-library/react` + `@testing-library/jest-dom` + `jsdom` | Tests | When you start writing tests. |
| `react-markdown` + `remark-gfm` + `rehype-sanitize` | Markdown rendering | Chat/AI features. |
| `react-syntax-highlighter` | Code blocks in markdown | Chat/AI features. |
| `@tiptap/*` + `tiptap-markdown` | Rich text editor | WYSIWYG editing. |
| `react-resizable-panels` | Resizable layouts | Dashboard panels. |
| `@tanstack/react-virtual` | Virtualized lists | Large lists. |
| `diff` | Text diffing | AI diff views. |

---

## 4. Configure Tailwind v4

### `vite.config.ts`

```ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
    },
  },
})
```

### `tsconfig.json` — path aliases

Add to `compilerOptions`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  }
}
```

Repeat the `paths` block in `tsconfig.app.json` (Vite's template uses a project-references setup — both files need them).

### `src/index.css`

Replace the entire file. The theme + fonts come from the registry in the next step — **don't hand-write CSS variables**.

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";
@import "tw-animate-css";
@import "@fontsource-variable/inter";

@custom-variant dark (&:is(.dark *));
@custom-variant pointer-fine (@media (hover: hover) and (pointer: fine));

:root { /* placeholder — theme install fills this */ }
.dark { /* placeholder — theme install fills this */ }

@theme inline { /* placeholder — theme install fills this */ }
```

---

## 5. Init shadcn + install the Polarise theme

### `components.json`

Create this at the project root. This tells the shadcn CLI where to put things and which registry to use.

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/index.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

### Install the theme + fonts first

The theme writes all CSS variables, utilities (`scrollbar-*`, `bg-dither`, `shimmer`, `scroll-fade-*`, `wrap-break-word`), keyframes, and base styles into `src/index.css`. **Install it before any component** — components reference tokens like `--success`, `--warning`, `--ai-green`, `--ai-teal` that the theme defines.

```bash
npx shadcn@latest add codarise/ui/polarise-theme
npx shadcn@latest add codarise/ui/font-inter
npx shadcn@latest add codarise/ui/font-ibm-plex-mono
npx shadcn@latest add codarise/ui/utils
```

After this, `src/index.css` will be fully populated with the design system. Don't manually edit the CSS variables — re-run the install to update.

### Install the components you need

```bash
# A sensible starter set
npx shadcn@latest add codarise/ui/button codarise/ui/card codarise/ui/badge
npx shadcn@latest add codarise/ui/dialog codarise/ui/dropdown-menu codarise/ui/sheet
npx shadcn@latest add codarise/ui/input codarise/ui/textarea codarise/ui/label
npx shadcn@latest add codarise/ui/sonner codarise/ui/spinner codarise/ui/skeleton
npx shadcn@latest add codarise/ui/tooltip codarise/ui/scroll-area
npx shadcn@latest add codarise/ui/avatar codarise/ui/separator codarise/ui/tabs

# Blocks (composed patterns)
npx shadcn@latest add codarise/ui/page-layout codarise/ui/sidebar
npx shadcn@latest add codarise/ui/loading-state codarise/ui/error-state codarise/ui/empty
```

Same-repo `registryDependencies` resolve automatically — adding `dialog` pulls in `button`, adding `sidebar` pulls in `avatar`/`badge`/`button`/`dropdown-menu`/`sheet`/`tooltip`, etc.

Browse all 67 items: see [`COMPONENTS.md`](./COMPONENTS.md), or run `npx shadcn@latest list codarise/ui`.

---

## 6. Wire up the theme provider

Create `src/components/theme-provider.tsx` — a localStorage-backed provider that toggles `.dark` / `.light` on `<html>`:

```tsx
import * as React from "react"

type Theme = "dark" | "light" | "system"
type ThemeProviderState = { theme: Theme; setTheme: (t: Theme) => void }

const ThemeProviderContext = React.createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}) {
  const [theme, setThemeState] = React.useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  React.useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    const resolved = theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : theme
    root.classList.add(resolved)
  }, [theme])

  const value: ThemeProviderState = {
    theme,
    setTheme: (t: Theme) => {
      localStorage.setItem(storageKey, t)
      setThemeState(t)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const ctx = React.useContext(ThemeProviderContext)
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider")
  return ctx
}
```

### Mount it in `src/main.tsx`

```tsx
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
      <Toaster richColors closeButton />
    </ThemeProvider>
  </StrictMode>
)
```

> **`next-themes` vs custom provider:** codarise-ui ships its own provider (above). fe-agentic uses a similar hand-rolled one. If you prefer `next-themes` (the sonner component references it internally for rich-color theming), install it and swap the provider — but the custom one works fine for SPAs.

---

## 7. Linting + formatting + hooks

### `.prettierrc`

```json
{
  "endOfLine": "lf",
  "semi": false,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 80,
  "plugins": ["prettier-plugin-tailwindcss"],
  "tailwindStylesheet": "src/index.css",
  "tailwindFunctions": ["cn", "cva"]
}
```

### `.prettierignore`

```
node_modules/
dist/
package-lock.json
```

### `eslint.config.js` (extend the Vite template)

Add `import/order` to enforce grouped, alphabetized imports (fe-agentic's convention):

```js
import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import importPlugin from "eslint-plugin-import"

export default tseslint.config(
  { ignores: ["dist", "node_modules"] },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: { globals: globals.browser },
    plugins: { import: importPlugin },
    rules: {
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "import/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },
)
```

### Git hooks

```bash
npx husky init
```

Add to `.husky/pre-commit`:

```sh
npx lint-staged
```

Add to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "typecheck": "tsc --noEmit",
    "preview": "vite preview"
  },
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,jsx,json,css,md}": ["prettier --write"]
  }
}
```

---

## 8. Verify

```bash
npm run dev          # app starts, no console errors, theme toggles
npm run typecheck    # tsc --noEmit — clean
npm run lint         # eslint — clean
npm run build        # tsc -b && vite build — clean
```

If you see `Cannot find module '@/lib/utils'` — you forgot to install `codarise/ui/utils` (step 5).

If components look unstyled — you forgot to install `polarise-theme` (step 5), or your `src/index.css` doesn't have the `@import "tailwindcss"` line.

---

## 9. Pinning the registry

For reproducible installs across agents/CI, pin to a tag or commit SHA:

```bash
npx shadcn@latest add codarise/ui/button#v1.0.0
npx shadcn@latest add codarise/ui/button#<40-char-sha>
```

Refs are **not** inherited — pin each dependency explicitly if you need fixed versions.

---

## Quick reference: what lives where

| Path | Contents |
| --- | --- |
| `src/index.css` | Tailwind import + all theme tokens (written by `polarise-theme`) |
| `src/lib/utils.ts` | `cn()` helper |
| `src/components/ui/` | shadcn primitives installed via registry |
| `src/components/theme-provider.tsx` | Dark/light mode provider |
| `components.json` | shadcn CLI config (registry aliases, paths) |
| `vite.config.ts` | Tailwind plugin + `@` path alias |
| `tsconfig.app.json` | `paths` mirror of the vite alias |
| `.prettierrc` | Prettier + Tailwind plugin config |

---

## Quick reference: package tiers

### Tier 1 — always install

`react` `react-dom` `tailwindcss` `@tailwindcss/vite` `@tailwindcss/typography` `tw-animate-css` `@fontsource-variable/inter` `@fontsource-variable/ibm-plex-mono` `class-variance-authority` `clsx` `tailwind-merge` `radix-ui` `lucide-react` `cmdk` `vaul` `sonner` `next-themes` `react-day-picker` `recharts`

### Tier 2 — most apps need these

`@tanstack/react-router` `@tanstack/router-vite-plugin` `@tanstack/react-query` `axios` `react-hook-form` `@hookform/resolvers` `zod` `framer-motion`

### Tier 3 — feature-specific

`oidc-spa` (auth) · `@tiptap/*` (rich text) · `react-markdown` + `remark-gfm` + `rehype-sanitize` (markdown) · `react-syntax-highlighter` (code blocks) · `react-resizable-panels` (panels) · `@tanstack/react-virtual` (virtualization) · `diff` (diffing)

### Dev — always install

`typescript` `vite` `@vitejs/plugin-react` `eslint` `typescript-eslint` `eslint-plugin-react-hooks` `eslint-plugin-react-refresh` `eslint-plugin-import` `prettier` `prettier-plugin-tailwindcss` `husky` `lint-staged` `@types/node` `@types/react` `@types/react-dom`

### Dev — testing

`vitest` `@testing-library/react` `@testing-library/jest-dom` `jsdom`
