import { BrainCircuit, Star } from "lucide-react"

import { cn } from "../../lib/utils"
import { getModelColor, getModelLabel } from "./helpers"
import type { ModelOption } from "./types"

interface ModelListProps {
  options: ModelOption[]
  value: string
  allowClear: boolean
  clearLabel: string
  focusedIndex: number
  hoveredModelId: string | null
  isFavorite: (modelId: string) => boolean
  listRef: React.RefObject<HTMLDivElement | null>
  onSelect: (modelId: string) => void
  onRowMouseEnter: (modelId: string) => void
  onRowMouseLeave: () => void
  onClearRowMouseEnter: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
}

export function ModelList({
  options,
  value,
  allowClear,
  clearLabel,
  focusedIndex,
  hoveredModelId,
  isFavorite,
  listRef,
  onSelect,
  onRowMouseEnter,
  onRowMouseLeave,
  onClearRowMouseEnter,
  onKeyDown,
}: ModelListProps) {
  return (
    <div
      ref={listRef}
      className="min-w-0 flex-1 self-stretch overflow-y-auto py-1"
      onKeyDown={onKeyDown}
      role="listbox"
    >
      {allowClear && (
        <ClearOption
          clearLabel={clearLabel}
          selected={!value}
          focused={focusedIndex === 0}
          onSelect={() => onSelect("")}
          onMouseEnter={onClearRowMouseEnter}
        />
      )}
      {options.map((option, index) => {
        const itemIndex = allowClear ? index + 1 : index
        return (
          <ModelListItem
            key={option.id}
            option={option}
            selected={value === option.id}
            focused={focusedIndex === itemIndex}
            hovered={hoveredModelId === option.id}
            favorited={isFavorite(option.id)}
            onSelect={() => onSelect(option.id)}
            onMouseEnter={() => onRowMouseEnter(option.id)}
            onMouseLeave={onRowMouseLeave}
          />
        )
      })}
    </div>
  )
}

function ClearOption({
  clearLabel,
  selected,
  focused,
  onSelect,
  onMouseEnter,
}: {
  clearLabel: string
  selected: boolean
  focused: boolean
  onSelect: () => void
  onMouseEnter: () => void
}) {
  return (
    <div
      data-model-item
      role="option"
      aria-selected={selected}
      tabIndex={focused ? 0 : -1}
      className={cn(
        "mx-1 flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-1.5 transition-all duration-150",
        selected ? "bg-accent text-accent-foreground" : "hover:bg-muted/60",
        focused && "bg-accent/40 ring-2 ring-ring/40"
      )}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onMouseEnter={onMouseEnter}
    >
      <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors">
        <BrainCircuit className="size-4" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="truncate text-sm font-medium">{clearLabel}</span>
      </div>
    </div>
  )
}

function ModelListItem({
  option,
  selected,
  focused,
  hovered,
  favorited,
  onSelect,
  onMouseEnter,
  onMouseLeave,
}: {
  option: ModelOption
  selected: boolean
  focused: boolean
  hovered: boolean
  favorited: boolean
  onSelect: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const modelColor = getModelColor(option)
  const Icon = option.icon ?? BrainCircuit

  return (
    <div
      data-model-item
      role="option"
      aria-selected={selected}
      tabIndex={focused ? 0 : -1}
      className={cn(
        "mx-1 flex cursor-pointer items-center gap-3 rounded-md px-2.5 py-1.5 transition-all duration-150",
        selected ? "bg-accent text-accent-foreground" : "hover:bg-muted/60",
        hovered && !selected && "bg-muted/40",
        focused && "bg-accent/40 ring-2 ring-ring/40"
      )}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onMouseEnter}
    >
      <div
        className="flex size-8 flex-shrink-0 items-center justify-center rounded-md transition-transform duration-150"
        style={{
          background: `linear-gradient(135deg, ${modelColor}33 0%, ${modelColor}10 100%)`,
          color: modelColor,
        }}
      >
        <Icon className="size-4" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <span className="truncate text-sm font-medium">
          {getModelLabel(option)}
        </span>
        {option.description && (
          <span className="truncate text-xs text-muted-foreground">
            {option.description}
          </span>
        )}
      </div>
      {favorited && (
        <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400 transition-transform duration-150" />
      )}
    </div>
  )
}
