import type { BubbleProps } from "../ui/bubble"
import { Bubble, BubbleContent, type BubbleContentProps } from "../ui/bubble"

export type ChatBubbleRole = "user" | "assistant" | "system" | "error"

export type ChatBubbleVariant =
  | "default"
  | "secondary"
  | "muted"
  | "tinted"
  | "outline"
  | "ghost"
  | "destructive"

export interface ChatBubbleProps extends Omit<
  BubbleProps,
  "variant" | "align"
> {
  variant?: ChatBubbleVariant
  align?: "start" | "end"
}

export type ChatBubbleContentProps = BubbleContentProps

/**
 * Maps a chat role to the default Bubble variant the design system expects:
 * - assistant → ghost (full-width markdown, no bubble chrome)
 * - user → default (primary bubble, aligned end)
 * - error → destructive
 * - system → muted
 */
export function bubbleVariantForRole(role: ChatBubbleRole): ChatBubbleVariant {
  switch (role) {
    case "user":
      return "muted"
    case "assistant":
      return "ghost"
    case "error":
      return "destructive"
    case "system":
      return "muted"
    default:
      return "muted"
  }
}

export function alignForRole(role: ChatBubbleRole): "start" | "end" {
  return role === "user" ? "end" : "start"
}

export function ChatBubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: ChatBubbleProps) {
  return (
    <Bubble variant={variant} align={align} className={className} {...props} />
  )
}

export function ChatBubbleContent({
  className,
  ...props
}: ChatBubbleContentProps) {
  return <BubbleContent className={className} {...props} />
}
