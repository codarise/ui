import * as React from "react"

import { Badge } from "../ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import {
  PROJECT_THEMES,
  getThemeById,
  type ProjectTheme,
} from "../lib/project-themes"
import { cn } from "../lib/utils"

export type GradientVariant = (typeof PROJECT_THEMES)[number]["id"]

const FALLBACK_THEME: ProjectTheme = {
  id: "ocean-blue",
  name: "Ocean Blue",
  gradient: "bg-gradient-to-t from-cyan-400 via-blue-500 to-blue-600",
  icon: "Folder",
  textColor: "text-white",
}

function getTheme(id: GradientVariant): ProjectTheme {
  return getThemeById(id) ?? PROJECT_THEMES[0] ?? FALLBACK_THEME
}

export interface BentoCardProps {
  title: string
  description?: string
  icon: React.ElementType
  className?: string
  badge?: string
  children?: React.ReactNode
  headerContent?: React.ReactNode
  gradient?: GradientVariant
  onClick?: () => void
  featured?: boolean
}

const MIN_HEIGHTS = {
  featuredWithHeader: "min-h-[240px]",
  header: "min-h-[180px]",
  default: "min-h-[140px]",
} as const

type MinHeightKey = keyof typeof MIN_HEIGHTS

function getMinHeightKey(
  featured: boolean,
  hasHeaderContent: boolean
): MinHeightKey {
  if (featured && hasHeaderContent) return "featuredWithHeader"
  if (hasHeaderContent) return "header"
  return "default"
}

interface BentoCardBackgroundProps {
  theme?: ProjectTheme | null
  featured?: boolean
}

function BentoCardBackground({
  theme,
  featured = false,
}: BentoCardBackgroundProps) {
  return (
    <>
      <div
        className={cn(
          "absolute inset-0 opacity-30 grayscale-75",
          "transition-[opacity,filter] duration-300 ease-[var(--ease-out)]",
          "pointer-fine:group-hover:opacity-40 pointer-fine:group-hover:grayscale-0 dark:pointer-fine:group-hover:opacity-35",
          theme?.gradient,
          featured &&
            "opacity-80 grayscale-0 dark:opacity-70 pointer-fine:group-hover:opacity-100"
        )}
      />

      <div className="pointer-events-none absolute inset-0 bg-dither opacity-[0.15] mix-blend-overlay dark:opacity-[0.12]" />

      <div className="absolute inset-0 overflow-hidden opacity-40 transition-opacity duration-300 ease-[var(--ease-out)] dark:opacity-30 pointer-fine:group-hover:opacity-100">
        <div
          className={cn(
            "absolute -top-1/2 -left-1/4 h-3/4 w-3/4 rounded-full opacity-60 blur-2xl",
            theme?.gradient
          )}
        />
        <div
          className={cn(
            "absolute -right-1/4 -bottom-1/4 h-2/3 w-2/3 rounded-full opacity-50 blur-2xl",
            theme?.gradient
          )}
        />
        <div
          className={cn(
            "absolute top-1/4 right-1/4 h-1/2 w-1/2 rounded-full opacity-40 blur-3xl",
            theme?.gradient
          )}
        />
      </div>
    </>
  )
}

interface BentoCardHeaderProps {
  icon: React.ElementType
  headerContent?: React.ReactNode
  theme?: ProjectTheme | null
  featured?: boolean
}

function BentoCardHeader({
  icon: Icon,
  headerContent,
  theme,
  featured = false,
}: BentoCardHeaderProps) {
  return (
    <div className="relative z-10 flex h-full w-full items-center justify-center">
      {headerContent ?? (
        <Icon
          className={cn(
            "size-10 stroke-[1.25] opacity-10 drop-shadow-md",
            "transition-all duration-300 ease-[var(--ease-out)] pointer-fine:group-hover:opacity-100",
            theme?.textColor,
            featured && "opacity-100"
          )}
        />
      )}
    </div>
  )
}

export function BentoCard({
  featured = false,
  title,
  description,
  icon,
  className,
  badge,
  children,
  headerContent,
  gradient,
  onClick,
}: BentoCardProps) {
  const hasAction = !!onClick
  const theme = gradient ? getTheme(gradient) : null
  const minHeight = MIN_HEIGHTS[getMinHeightKey(featured, !!headerContent)]

  return (
    <Card
      interactive={hasAction}
      className={cn(
        hasAction && [
          "pointer-fine:hover:scale-[1.005]",
          "transition-[box-shadow,border-color,transform] duration-300 ease-[var(--ease-out)]",
        ],
        className
      )}
      onClick={hasAction ? onClick : undefined}
    >
      <div
        className={cn(
          "relative -mx-0 -mt-5 w-full flex-1 overflow-hidden rounded-t-lg border-b",
          minHeight
        )}
      >
        <BentoCardBackground theme={theme} featured={featured} />
        <BentoCardHeader
          icon={icon}
          headerContent={headerContent}
          theme={theme}
          featured={featured}
        />
      </div>
      <CardHeader className="relative z-10 !gap-1">
        <div className="flex items-start justify-start">
          {badge && <Badge className="mb-2 text-xs">{badge}</Badge>}
        </div>
        <CardTitle className="text-base transition-colors duration-300 ease-[var(--ease-out)] pointer-fine:group-hover:text-primary">
          {title}
        </CardTitle>
        {description && (
          <CardDescription className="text-sm">{description}</CardDescription>
        )}
      </CardHeader>
      {children && (
        <CardContent className="relative z-10 pt-0">{children}</CardContent>
      )}
    </Card>
  )
}
