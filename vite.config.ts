import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// The showcase serves registry source files directly (registry/ui/,
// registry/custom/, registry/lib/) instead of the stale copies in
// src/components/ui/. We use ordered aliases: specific registry paths
// are matched before the catch-all @ → ./src, so @/components/ui/button
// resolves to registry/ui/button.tsx, @/components/ui/copy-button resolves
// to registry/custom/copy-button.tsx, and @/App still resolves to src/App.tsx.
function registryAliases(): Array<{ find: string; replacement: string }> {
  const root = path.resolve(__dirname)
  const custom = [
    "copy-button",
    "glow-backdrop",
    "icon-wrapper",
    "kbd",
    "marker",
    "search-input",
    "sparklespinner",
    "stepper",
    "text-shimmer",
  ]
  return [
    // Registry lib files → registry/lib/
    { find: "@/lib/utils", replacement: path.join(root, "registry/lib/utils") },
    { find: "@/lib/model-colors", replacement: path.join(root, "registry/lib/model-colors") },
    { find: "@/lib/project-themes", replacement: path.join(root, "registry/lib/project-themes") },
    // Custom UI components → registry/custom/
    ...custom.map((name) => ({
      find: `@/components/ui/${name}`,
      replacement: path.join(root, `registry/custom/${name}`),
    })),
    // Everything else in @/components/ui/ → registry/ui/
    { find: "@/components/ui/", replacement: path.join(root, "registry/ui") + "/" },
    // Everything else → src/ (showcase-specific code)
    { find: "@/", replacement: path.join(root, "src") + "/" },
  ]
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: registryAliases(),
  },
})
