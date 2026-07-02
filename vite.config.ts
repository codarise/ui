import fs from "fs"
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// Resolve @/lib/* and @/components/ui/* to the registry source files so the
// showcase uses the same components that get shipped to consumers (instead of
// the leftover src/components/ui defaults). @/components/ui/* checks both
// registry/ui/ and registry/custom/ since custom components ship as
// registry:ui and install into the consumer's @/components/ui/ directory.
function registryResolver() {
  const root = path.resolve(__dirname)
  const exts = [".tsx", ".ts", ".jsx", ".js"]
  const tryResolve = (dir: string, name: string) => {
    const base = path.resolve(root, dir, name)
    for (const ext of exts) {
      const full = base + ext
      if (fs.existsSync(full)) return full
    }
    return null
  }
  return {
    name: "registry-resolver",
    enforce: "pre",
    resolveId(source: string) {
      if (source.startsWith("@/lib/")) {
        const name = source.slice("@/lib/".length)
        return tryResolve("registry/lib", name)
      }
      if (source.startsWith("@/components/ui/")) {
        const name = source.slice("@/components/ui/".length)
        return tryResolve("registry/ui", name) ?? tryResolve("registry/custom", name)
      }
      return null
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), registryResolver()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
