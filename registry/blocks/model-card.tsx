import type { ElementType, ReactNode } from "react"
import { BrainCircuit, ChevronRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { getModelColorByName } from "../lib/model-colors"
import { cn } from "../lib/utils"

export interface ModelCardProps {
  /** Model name — used as title and for hash-based color derivation if no `color` is given */
  title: string
  /** Subtitle, e.g. pipeline tag or provider */
  description?: string
  /** Override the auto-derived color (hex, e.g. '#3b82f6') */
  color?: string
  /** Icon component, defaults to BrainCircuit */
  icon?: ElementType<{ className?: string }>
  /** Badges row (license, param size, etc.) */
  badges?: ReactNode
  /** Extra metadata rows (pricing, source link, etc.) */
  metadata?: ReactNode
  /** Feature/capability badges at the bottom */
  features?: ReactNode
  /** Footer content (e.g. created date) */
  footer?: ReactNode
  /** Action button in the header (e.g. Playground button) */
  action?: ReactNode
  /** Click handler — makes the card interactive (hover + chevron) */
  onClick?: () => void
  className?: string
}

/**
 * A model card with gradient background derived from the model name.
 * Fully generic — pass badges, metadata, features, and footer as ReactNode.
 * Color is auto-derived via `getModelColorByName` or can be overridden.
 */
export function ModelCard({
  title,
  description,
  color,
  icon: Icon = BrainCircuit,
  badges,
  metadata,
  features,
  footer,
  action,
  onClick,
  className,
}: ModelCardProps) {
  const modelColor = color ?? getModelColorByName(title, "hex")
  const interactive = !!onClick

  return (
    <Card
      interactive={interactive}
      className={cn("gap-0 overflow-hidden p-0", className)}
      onClick={onClick}
    >
      <div
        className="relative flex flex-1 flex-col"
        style={{
          background: `linear-gradient(135deg, ${modelColor}12 0%, transparent 60%)`,
        }}
      >
        <div
          className="pointer-events-none absolute -top-20 -right-16 size-48 rounded-full opacity-0 blur-3xl transition-opacity duration-200 ease-out pointer-fine:group-hover:opacity-100"
          style={{
            background: `${modelColor}24`,
          }}
          aria-hidden="true"
        />

        <CardHeader className="relative z-10 !gap-3 p-4 pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${modelColor}33 0%, ${modelColor}10 100%)`,
                  color: modelColor,
                }}
              >
                <Icon className="size-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <CardTitle className="truncate text-base transition-colors duration-150 ease-out pointer-fine:group-hover:text-primary">
                    {title}
                  </CardTitle>
                  {interactive && (
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-[opacity,transform,color] duration-150 ease-out pointer-fine:group-hover:translate-x-0.5 pointer-fine:group-hover:text-primary pointer-fine:group-hover:opacity-100" />
                  )}
                </div>
                {description && (
                  <CardDescription className="truncate text-xs">
                    {description}
                  </CardDescription>
                )}
              </div>
            </div>

            {action && <div className="shrink-0">{action}</div>}
          </div>

          {badges && (
            <div className="flex flex-wrap items-center gap-1.5">{badges}</div>
          )}
        </CardHeader>

        <CardContent className="relative z-10 flex flex-1 flex-col gap-3 px-4 pb-4">
          {metadata}
          {features}
          <div className="flex-1" />
          {footer}
        </CardContent>
      </div>
    </Card>
  )
}
