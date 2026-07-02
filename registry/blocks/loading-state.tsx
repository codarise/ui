import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  title?: string
  description?: string
  className?: string
}

export function LoadingState({
  title,
  description,
  className,
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center p-8 text-center fade-in",
        className
      )}
    >
      <div className="max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center gap-3">
          <Spinner className="size-6 text-muted-foreground" />
          <div className="space-y-1.5">
            {title && (
              <h2 className="text-sm font-semibold text-foreground">{title}</h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingState
