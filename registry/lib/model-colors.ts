const TAILWIND_COLORS = {
  // Blue spectrum
  "blue-300": "#93c5fd",
  "blue-400": "#60a5fa",
  "blue-500": "#3b82f6",
  "blue-600": "#2563eb",
  "blue-700": "#1d4ed8",
  "blue-800": "#1e40af",

  // Sky/Cyan spectrum
  "sky-300": "#7dd3fc",
  "sky-400": "#38bdf8",
  "sky-500": "#0ea5e9",
  "cyan-400": "#22d3ee",

  // Green spectrum
  "green-300": "#86efac",
  "green-400": "#4ade80",
  "green-500": "#22c55e",
  "emerald-400": "#34d399",
  "emerald-500": "#10b981",
  "teal-400": "#2dd4bf",
  "teal-500": "#14b8a6",

  // Yellow/Amber spectrum
  "yellow-300": "#fde047",
  "yellow-400": "#facc15",
  "amber-400": "#fbbf24",
  "amber-500": "#f59e0b",

  // Orange spectrum
  "orange-300": "#fdba74",
  "orange-400": "#fb923c",
  "orange-500": "#f97316",
  "orange-600": "#ea580c",

  // Red spectrum
  "red-300": "#fca5a5",
  "red-400": "#f87171",
  "red-500": "#ef4444",

  // Pink/Rose spectrum
  "pink-400": "#f472b6",
  "pink-500": "#ec4899",
  "rose-400": "#fb7185",
  "rose-500": "#f43f5e",

  // Purple/Violet spectrum
  "purple-400": "#a78bfa",
  "purple-500": "#8b5cf6",
  "violet-400": "#a78bfa",
  "violet-500": "#8b5cf6",

  // Indigo spectrum
  "indigo-400": "#818cf8",
  "indigo-500": "#6366f1",

  // Slate (for neutral/unknown)
  "slate-400": "#94a3b8",
  "muted-foreground": "#64748b",
} as const

type TailwindColorName = keyof typeof TAILWIND_COLORS

// =============================================================================
// MODEL-SPECIFIC COLOR ASSIGNMENTS
// Maps model names to Tailwind color names
// =============================================================================

const MODEL_COLOR_ASSIGNMENTS: Record<string, TailwindColorName> = {
  // Meta Models (Llama) - Blue tones
  "llama-3.1-8b": "blue-500",
  "llama-3.1-70b": "blue-600",
  "llama-3.1-405b": "blue-800",

  // Mistral Models - Orange tones
  "mistral:latest": "orange-400",
  "mistral-medium": "orange-500",
  "mistral-small": "orange-600",

  // Gemma Models - Purple/Green
  "gemma3:1b": "purple-400",
  "gemma3:latest": "emerald-400",
}

// =============================================================================
// DYNAMIC COLOR PALETTE
// Used for models without specific assignments (hash-based selection)
// Order matters: spread colors across the spectrum for visual distinction
// =============================================================================

const DYNAMIC_PALETTE: TailwindColorName[] = [
  "blue-400",
  "amber-400",
  "emerald-400",
  "purple-400",
  "pink-400",
  "sky-400",
  "red-400",
  "teal-400",
  "indigo-400",
  "rose-400",
  "orange-400",
  "cyan-400",
]

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

function toHex(colorName: TailwindColorName): string {
  return TAILWIND_COLORS[colorName]
}

function toTailwindClass(colorName: TailwindColorName): string {
  return `bg-${colorName}`
}

function hashString(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Get a consistent color for a model based on its name.
 * Uses specific colors for known models, hash-based assignment for unknown ones.
 *
 * @param modelName - The name of the model
 * @param format - 'hex' for SVG fills, 'tailwind' for CSS background classes
 * @returns The color value in the specified format
 *
 * @example
 * getModelColorByName('llama-3.1-8b', 'hex')      // '#3b82f6'
 * getModelColorByName('llama-3.1-8b', 'tailwind') // 'bg-blue-500'
 * getModelColorByName('unknown-model', 'hex')    // hash-based color
 */
export function getModelColorByName(
  modelName: string,
  format: "hex" | "tailwind" = "hex"
): string {
  // Check for specific assignment first
  const assignedColor = MODEL_COLOR_ASSIGNMENTS[modelName]
  if (assignedColor) {
    return format === "hex"
      ? toHex(assignedColor)
      : toTailwindClass(assignedColor)
  }

  // Hash-based fallback for unknown models
  const colorIndex = hashString(modelName) % DYNAMIC_PALETTE.length
  // Safe access: modulo ensures index is always in bounds, fallback for TypeScript
  const color: TailwindColorName = DYNAMIC_PALETTE[colorIndex] ?? "blue-400"
  return format === "hex" ? toHex(color) : toTailwindClass(color)
}
