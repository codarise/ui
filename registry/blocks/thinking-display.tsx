import { useEffect, useRef, useState } from "react"

import { CopyButton } from "../custom/copy-button"
import { TextShimmer } from "../custom/text-shimmer"
import { cn } from "../lib/utils"

export interface ThinkingDisplayProps {
  /** One or more thinking blocks (joined with a blank line). */
  thinkingBlocks?: string[]
  /** Single-block shorthand (e.g. agent-mode chat). Ignored when `thinkingBlocks` is non-empty. */
  content?: string
  /** Drives the open/close lifecycle (open while true, auto-collapse when it ends). */
  isStreaming?: boolean
  /**
   * Whether thinking is *actively* being appended right now. Drives the
   * shimmering "Thinking" label and only that — so interleaved tool/text steps
   * never collapse the panel. Defaults to `isStreaming`.
   */
  active?: boolean
  defaultOpen?: boolean
  /**
   * While streaming: open unless the user collapsed.
   * When streaming ends: collapse unless the user expanded.
   */
  autoManageOpen?: boolean
  className?: string
}

function resolveBlocks(
  thinkingBlocks: string[] | undefined,
  content: string | undefined
): string[] {
  if (thinkingBlocks && thinkingBlocks.length > 0) {
    return thinkingBlocks.filter((b) => b.trim().length > 0)
  }
  const trimmed = content?.trim()
  return trimmed ? [trimmed] : []
}

export function ThinkingDisplay({
  thinkingBlocks,
  content,
  isStreaming = false,
  active,
  defaultOpen = false,
  autoManageOpen = false,
  className,
}: ThinkingDisplayProps) {
  const activeThinking = active ?? isStreaming
  const blocks = resolveBlocks(thinkingBlocks, content)
  const [isOpen, setIsOpen] = useState(defaultOpen || isStreaming)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isScrolledDown, setIsScrolledDown] = useState(false)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const wasStreamingRef = useRef(isStreaming)
  const userToggledRef = useRef(false)

  const combinedContent =
    blocks.join("\n\n") || (isStreaming ? "Thinking…" : "")

  useEffect(() => {
    const started = isStreaming && !wasStreamingRef.current
    const ended = !isStreaming && wasStreamingRef.current
    wasStreamingRef.current = isStreaming
    if (userToggledRef.current) return
    if (started) setIsOpen(true)
    else if (ended && autoManageOpen) setIsOpen(false)
  }, [isStreaming, autoManageOpen])

  useEffect(() => {
    if (contentRef.current && isNearBottom) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [combinedContent, isNearBottom])

  if (blocks.length === 0 && !isStreaming) {
    return null
  }

  const showOpen = isOpen

  const handleToggle = () => {
    userToggledRef.current = true
    setIsOpen((open) => !open)
  }

  return (
    <div className={cn("mb-2 flex-1", className)}>
      <div className="group cursor-pointer">
        <div
          role="button"
          tabIndex={0}
          className="flex cursor-pointer select-none items-center justify-between opacity-70 group-hover:opacity-100"
          onClick={handleToggle}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleToggle()
            }
          }}
          aria-expanded={showOpen}
        >
          <div className="flex items-center gap-2">
            <TextShimmer
              shimmer={activeThinking}
              className="text-sm font-medium"
              variant={activeThinking ? "purple" : "default"}
            >
              {activeThinking ? "Thinking" : "Thoughts"}
            </TextShimmer>
          </div>
          <CopyButton
            text={() => blocks.join("\n\n")}
            variant="ghost"
            size="sm"
            className="h-7 w-7 opacity-0 group-hover:opacity-100"
            disabled={blocks.length === 0}
            title="Copy thinking"
          />
        </div>
        {showOpen && (
          <div
            ref={contentRef}
            onScroll={(e) => {
              const el = e.currentTarget
              setIsScrolledDown(el.scrollTop > 0)
              setIsNearBottom(
                el.scrollHeight - el.scrollTop - el.clientHeight < 40
              )
            }}
            className="max-h-80 overflow-y-auto py-3 text-sm prose prose-sm dark:prose-invert max-w-none text-muted-foreground [&::-webkit-scrollbar]:hidden"
            style={{
              ...(isScrolledDown
                ? {
                    maskImage:
                      "linear-gradient(to bottom, transparent 5%, black 36px)",
                  }
                : {}),
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <div className="whitespace-pre-wrap">{combinedContent}</div>
          </div>
        )}
      </div>
    </div>
  )
}
