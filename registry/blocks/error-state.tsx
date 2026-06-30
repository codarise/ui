import { AlertCircle } from 'lucide-react'
import type { ReactNode } from 'react'

import { IconWrapper } from '../custom/icon-wrapper'
import { Button } from '../ui/button'
import { cn } from '../lib/utils'

interface ErrorStateProps {
  title?: string
  description?: string
  /** When provided and `description` is not set, `error.message` is used as the description. */
  error?: Error | { message?: string } | null
  /** Renders a "Try Again" button that calls this callback. Ignored when `action` is provided. */
  onRetry?: () => void
  action?: ReactNode
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description,
  error,
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  const resolvedDescription =
    description ??
    error?.message ??
    'An unexpected error occurred. Please try again.'

  const resolvedAction =
    action ??
    (onRetry ? (
      <Button onClick={onRetry} variant="outline">
        Try Again
      </Button>
    ) : null)

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[400px] p-8 text-center',
        className
      )}
    >
      <div className="max-w-md space-y-2 flex flex-col items-center justify-center">
        <IconWrapper icon={AlertCircle} iconClassName="text-destructive" />
        <h2 className="font-medium text-sm text-foreground text-center">
          {title}
        </h2>
        {resolvedDescription && (
          <p className="text-sm text-muted-foreground text-center">
            {resolvedDescription}
          </p>
        )}
        {resolvedAction && (
          <div className="pt-2 flex items-center justify-center gap-4">
            {resolvedAction}
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorState
