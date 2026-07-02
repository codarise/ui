export interface ProjectTheme {
  id: string
  name: string
  gradient: string
  bgColorHex?: string
  icon: string
  textColor: string
}

export const PROJECT_THEMES: ProjectTheme[] = [
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    gradient: "bg-gradient-to-t from-cyan-400 via-blue-500 to-blue-600",
    bgColorHex: "#2563eb",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "sunset-orange",
    name: "Sunset Orange",
    gradient: "bg-gradient-to-t from-orange-400 via-pink-500 to-purple-600",
    bgColorHex: "#7c3aed",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "forest-green",
    name: "Forest Green",
    gradient: "bg-gradient-to-t from-emerald-400 via-green-500 to-teal-600",
    bgColorHex: "#0d9488",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "royal-purple",
    name: "Royal Purple",
    gradient: "bg-gradient-to-t from-purple-400 via-purple-600 to-indigo-700",
    bgColorHex: "#3730a3",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "golden-yellow",
    name: "Golden Yellow",
    gradient: "bg-gradient-to-t from-yellow-400 via-amber-500 to-orange-600",
    bgColorHex: "#ea580c",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "arctic-blue",
    name: "Arctic Blue",
    gradient: "bg-gradient-to-t from-slate-300 via-blue-300 to-indigo-400",
    bgColorHex: "#818cf8",
    icon: "Folder",
    textColor: "text-gray-800",
  },
  {
    id: "blush-pink",
    name: "Blush Pink",
    gradient: "bg-gradient-to-t from-pink-300 via-pink-400 to-rose-500",
    bgColorHex: "#f43f5e",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "midnight-blue",
    name: "Midnight Blue",
    gradient: "bg-gradient-to-t from-slate-700 via-blue-900 to-indigo-950",
    bgColorHex: "#1e1b4b",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "fire-red",
    name: "Fire Red",
    gradient: "bg-gradient-to-t from-red-500 via-orange-600 to-amber-700",
    bgColorHex: "#b45309",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "emerald-green",
    name: "Emerald Green",
    gradient: "bg-gradient-to-t from-teal-400 via-emerald-500 to-green-600",
    bgColorHex: "#16a34a",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "cosmic-purple",
    name: "Cosmic Purple",
    gradient: "bg-gradient-to-t from-indigo-500 via-purple-600 to-pink-600",
    bgColorHex: "#db2777",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "lime-green",
    name: "Lime Green",
    gradient: "bg-gradient-to-t from-lime-400 via-green-500 to-emerald-600",
    bgColorHex: "#059669",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "coral-orange",
    name: "Coral Orange",
    gradient: "bg-gradient-to-t from-pink-400 via-orange-300 to-orange-500",
    bgColorHex: "#f97316",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "silver-gray",
    name: "Silver Gray",
    gradient: "bg-gradient-to-t from-gray-300 via-gray-400 to-gray-600",
    bgColorHex: "#4b5563",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "mint-teal",
    name: "Mint Teal",
    gradient: "bg-gradient-to-t from-teal-200 via-cyan-300 to-blue-400",
    bgColorHex: "#60a5fa",
    icon: "Folder",
    textColor: "text-gray-800",
  },
  {
    id: "ruby-red",
    name: "Ruby Red",
    gradient: "bg-gradient-to-t from-red-400 via-rose-500 to-pink-600",
    bgColorHex: "#db2777",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "galaxy-mint",
    name: "Galaxy Mint",
    gradient: "bg-gradient-to-t from-emerald-200 via-blue-200 to-purple-200",
    bgColorHex: "#e9d5ff",
    icon: "Folder",
    textColor: "text-gray-800",
  },
  {
    id: "matrix-code",
    name: "Matrix Code",
    gradient: "bg-gradient-to-t from-black via-green-700 to-lime-500",
    bgColorHex: "#a3e635",
    icon: "Folder",
    textColor: "text-lime-300",
  },
  {
    id: "volcano-lava",
    name: "Volcano Lava",
    gradient: "bg-gradient-to-t from-yellow-700 via-orange-800 to-red-900",
    bgColorHex: "#7f1d1d",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "bubblegum-dream",
    name: "Bubblegum Dream",
    gradient: "bg-gradient-to-t from-pink-200 via-fuchsia-300 to-rose-500",
    bgColorHex: "#f43f5e",
    icon: "Folder",
    textColor: "text-pink-900",
  },
  {
    id: "neon-violet",
    name: "Neon Violet",
    gradient: "bg-gradient-to-t from-fuchsia-500 via-violet-600 to-cyan-400",
    bgColorHex: "#22d3ee",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    gradient: "bg-gradient-to-t from-gray-900 via-pink-700 to-yellow-400",
    bgColorHex: "#facc15",
    icon: "Folder",
    textColor: "text-yellow-200",
  },
  {
    id: "aurora-borealis",
    name: "Aurora Borealis",
    gradient: "bg-gradient-to-t from-green-300 via-indigo-400 to-purple-500",
    bgColorHex: "#a21caf",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "desert-sunset",
    name: "Desert Sunset",
    gradient: "bg-gradient-to-t from-amber-300 via-orange-400 to-pink-300",
    bgColorHex: "#f9a8d4",
    icon: "Folder",
    textColor: "text-orange-900",
  },
  {
    id: "pixel-pop",
    name: "Pixel Pop",
    gradient: "bg-gradient-to-tr from-pink-500 via-yellow-500 to-sky-400",
    bgColorHex: "#38bdf8",
    icon: "Folder",
    textColor: "text-black",
  },
  {
    id: "frostbyte",
    name: "Frostbyte",
    gradient: "bg-gradient-to-t from-cyan-100 via-blue-200 to-blue-400",
    bgColorHex: "#60a5fa",
    icon: "Folder",
    textColor: "text-blue-800",
  },
  {
    id: "rainbow-blast",
    name: "Rainbow Blast",
    gradient:
      "bg-gradient-to-t from-red-400 via-amber-400 via-lime-400 via-blue-400 to-pink-500",
    bgColorHex: "#ec4899",
    icon: "Folder",
    textColor: "text-gray-900",
  },
  {
    id: "papaya-pop",
    name: "Papaya Pop",
    gradient: "bg-gradient-to-t from-orange-200 via-yellow-300 to-lime-200",
    bgColorHex: "#d9f99d",
    icon: "Folder",
    textColor: "text-orange-900",
  },
  {
    id: "twilight-horizon",
    name: "Twilight Horizon",
    gradient: "bg-gradient-to-t from-slate-700 via-indigo-700 to-yellow-300",
    bgColorHex: "#fde047",
    icon: "Folder",
    textColor: "text-gray-100",
  },
  {
    id: "starship-gray",
    name: "Starship Gray",
    gradient: "bg-gradient-to-t from-gray-700 via-slate-400 to-gray-300",
    bgColorHex: "#d1d5db",
    icon: "Folder",
    textColor: "text-black",
  },
  {
    id: "fresh-limeade",
    name: "Fresh Limeade",
    gradient: "bg-gradient-to-t from-lime-200 via-lime-400 to-green-400",
    bgColorHex: "#22c55e",
    icon: "Folder",
    textColor: "text-gray-900",
  },
  {
    id: "deep-space",
    name: "Deep Space",
    gradient: "bg-gradient-to-t from-black via-gray-900 to-slate-800",
    bgColorHex: "#1e293b",
    icon: "Folder",
    textColor: "text-indigo-200",
  },
  {
    id: "midori-matcha",
    name: "Midori Matcha",
    gradient: "bg-gradient-to-t from-green-200 via-lime-300 to-emerald-400",
    bgColorHex: "#34d399",
    icon: "Folder",
    textColor: "text-emerald-900",
  },
  {
    id: "ferrari-red",
    name: "Ferrari Red",
    gradient: "bg-gradient-to-tr from-rose-700 via-red-600 to-amber-400",
    bgColorHex: "#fbbf24",
    icon: "Folder",
    textColor: "text-white",
  },
  {
    id: "aquamarine-wave",
    name: "Aquamarine Wave",
    gradient: "bg-gradient-to-tr from-teal-300 via-cyan-400 to-blue-300",
    bgColorHex: "#93c5fd",
    icon: "Folder",
    textColor: "text-teal-900",
  },
  {
    id: "vintage-cream",
    name: "Vintage Cream",
    gradient: "bg-gradient-to-t from-yellow-100 via-amber-200 to-yellow-300",
    bgColorHex: "#fde047",
    icon: "Folder",
    textColor: "text-yellow-900",
  },
  {
    id: "royal-gold",
    name: "Royal Gold",
    gradient: "bg-gradient-to-t from-yellow-300 via-amber-400 to-amber-700",
    bgColorHex: "#b45309",
    icon: "Folder",
    textColor: "text-amber-900",
  },
  {
    id: "hologram",
    name: "Hologram",
    gradient: "bg-gradient-to-t from-cyan-400 via-indigo-200 to-pink-200",
    bgColorHex: "#fbcfe8",
    icon: "Folder",
    textColor: "text-gray-900",
  },
  {
    id: "mystic-mauve",
    name: "Mystic Mauve",
    gradient: "bg-gradient-to-t from-fuchsia-200 via-purple-400 to-pink-700",
    bgColorHex: "#be185d",
    icon: "Folder",
    textColor: "text-purple-900",
  },
  {
    id: "drive-agent",
    name: "Drive Agent",
    gradient:
      "bg-gradient-to-t from-[var(--ai-teal)] via-[var(--ai-green)] to-[var(--ai-teal)]",
    bgColorHex: "var(--ai-teal)",
    icon: "Folder",
    textColor: "text-white",
  },
]

export function getRandomTheme(): ProjectTheme {
  const randomIndex = Math.floor(Math.random() * PROJECT_THEMES.length)
  const theme = PROJECT_THEMES[randomIndex]
  if (!theme) {
    return PROJECT_THEMES[0] as ProjectTheme
  }
  return theme
}

export function getThemeById(id: string): ProjectTheme | undefined {
  return PROJECT_THEMES.find((theme) => theme.id === id)
}

export interface ProjectThemeSettings {
  themeId: string
  gradient: string
  icon: string
  textColor: string
}

export function themeToSettings(theme: ProjectTheme): ProjectThemeSettings {
  return {
    themeId: theme.id,
    gradient: theme.gradient,
    icon: theme.icon,
    textColor: theme.textColor,
  }
}
