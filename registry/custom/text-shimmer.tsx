import React, { useMemo, useRef, useEffect, useCallback } from "react"

import { cn } from "@/lib/utils"

type ShimmerVariant = "default" | "purple" | "sky"

interface TextShimmerProps {
  children: string
  as?: React.ElementType
  className?: string
  duration?: number
  spread?: number
  shimmer?: boolean
  variant?: ShimmerVariant
}

// Color mappings for each variant
const variantColors = {
  default: {
    light: {
      base: "#0a0a0a",
      gradient: "#000",
    },
    dark: {
      base: "#737373",
      gradient: "#ffffff",
    },
  },
  purple: {
    light: {
      base: "#a855f7", // purple-500
      gradient: "#9333ea", // purple-600
    },
    dark: {
      base: "#c084fc", // purple-400
      gradient: "#e9d5ff", // purple-200
    },
  },
  sky: {
    light: {
      base: "#0ea5e9", // sky-500
      gradient: "#0284c7", // sky-600
    },
    dark: {
      base: "#38bdf8", // sky-400
      gradient: "#bae6fd", // sky-200
    },
  },
} as const

export function TextShimmer({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
  shimmer = true,
  variant = "default",
}: TextShimmerProps) {
  const ref = useRef<HTMLElement>(null)

  const dynamicSpread = useMemo(() => {
    return children.length * spread
  }, [children, spread])

  const colors = variantColors[variant]

  // Build gradient strings for the current theme
  const buildGradients = useCallback(
    (isDark: boolean) => {
      const currentColors = isDark ? colors.dark : colors.light
      const shimmerBg = `linear-gradient(90deg, transparent calc(50% - ${dynamicSpread}px), ${currentColors.gradient}, transparent calc(50% + ${dynamicSpread}px))`
      const baseGradient = `linear-gradient(${currentColors.base}, ${currentColors.base})`
      return `${shimmerBg}, ${baseGradient}`
    },
    [colors, dynamicSpread]
  )

  // Apply styles whenever shimmer/duration/variant/colors change
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const isDark = document.documentElement.classList.contains("dark")

    el.style.setProperty("--shimmer-duration", `${duration}s`)
    el.style.backgroundImage = buildGradients(isDark)

    if (shimmer) {
      el.style.setProperty(
        "animation",
        `text-shimmer-move var(--shimmer-duration) linear infinite`
      )
    } else {
      el.style.setProperty("animation", "none")
    }
  }, [shimmer, duration, buildGradients])

  // Watch for theme changes
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark")
      el.style.backgroundImage = buildGradients(isDark)
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [buildGradients])

  // Initial colors (light mode)
  const lightBg = `linear-gradient(90deg, transparent calc(50% - ${dynamicSpread}px), ${colors.light.gradient}, transparent calc(50% + ${dynamicSpread}px))`
  const lightBaseGradient = `linear-gradient(${colors.light.base}, ${colors.light.base})`

  return React.createElement(
    Component,
    {
      ref,
      className: cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text",
        "[background-repeat:no-repeat,padding-box] text-transparent",
        className
      ),
      style: {
        backgroundImage: `${lightBg}, ${lightBaseGradient}`,
        backgroundPosition: shimmer ? "100% center" : "0% center",
      } as React.CSSProperties,
      "data-shimmer-variant": variant,
    },
    children
  )
}
