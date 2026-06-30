import { Check, Copy } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type MouseEvent,
  type ReactNode,
} from 'react';

import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

async function copyTextToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

export type CopyButtonProps = Omit<
  ComponentProps<typeof Button>,
  'onClick' | 'children'
> & {
  /** Text to copy, or a getter for dynamic/async content. */
  text: string | (() => string | Promise<string>);
  /** Called after a successful copy. */
  onCopied?: () => void;
  /** Called when copy fails. */
  onCopyError?: (error: unknown) => void;
  /** How long to show the success state (ms). Default 2000. */
  copiedDurationMs?: number;
  /** Applied to the default Copy / Check icons (when `children` is not used). */
  iconClassName?: string;
  /** Merged into `className` while the success state is visible. */
  copiedClassName?: string;
  /**
   * Custom content. If omitted, renders Copy / Check icons only.
   */
  children?: (copied: boolean) => ReactNode;
};

export function CopyButton({
  text,
  onCopied,
  onCopyError,
  copiedDurationMs = 2000,
  iconClassName = 'size-3.5',
  copiedClassName,
  className,
  children,
  disabled,
  title = 'Copy',
  type = 'button',
  ...buttonProps
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    []
  );

  const resolveText = useCallback(async () => {
    return typeof text === 'function' ? await text() : text;
  }, [text]);

  const handleClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      const value = await resolveText();
      await copyTextToClipboard(value);
      setCopied(true);
      onCopied?.();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), copiedDurationMs);
    } catch (err) {
      onCopyError?.(err);
    }
  };

  const content = children ? (
    children(copied)
  ) : copied ? (
    <Check className={cn(iconClassName)} aria-hidden />
  ) : (
    <Copy className={cn(iconClassName)} aria-hidden />
  );

  return (
    <Button
      type={type}
      title={title}
      aria-label={title}
      disabled={disabled}
      className={cn(className, copied && copiedClassName)}
      onClick={handleClick}
      {...buttonProps}
    >
      {content}
    </Button>
  );
}
