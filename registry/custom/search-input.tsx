import { Search } from 'lucide-react';
import * as React from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export type SearchInputProps = Omit<
  React.ComponentProps<typeof Input>,
  'onChange' | 'value' | 'className'
> & {
  value: string;
  onChange: (value: string) => void;
  /** Classes for the outer wrapper (width, flex, etc.) */
  className?: string;
  /** Merged with default left padding for the search icon */
  inputClassName?: string;
};

export function SearchInput({
  className,
  value,
  onChange,
  inputClassName,
  ...inputRest
}: SearchInputProps) {
  return (
    <div className={cn('relative', className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn('pl-9', inputClassName)}
        {...inputRest}
      />
    </div>
  );
}
