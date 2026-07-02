import type { ElementType, ReactNode } from "react"

import { CardDescription, CardTitle } from "../ui/card"
import { cn } from "../lib/utils"

interface FeaturedCardShared {
  heading: string
  description?: string
  icon: ElementType<{ className?: string }>
  iconClassName?: string
  action?: ReactNode
}

export type FeaturedCardProps = FeaturedCardShared &
  (
    | { ctaLink: string; ctaText: string; action?: never }
    | { action: ReactNode; ctaLink?: never; ctaText?: never }
  )

/**
 * Featured strip: gradient border, faded icon, headline + CTA (link or custom action).
 */
export function FeaturedCard(props: FeaturedCardProps) {
  const { heading, description, icon: Icon, iconClassName, action } = props

  return (
    <section
      className={cn(
        "relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/25 bg-gradient-to-l from-[var(--ai-teal)] to-[var(--ai-green)] p-px text-card-foreground shadow-sm"
      )}
    >
      <div
        className={cn(
          "relative z-[1] flex h-full w-full flex-col items-center gap-5 rounded-[0.5rem] bg-gradient-to-t from-card to-background p-5"
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-dither opacity-[0.15] mix-blend-overlay" />
        <div
          className="pointer-events-none absolute inset-0 z-0 flex items-start justify-start overflow-hidden"
          aria-hidden="true"
        >
          <Icon className={cn(iconClassName) + " opacity-10 drop-shadow-md"} />
        </div>
        <div className="relative z-[1] flex w-full flex-wrap items-center justify-between gap-5">
          <div>
            <CardTitle className="text-base transition-colors duration-150 ease-out pointer-fine:group-hover:text-primary">
              {heading}
            </CardTitle>
            {description ? (
              <CardDescription className="mt-1">{description}</CardDescription>
            ) : null}
          </div>
          <div className="shrink-0">{action}</div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 rounded-md bg-gradient-to-r from-[var(--ai-green)]/30 to-[var(--ai-teal)]/30 blur-xl" />
    </section>
  )
}
