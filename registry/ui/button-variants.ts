import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 text-sm leading-none font-medium whitespace-nowrap transition-all outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border border-transparent bg-gradient-to-t from-foreground to-foreground/85 text-background shadow-inner hover:bg-foreground/90 focus-visible:ring-[3px] focus-visible:ring-ring/50",
        destructive:
          "border border-destructive/20 bg-destructive/10 text-destructive shadow-xs hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:border-destructive/20 dark:bg-destructive/10 dark:text-destructive dark:hover:bg-destructive/20 dark:focus-visible:ring-destructive/40",
        outline: "border border-accent backdrop-blur-sm hover:border-accent/50",
        secondary:
          "border border-accent bg-gradient-to-t from-muted to-muted/80 shadow-xs hover:border-accent/50 hover:bg-muted/50 hover:text-accent-foreground dark:hover:border-accent/50",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 rounded-md px-4 py-2 has-[>svg]:pl-3",
        sm: "h-9 gap-1.5 rounded-md px-3 has-[>svg]:pl-2.5",
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
