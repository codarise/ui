import { AlertCircle } from "lucide-react"
import type { ReactNode } from "react"

import { IconWrapper } from "@/components/ui/icon-wrapper"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
  title = "Something went wrong",
  description,
  error,
  onRetry,
  action,
  className,
}: ErrorStateProps) {
  const resolvedDescription =
    description ??
    error?.message ??
    "An unexpected error occurred. Please try again."

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
        "flex min-h-[400px] flex-col items-center justify-center p-8 text-center fade-in",
        className
      )}
    >
      <div className="flex max-w-md flex-col items-center justify-center space-y-3">
        <IconWrapper
          icon={AlertCircle}
          iconClassName="text-destructive size-5"
        />
        <h2 className="text-center text-sm font-medium text-foreground">
          {title}
        </h2>
        {resolvedDescription && (
          <p className="text-center text-sm text-muted-foreground">
            {resolvedDescription}
          </p>
        )}
        {resolvedAction && (
          <div className="flex items-center justify-center gap-4 pt-3">
            {resolvedAction}
          </div>
        )}
      </div>
    </div>
  )
}

export default ErrorState
