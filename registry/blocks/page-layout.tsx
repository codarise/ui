import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

import { Button } from '../ui/button'
import { cn } from '../lib/utils'

interface PageLayoutProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'none'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function PageLayout({
  children,
  className,
  maxWidth = '2xl',
  padding = 'lg',
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-2xl mx-auto',
    md: 'max-w-4xl mx-auto',
    lg: 'max-w-6xl mx-auto',
    xl: 'max-w-7xl mx-auto',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-none',
    none: '',
  }

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-4',
    md: 'px-6 py-6',
    lg: 'px-4 py-6 sm:px-6 sm:py-6 lg:px-14 lg:py-14',
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div
        className={cn(
          'flex-1 flex flex-col w-full mx-auto min-h-0',
          maxWidthClasses[maxWidth],
          paddingClasses[padding],
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

interface PageHeaderProps {
  title: string
  description?: string
  children?: ReactNode
  /** `true` = browser back; or a custom control (e.g. `<Link>` with search params). */
  backButton?: boolean | ReactNode
  className?: string
  subItem?: ReactNode
  icon?: ReactNode
}

export function PageHeader({
  title,
  subItem,
  description,
  children,
  backButton,
  className,
  icon,
}: PageHeaderProps) {
  const showBackButton = backButton != null && backButton !== false

  return (
    <div
      className={cn(
        'flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between antialiased ',
        'mb-5 sm:mb-6 lg:mb-8',
        className
      )}
    >
      {showBackButton &&
        (backButton === true ? (
          <Button
            variant="outline"
            size="icon"
            type="button"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="size-4" />
          </Button>
        ) : (
          backButton
        ))}
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex items-center gap-4 items-start">
          {subItem && (
            <div className="flex items-center gap-2 font-medium">
              <span className="text-xs text-muted-foreground">{subItem}</span>
            </div>
          )}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              {icon}
              <h1 className="text-lg sm:text-xl lg:text-2xl font-medium line-clamp-1 truncate lg:leading-tight">
                {title}
              </h1>
            </div>
            {description && (
              <p className="text-sm sm:text-base text-muted-foreground max-w-3xl line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
      {children && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center lg:flex-shrink-0">
          {children}
        </div>
      )}
    </div>
  )
}

interface PageSectionProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  spacing?: 'sm' | 'md' | 'lg'
}

export function PageSection({
  title,
  description,
  children,
  className,
  spacing = 'md',
}: PageSectionProps) {
  const spacingClasses = {
    sm: 'mb-6',
    md: 'mb-8 sm:mb-10',
    lg: 'mb-10 sm:mb-12 lg:mb-16',
  }

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {(title || description) && (
        <div className="mb-4 sm:mb-6">
          {title && (
            <h2 className="text-base sm:text-lg font-medium tracking-tight mb-2">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm sm:text-base text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  )
}

interface PageContentProps {
  children: ReactNode
  className?: string
  spacing?: 'sm' | 'md' | 'lg'
  /** When false, skips the default page fade-in (use when children handle their own entrance). */
  enterAnimation?: boolean
}

export function PageContent({
  children,
  className,
  spacing = 'md',
  enterAnimation = true,
}: PageContentProps) {
  const spacingClasses = {
    sm: 'space-y-3',
    md: 'space-y-3 sm:space-y-5',
    lg: 'space-y-5 sm:space-y-8 lg:space-y-10',
  }

  return (
    <div
      className={cn(
        enterAnimation && 'animate-in fade-in',
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  )
}
