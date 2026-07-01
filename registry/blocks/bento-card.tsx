import { Badge } from '../ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'
import {
  PROJECT_THEMES,
  type ProjectTheme,
} from '../lib/project-themes'
import { cn } from '../lib/utils'

export type GradientVariant = (typeof PROJECT_THEMES)[number]['id']

function getTheme(id: GradientVariant): ProjectTheme {
  const theme = PROJECT_THEMES.find(t => t.id === id)
  if (theme) return theme
  const fallback = PROJECT_THEMES[0]
  if (fallback) return fallback
  return {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    gradient: 'bg-gradient-to-t from-cyan-400 via-blue-500 to-blue-600',
    icon: 'Folder',
    textColor: 'text-white',
  }
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

export function BentoCard({
  featured = false,
  title,
  description,
  icon: Icon,
  className,
  badge,
  children,
  headerContent,
  gradient,
  onClick,
}: BentoCardProps) {
  const hasAction = !!onClick
  const theme = gradient ? getTheme(gradient) : null

  return (
    <Card
      interactive={hasAction}
      className={cn(className)}
      onClick={hasAction ? onClick : undefined}
    >
      <div
        className={cn(
          'relative w-full flex-1 -mt-5 -mx-0 border-b rounded-t-lg',
          'overflow-hidden',
          featured && headerContent
            ? 'min-h-[240px]'
            : headerContent
              ? 'min-h-[180px]'
              : 'min-h-[140px]'
        )}
      >
        <div
          className={cn(
            'absolute inset-0 opacity-30 grayscale-75 transition-[opacity,filter] duration-200 ease-out',
            'pointer-fine:group-hover:grayscale-0 pointer-fine:group-hover:opacity-40',
            theme?.gradient,
            featured &&
              'grayscale-0 opacity-70 pointer-fine:group-hover:opacity-100'
          )}
        />

        <div className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none bg-dither" />

        <div className="absolute inset-0 opacity-40 pointer-fine:group-hover:opacity-100 transition-opacity duration-200 ease-out overflow-hidden">
          <div
            className={cn(
              'absolute -top-1/2 -left-1/4 w-3/4 h-3/4 rounded-full blur-2xl opacity-60',
              theme?.gradient
            )}
          />
          <div
            className={cn(
              'absolute -bottom-1/4 -right-1/4 w-2/3 h-2/3 rounded-full blur-2xl opacity-50',
              theme?.gradient
            )}
          />
          <div
            className={cn(
              'absolute top-1/4 right-1/4 w-1/2 h-1/2 rounded-full blur-3xl opacity-40',
              theme?.gradient
            )}
          />
        </div>

        <div className="w-full h-full flex items-center justify-center relative z-10">
          {headerContent ?? (
            <div className="relative">
              <Icon
                className={cn(
                  'size-10 drop-shadow-md opacity-10 pointer-fine:group-hover:opacity-100 transition-opacity duration-200 ease-out stroke-[1.25]',
                  theme?.textColor,
                  featured && 'opacity-100'
                )}
              />
            </div>
          )}
        </div>
      </div>
      <CardHeader className="relative z-10 !gap-1">
        <div className="flex items-start justify-start">
          {badge && <Badge className="text-xs mb-2">{badge}</Badge>}
        </div>
        <CardTitle className="text-base pointer-fine:group-hover:text-primary transition-colors duration-200 ease-out">
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
