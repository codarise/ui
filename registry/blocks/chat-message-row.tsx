import type { ReactNode } from "react"
import { memo } from "react"

import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message"

export interface ChatMessageRowProps {
  align?: "start" | "end"
  /** Optional avatar {src, fallback} rendered via MessageAvatar. */
  avatar?: { src?: string; fallback?: ReactNode }
  header?: ReactNode
  /** Footer timestamp string, rendered muted beside actions. */
  timestamp?: ReactNode
  /** Extra action nodes (copy/retry/edit) rendered in the footer. */
  actions?: ReactNode
  /** The bubble body (ChatBubble + ChatBubbleContent). */
  children: ReactNode
  className?: string
  contentClassName?: string
}

/**
 * Shared chat row shell: aligns avatar + header + content + footer.
 * Features map their message type to this — no shared message model required.
 */
function ChatMessageRowComponent({
  align = "start",
  avatar,
  header,
  timestamp,
  actions,
  children,
  className,
  contentClassName,
}: ChatMessageRowProps) {
  return (
    <Message align={align} className={className}>
      {avatar && (
        <MessageAvatar>
          {avatar.src ? (
            <img
              src={avatar.src}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            avatar.fallback
          )}
        </MessageAvatar>
      )}
      <MessageContent className={contentClassName}>
        {header && <MessageHeader>{header}</MessageHeader>}
        {children}
        {(actions || timestamp) && (
          <MessageFooter>
            {actions}
            {timestamp && <span className="ml-1">{timestamp}</span>}
          </MessageFooter>
        )}
      </MessageContent>
    </Message>
  )
}

export const ChatMessageRow = memo(ChatMessageRowComponent)
