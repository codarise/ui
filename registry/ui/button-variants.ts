import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex leading-none cursor-pointer items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-t from-foreground to-foreground/85 text-background hover:bg-foreground/90 border border-transparent shadow-inner focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        destructive:
          "text-destructive dark:text-destructive bg-destructive/10 hover:bg-destructive/20 shadow-xs dark:bg-destructive/10 dark:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 border border-destructive/20 dark:border-destructive/20",
        outline:
          "border border-accent hover:border-accent/50 backdrop-blur-sm",
        secondary:
          "border border-accent hover:border-accent/50 dark:hover:border-accent/50 bg-gradient-to-t from-muted to-muted/80 hover:bg-muted/50 hover:text-accent-foreground shadow-xs",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:pl-3 rounded-md",
        sm: "h-9 rounded-md gap-1.5 px-3 has-[>svg]:pl-2.5",
        lg: "h-11 rounded-lg px-8 has-[>svg]:pl-4",
        icon: "size-9 rounded-md",
        "icon-lg": "size-10 rounded-md",
        "icon-sm": "size-8 rounded-md",
        "icon-xs": "size-6 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
