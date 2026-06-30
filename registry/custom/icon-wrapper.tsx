import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const iconWrapperVariants = cva(
  'flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "bg-gradient-to-t shadow-sm from-accent/90 to-card dark:from-accent/20 dark:to-primary/5 border-t border-accent/5 dark:border-primary/10 text-foreground flex size-10 shrink-0 items-center justify-center rounded-md [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: 'icon',
    },
  }
);

interface IconWrapperProps extends VariantProps<typeof iconWrapperVariants> {
  icon?: React.ElementType;
  iconClassName?: string;
  className?: string;
}

export function IconWrapper({
  icon: Icon,
  iconClassName,
  className,
  variant = 'icon',
}: IconWrapperProps) {
  if (!Icon) return null;
  return (
    <div className={cn(iconWrapperVariants({ variant }), className)}>
      <Icon
        className={
          iconClassName ?? 'size-5 text-muted-foreground drop-shadow-sm'
        }
      />
    </div>
  );
}
