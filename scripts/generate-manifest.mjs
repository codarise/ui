// Generates src/generated/manifest.ts from the registry JSON files.
//
// Run: `npm run gen:manifest` (also runs before dev/build).
//
// It reads every registry item, extracts the exported names from each source
// file, derives the consumer import path + install command, and emits a typed
// manifest the showcase app consumes. Adding a component to any registry.json
// makes it appear in the showcase automatically — no manual bookkeeping.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs"
import { resolve, dirname, join } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, "..")

const REGISTRY_OWNER = "codarise"
const REGISTRY_REPO = "ui"

/** @param {string} kebab e.g. "alert-dialog" */
function toPascalCase(kebab) {
  return kebab
    .split(/[-_\s]+/)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("")
}

/**
 * Extract value + type export names from a TS/TSX source string.
 * Handles `export { A, B }`, `export function X`, `export const X =`,
 * `export type X`, `export interface X`, `export type { A, B }`.
 */
function extractExports(source) {
  const valueExports = new Set()
  const typeExports = new Set()

  // export { A, B, C }  (value exports) — also `export { A, type B }`
  for (const m of source.matchAll(/export\s*\{([^}]*)\}/g)) {
    const inner = m[1]
    // Track an ongoing `type` modifier within the export list.
    let typeMode = false
    for (let part of inner.split(",")) {
      part = part.trim()
      if (!part) continue
      if (part.startsWith("type ")) {
        typeMode = false // `type` modifier is per-name in a list
        const name = part.slice(5).trim()
        if (name) typeExports.add(name)
        continue
      }
      // `as` aliasing — take the local name (before `as`)
      const name = part.split(/\s+as\s+/)[0].trim()
      if (!name) continue
      valueExports.add(name)
    }
  }

  // export function X / export function* X
  for (const m of source.matchAll(/export\s+function\s*\*?\s+([A-Za-z_$][\w$]*)/g)) {
    valueExports.add(m[1])
  }
  // export const X = / export let X = / export var X =
  for (const m of source.matchAll(/export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g)) {
    valueExports.add(m[1])
  }
  // export type X = / export interface X
  for (const m of source.matchAll(/export\s+type\s+([A-Za-z_$][\w$]*)\s*[=<{]/g)) {
    typeExports.add(m[1])
  }
  for (const m of source.matchAll(/export\s+interface\s+([A-Za-z_$][\w$]*)/g)) {
    typeExports.add(m[1])
  }

  return { valueExports: [...valueExports], typeExports: [...typeExports] }
}

function isPascalCase(name) {
  return /^[A-Z]/.test(name)
}

function pickMainExport(itemName, itemTitle, valueExports) {
  const candidates = valueExports.filter(isPascalCase)
  if (candidates.length === 0) {
    // Fall back to any value export (e.g. `cn`).
    return valueExports[0] ?? null
  }
  const fromName = toPascalCase(itemName)
  const fromTitle = toPascalCase(itemTitle)
  if (candidates.includes(fromName)) return fromName
  if (candidates.includes(fromTitle)) return fromTitle
  return candidates[0]
}

function importPathFor(type, registry, itemName) {
  if (type === "registry:lib") return `@/lib/${itemName}`
  // All registry:ui items (including those living under registry/custom/)
  // install into the consumer's components/ui directory.
  if (type === "registry:ui") return `@/components/ui/${itemName}`
  return null
}

function buildInstallCommand(itemName) {
  return `npx shadcn@latest add ${REGISTRY_OWNER}/${REGISTRY_REPO}/${itemName}`
}

function readRegistryFile(relPath) {
  const full = resolve(ROOT, relPath)
  return JSON.parse(readFileSync(full, "utf8"))
}

function main() {
  const root = readRegistryFile("registry.json")
  const includes = root.include ?? []

  /** @type {Array<object>} */
  const items = []

  for (const rel of includes) {
    const reg = readRegistryFile(rel)
    // registry dir e.g. "registry/ui" -> "ui"
    const registry = rel.split("/")[1] ?? "unknown"
    const registryDir = resolve(ROOT, dirname(rel))

    for (const item of reg.items ?? []) {
      const files = (item.files ?? []).map((f) => f.path)

      // Aggregate exports across all source files (skip non-tsx/ts).
      const allValue = new Set()
      const allType = new Set()
      for (const f of files) {
        if (!/\.(tsx?|jsx?)$/.test(f)) continue
        const srcPath = join(registryDir, f)
        let source = ""
        try {
          source = readFileSync(srcPath, "utf8")
        } catch {
          continue
        }
        const { valueExports, typeExports } = extractExports(source)
        valueExports.forEach((v) => allValue.add(v))
        typeExports.forEach((t) => allType.add(t))
      }

      const valueExports = [...allValue]
      const typeExports = [...allType]
      const mainExport = pickMainExport(item.name, item.title, valueExports)
      const importPath = importPathFor(item.type, registry, item.name)
      const importStatement =
        mainExport && importPath
          ? `import { ${mainExport} } from "${importPath}"`
          : null
      const installCommand = buildInstallCommand(item.name)

      items.push({
        name: item.name,
        title: item.title,
        description: item.description ?? "",
        type: item.type,
        registry,
        files,
        dependencies: item.dependencies ?? [],
        registryDependencies: item.registryDependencies ?? [],
        valueExports,
        typeExports,
        mainExport,
        importPath,
        importStatement,
        installCommand,
      })
    }
  }

  // Stable ordering: registry (ui, custom, lib, theme, blocks) then name.
  const registryOrder = ["ui", "custom", "lib", "theme", "blocks"]
  items.sort((a, b) => {
    const ra = registryOrder.indexOf(a.registry)
    const rb = registryOrder.indexOf(b.registry)
    if (ra !== rb) return ra - rb
    return a.name.localeCompare(b.name)
  })

  const outDir = resolve(ROOT, "src/generated")
  mkdirSync(outDir, { recursive: true })

  const json = JSON.stringify(items, null, 2)
  const content = `// AUTO-GENERATED by scripts/generate-manifest.mjs — do not edit by hand.
// Regenerate with \`npm run gen:manifest\`.

export interface ManifestItem {
  name: string
  title: string
  description: string
  type: string
  /** Source registry group: ui | custom | lib | theme | blocks */
  registry: string
  files: string[]
  dependencies: string[]
  registryDependencies: string[]
  /** All value exports aggregated across the item's files. */
  valueExports: string[]
  /** All type exports aggregated across the item's files. */
  typeExports: string[]
  /** The primary export featured in the import snippet, if any. */
  mainExport: string | null
  /** Consumer import path, e.g. "@/components/ui/button". */
  importPath: string | null
  /** Ready-to-copy import statement, e.g. import { Button } from "@/components/ui/button". */
  importStatement: string | null
  /** Ready-to-copy shadcn add command. */
  installCommand: string
}

export const manifest: ManifestItem[] = ${json}

export const manifestCount: number = ${items.length}
`

  const outPath = resolve(outDir, "manifest.ts")
  writeFileSync(outPath, content, "utf8")

  const byRegistry = items.reduce((acc, i) => {
    acc[i.registry] = (acc[i.registry] ?? 0) + 1
    return acc
  }, {})
  console.log(
    `✓ Generated ${outPath.replace(ROOT + "/", "")} — ${items.length} items:`,
    byRegistry
  )
}

main()
