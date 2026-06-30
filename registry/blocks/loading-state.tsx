import { Spinner } from '../ui/spinner'
import { cn } from '../lib/utils'

interface LoadingStateProps {
  title?: string
  description?: string
  className?: string
}

export function LoadingState({ title, description, className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center min-h-[400px] p-8 text-center',
        className
      )}
    >
      <div className="max-w-md space-y-6">
        <div className="flex flex-col items-center justify-center gap-2">
          <Spinner />
          <div className="space-y-2">
            <h2 className="text-sm font-semibold text-foreground">{title}</h2>
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
