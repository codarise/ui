import { cn } from '@/lib/utils';

interface GlowBackdropProps {
  glowClassName?: string;
  className?: string;
}

function GlowBackdrop({ glowClassName, className }: GlowBackdropProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className
      )}
    >
      <div className="absolute inset-0 bg-background" />
      {glowClassName && (
        <div
          className={cn(
            'absolute left-1/2 top-1/2 h-128 w-128 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl',
            glowClassName
          )}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background to-background" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-card/60 to-transparent" />
    </div>
  );
}

export { GlowBackdrop };
