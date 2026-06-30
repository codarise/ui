import * as React from "react"
import { Moon, Sun } from "lucide-react"

import { manifest, manifestCount } from "../../generated/manifest"
import { Button } from "../../../registry/ui/button"
import { Toaster } from "../../../registry/ui/sonner"
import { SearchInput } from "../../../registry/custom/search-input"
import { useTheme } from "@/components/theme-provider"

import { ShowcaseCard } from "./ShowcaseCard"

const REGISTRY_FILTERS = ["all", "ui", "custom", "blocks", "lib", "theme"] as const
type RegistryFilter = (typeof REGISTRY_FILTERS)[number]

export function Showcase() {
  const [query, setQuery] = React.useState("")
  const [registry, setRegistry] = React.useState<RegistryFilter>("all")
  const { theme, setTheme } = useTheme()

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return manifest.filter((item) => {
      if (registry !== "all" && item.registry !== registry) return false
      if (!q) return true
      return (
        item.name.toLowerCase().includes(q) ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.mainExport?.toLowerCase().includes(q) ?? false)
      )
    })
  }, [query, registry])

  return (
    <div className="min-h-svh">
      <Toaster />
      <header className="bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                codarise<span className="text-muted-foreground">-ui</span>
              </h1>
              <p className="text-muted-foreground text-xs">
                {manifestCount} components · shadcn registry
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              title="Toggle theme (or press d)"
            >
              <Sun className="size-4 dark:hidden" />
              <Moon className="hidden size-4 dark:block" />
            </Button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search components..."
              className="sm:max-w-xs"
            />
            <div className="flex flex-wrap gap-1">
              {REGISTRY_FILTERS.map((r) => (
                <Button
                  key={r}
                  variant={registry === r ? "default" : "outline"}
                  size="sm"
                  onClick={() => setRegistry(r)}
                  className="capitalize"
                >
                  {r}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground py-12 text-center text-sm">
            No components match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-2">
            {filtered.map((item) => (
              <ShowcaseCard key={item.name} item={item} />
            ))}
          </div>
        )}
        <footer className="text-muted-foreground mt-10 pb-6 text-center text-xs">
          Press <kbd className="font-sans">d</kbd> to toggle dark mode ·
          Built with the Polarise design system
        </footer>
      </main>
    </div>
  )
}
