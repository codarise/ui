import { cn } from '@/lib/utils';

interface StepperStep {
  id: string;
  label: string;
}

interface StepperProps {
  steps: readonly StepperStep[];
  currentIndex: number;
  className?: string;
}

export function Stepper({ steps, currentIndex, className }: StepperProps) {
  const currentStep = steps[currentIndex] ?? steps[0];

  return (
    <div
      className={cn(
        'flex min-w-0 items-center gap-2 text-xs text-muted-foreground',
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        {steps.map((step, index) => (
          <span
            key={step.id}
            className={cn(
              'h-1.5 rounded-full transition-all',
              index === currentIndex
                ? 'w-8 bg-primary'
                : index < currentIndex
                  ? 'w-5 bg-primary/60'
                  : 'w-5 bg-muted'
            )}
          />
        ))}
      </div>
      {currentStep && (
        <span className="truncate">
          {currentIndex + 1}/{steps.length} {currentStep.label}
        </span>
      )}
    </div>
  );
}
