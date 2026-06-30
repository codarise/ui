# Plan: Eigene shadcn-Registry via Dedicated DS-Repo

Entscheidungen: **Option C** (eigenes public DS-Repo) · **GitHub-Source-Registry** (kein Build/Hosting nötig) · Scope **Primitives + Custom + Composed Blocks** · Composed Blocks **zu generischen Shells refactoren**.

> Refaktoriert nach Lektüre der offiziellen Registry-Docs (getting-started, github, namespace, examples, registry-json) und der shadcn-Skill-Referenz.

## Konventionen & Fakten (aus den Docs)

- **GitHub-Source-Registry**: Public Repo + root `registry.json` → CLI liest direkt vom Source, kein `shadcn build` nötig. Konsum: `npx shadcn@latest add codarise/codarise-ui/<item>`.
- **`include`**: Modulare `registry.json`-Files; Pfade relativ zur deklarierenden `registry.json`; muss explizit auf eine `registry.json` zeigen.
- **`registryDependencies`**:
  - Bare `button` = **offizielles shadcn-Item**, nie same-repo.
  - Same-repo: vollständige GitHub-Adresse `codarise/codarise-ui/<item>`.
  - Extern/Namespaced: `@acme/foo` oder `owner/repo/item`.
  - Refs (`#v1.0.0`, `#<sha>`) werden **nicht** vererbt — pro Dep explizit pinnen.
- **`dependencies`**: npm-Packages, `name@version`-Format erlaubt (z.B. `zod@^3.20.0`).
- **`target`-Platzhalter** (für Portabilität über verschiedene Consumer-Aliases): `@components/`, `@ui/`, `@lib/`, `@hooks/`. Pflicht für `registry:file`/`registry:page`; empfohlen für Blocks.
- **Item-Typen**: `registry:ui`, `registry:block`, `registry:lib`, `registry:hook`, `registry:file`, `registry:page`, `registry:theme`, `registry:style`, `registry:font`, `registry:base`, `registry:item`, `registry:component`.
- **`registry:base`**: Komplettes DS-Fundament (config + cssVars + deps) — Consumer können via `init --preset` davon booten.
- **`cssVars`** (`light`/`dark`/`theme`), **`css`** (`@layer`, `@utility`, `@plugin`, `@import`, `@keyframes`), **`envVars`**, **`meta`**, **`author`** — pro Item.
- **Validierung**: lokal `npx shadcn@latest registry validate ./registry.json`; nach Push `registry validate codarise/codarise-ui`.
- **Versionierung**: `#ref` (Branch/Tag/SHA). Full 40-char SHA = stabil ohne Git-Resolve. Default branch = moving ref (Cache-Vorsicht).
- **Datei-Layout-Guideline**: `registry/[STYLE]/[NAME]/` für Multi-File-Items (Blocks); Flat `registry/ui/<name>.tsx` OK für Single-File-Primitives.
- **`utils` (`cn`)**: Nicht jedem UI-Item als `registryDependencies` hinzufügen (shadcn-Konvention: Consumer hat `cn` aus `shadcn init`). Aber als eigenes `registry:lib`-Item ausliefern, damit Standalone-Consumer es adden können.

## Phase 0 — DS-Repo aufsetzen  ✅ erledigt
1. Public Repo `codarise/codarise-ui`. ✅
2. `npx shadcn@latest init --name polarise-ui --preset nova --template vite` (`base-nova` ist deprecated → `nova` = aktueller Name, erzeugt `style: radix-nova`). ✅
3. `src/lib/utils.ts` (`cn`) angelegt. ✅
4. Root `registry.json` mit `name: codarise`, `homepage: https://github.com/codarise/codarise-ui`, `include` auf `registry/ui/registry.json` + `registry/blocks/registry.json`. ✅
5. `npx shadcn@latest registry validate ./registry.json` als CI-Gate. ✅ (3 Files, 33 Items valid).

Adresse/Konsum: `npx shadcn@latest add codarise/codarise-ui/<item>`.

## Phase 1 — Generische Primitives migrieren  ✅ erledigt
Portables shadcn-Standard-Set (33 Items) → `registry/ui/`, als `type: registry:ui`:
accordion, alert, alert-dialog, avatar, badge, button, calendar, card, chart, checkbox, collapsible, command, dialog, drawer, dropdown-menu, empty, input, input-group, label, popover, progress, scroll-area, select, separator, sheet, skeleton, slider, sonner, switch, table, tabs, textarea, tooltip.

- `registryDependencies` gesetzt für Cross-Komponenten-Deps (alle same-repo als `codarise/codarise-ui/<item>`):
  - `dialog`, `alert-dialog`, `sheet`, `calendar` → `codarise/codarise-ui/button`
  - `command` → `codarise/codarise-ui/dialog` + `codarise/codarise-ui/input-group`
  - `input-group` → `button` + `input` + `textarea`
- `dependencies` pro Item gesetzt (`radix-ui`, `cmdk`, `vaul`, `recharts`, `sonner`, `next-themes`, `react-day-picker`, `lucide-react`, `class-variance-authority`).
- **Offen**: `utils` (`cn`) als `registry:lib`-Item in `registry/lib/registry.json` ausliefern + root `include` erweitern.
- **Dogfooding**: fe-agentic konsumiert eigene Registry — lokale Kopien entfernen.

## Phase 2 — Eigene Custom Primitives  ✅ erledigt
Wiederverwendbare Custom-UI-Komponenten (10 Items) → `registry/custom/`, als `type: registry:ui`:
glow-backdrop, kbd, spinner, sparklespinner, text-shimmer, copy-button, icon-wrapper, marker, stepper, search-input.

- `registryDependencies`: `copy-button` → `codarise/codarise-ui/button`; `search-input` → `codarise/codarise-ui/input`.
- `dependencies` pro Item gesetzt (`lucide-react`, `class-variance-authority`, `radix-ui`).
- **Domain-Dep entfernt**: `copy-button` hing an `@/lib/copy-to-clipboard` (trivialer `navigator.clipboard.writeText`-Wrapper) → Helper inline in `copy-button.tsx` integriert, Komponente jetzt voll portabel.
- `registry validate` + `shadcn build` über alle 45 Items (34 + 10 custom + 1 utils) erfolgreich.

## Phase 3 — Composed Blocks (Refactoring — größter Aufwand)
Blöcke wie Sidebar/Navigation-Pattern aus `AgentSidebar.tsx`:
- Router-Hooks (`useNavigate`, `useParams`, `useSearch`) → **Props/Callbacks** (`onSelectSession`, `sessions` als Data-Prop).
- Domain-Imports (`@/features/agent-mode-chat`, `@/services/agent-sessions`) → generische Sub-Komponenten oder Props.
- Als `registry:block` mit `registryDependencies` (same-repo `codarise/codarise-ui/<item>`) ausliefern.
- **`target`-Platzhalter** verwenden (`@components/<name>.tsx`) für Portabilität über Consumer-Aliases.
- Multi-File-Blocks unter `registry/blocks/<name>/` nesten (Guideline: `registry/[STYLE]/[NAME]/`).
- In fe-agentic bleibt ein **app-spezifischer Wrapper**, der den generischen Block mit Router/Domain-Daten füttert.

Empfehlung: Blöcke als **generische Shells** bauen, nicht die volle Domain-Logik 1:1 portieren.

## Phase 4 — Theming & Extras  ✅ erledigt
- **`registry:theme` "polarise-theme"** (`registry/theme/registry.json`): Polarise-Erweiterungen auf dem nova-Base — `--success`/`--warning` semantische Farben, `--ai-green`/`--ai-teal` Brand-Farben, Motion-Easing-Tokens (`--ease-out`/`--ease-in-out`/`--ease-drawer`), custom Shadow-Scale (`--shadow-2xs`…`--shadow-2xl`), `--spacing`. `cssVars.theme` mappt `color-success`/`color-warning` auf die Vars. `css`-Block definiert `@utility scrollbar-none/scrollbar-thin/scrollbar-gutter-stable/wrap-break-word/shimmer` + autofill-Fixes (`@layer base`).
- **`registry:font` "font-inter"** + **"font-ibm-plex-mono"**: Inter → `--font-sans`, IBM Plex Mono → `--font-mono` (jeweils `@fontsource-variable/*`-Dependency).
- `registry validate` + `shadcn build` über alle 47 Items erfolgreich; `typecheck` clean.
- **Offen (optional, niedrige Prio)**: `registry:base` "polarise-base" (Voll-Fundament für `init --preset`) und/oder `shadcn preset`-Bundle. Nur bauen wenn Consumer per Preset booten sollen.

## Phase 5 — CI & Versioning
- GitHub Action: `npx shadcn@latest registry validate ./registry.json` pro PR (nach Push auch `registry validate codarise/codarise-ui`).
- Tag-basierte Versionierung — Consumer pinnen via `codarise/codarise-ui/<item>#v1.0.0` oder full SHA. Refs nicht vererben → pro Dep explizit pinnen, wenn fixed Version nötig.
- `list codarise/codarise-ui` / `search` / `view` als Smoke-Tests in CI.

## Phase 6 — Andere Projekte onboarden
- Variante A (GitHub-Adresse, keine Config): `npx shadcn@latest add codarise/codarise-ui/<item>`.
- Variante B (Namespace `@codarise` für stabilen Alias / Custom-Hosting / Auth): in Zielprojekt `components.json` unter `registries` eintragen:
  ```json
  "registries": { "@codarise": "https://raw.githubusercontent.com/codarise/codarise-ui/main/public/r/{name}.json" }
  ```
  (erfordert `shadcn build`-Output unter `public/r/` im DS-Repo) — nur nötig wenn kein GitHub-Source reicht.
- Consumer-Pinning für reproduzierbare Installs: `#<40-char-sha>`.

---

**Hauptrisiken:** Composed-Block-Refactoring ist der Zeitfresser — ggf. erst Phasen 0–2 shippen, Phase 3 danach. Dogfooding zwingt zu Sauberkeit, deckt Coupling-Issues früh. `style: radix-nova` vs. fe-agentic `new-york` — Komponenten funktionieren übergreifend, aber Varianten/CSS-Vars können leicht abweichen; ggf. in Phase 4 alignen.
