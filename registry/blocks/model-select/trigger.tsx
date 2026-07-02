import { BrainCircuit, ChevronDown, Star } from "lucide-react"

import { Button } from "../../ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip"
import { cn } from "../../lib/utils"
import { getModelColor, getModelLabel } from "./helpers"
import type { ModelOption } from "./types"

export function FavoriteStarButton({
  modelId,
  isFavorite,
  toggleFavorite,
  isLarge,
}: {
  modelId: string
  isFavorite: (modelId: string) => boolean
  toggleFavorite: (modelId: string) => void
  isLarge: boolean
}) {
  const favorited = isFavorite(modelId)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    toggleFavorite(modelId)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation()
      e.preventDefault()
      toggleFavorite(modelId)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          onKeyDown={handleKeyDown}
          className={cn(
            "inline-flex shrink-0 cursor-pointer items-center justify-center rounded p-0.5 transition-all duration-150 hover:scale-105 hover:bg-muted/80",
            favorited && "text-amber-400"
          )}
        >
          <Star
            className={cn(
              isLarge ? "size-5" : "size-4",
              favorited && "fill-amber-400",
              "transition-transform duration-150"
            )}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {favorited ? "Remove from favorites" : "Add to favorites"}
      </TooltipContent>
    </Tooltip>
  )
}

export function SelectedModelContent({
  option,
  isSmall,
  isLarge,
}: {
  option: ModelOption
  isSmall: boolean
  isLarge: boolean
}) {
  const modelColor = getModelColor(option)
  const Icon = option.icon ?? BrainCircuit

  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center",
        isLarge ? "gap-3" : "gap-2"
      )}
    >
      <div
        className={cn(
          "flex flex-shrink-0 items-center justify-center rounded transition-colors",
          isSmall ? "size-5" : isLarge ? "size-7" : "size-6"
        )}
        style={{
          background: `linear-gradient(135deg, ${modelColor}33 0%, ${modelColor}10 100%)`,
          color: modelColor,
        }}
      >
        <Icon
          className={cn(isSmall ? "size-3" : isLarge ? "size-4" : "size-3.5")}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start">
        <span
          className={cn(
            "w-full truncate text-left leading-tight font-medium",
            isLarge && "text-base"
          )}
        >
          {getModelLabel(option)}
        </span>
        {!isSmall && option.description && (
          <span
            className={cn(
              "w-full truncate text-left leading-tight text-muted-foreground",
              isLarge ? "text-xs" : "text-[10px]"
            )}
          >
            {option.description}
          </span>
        )}
      </div>
    </div>
  )
}

export function ClearOptionContent({
  clearLabel,
  isSmall,
  isLarge,
}: {
  clearLabel: string
  isSmall: boolean
  isLarge: boolean
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 items-center",
        isLarge ? "gap-3" : "gap-2"
      )}
    >
      <div
        className={cn(
          "flex flex-shrink-0 items-center justify-center rounded bg-muted text-muted-foreground",
          isSmall ? "size-5" : isLarge ? "size-7" : "size-6"
        )}
      >
        <BrainCircuit
          className={cn(isSmall ? "size-3" : isLarge ? "size-4" : "size-3.5")}
        />
      </div>
      <span
        className={cn(
          "min-w-0 flex-1 truncate text-left font-medium",
          isLarge && "text-base"
        )}
      >
        {clearLabel}
      </span>
    </div>
  )
}

export function SelectTriggerChevron({ isLarge }: { isLarge: boolean }) {
  return (
    <ChevronDown
      className={cn(
        "shrink-0 justify-end opacity-50 transition-transform duration-200",
        isLarge ? "size-5" : "size-4"
      )}
    />
  )
}

interface ModelSelectTriggerProps {
  value: string
  placeholder: string
  selectedModelData: ModelOption | undefined
  allowClear: boolean
  clearLabel: string
  isSmall: boolean
  isLarge: boolean
  disabled: boolean
  isFavorite: (modelId: string) => boolean
  toggleFavorite: (modelId: string) => void
}

export function ModelSelectTrigger({
  value,
  placeholder,
  selectedModelData,
  allowClear,
  clearLabel,
  isSmall,
  isLarge,
  disabled,
  isFavorite,
  toggleFavorite,
}: ModelSelectTriggerProps) {
  return (
    <Button
      id="model-select"
      variant="ghost"
      role="combobox"
      disabled={disabled}
      className={cn(
        "justify-between gap-1 transition-colors",
        isSmall && "h-8 max-w-48 gap-1 px-2 text-xs",
        !isSmall && !isLarge && "h-12 w-66 gap-2 px-3",
        isLarge &&
          "h-18 w-full gap-3 border border-border bg-background px-4 hover:bg-accent/30",
        !value && "text-muted-foreground"
      )}
    >
      {selectedModelData && (
        <FavoriteStarButton
          modelId={value}
          isFavorite={isFavorite}
          toggleFavorite={toggleFavorite}
          isLarge={isLarge}
        />
      )}
      {selectedModelData ? (
        <SelectedModelContent
          option={selectedModelData}
          isSmall={isSmall}
          isLarge={isLarge}
        />
      ) : allowClear && !value ? (
        <ClearOptionContent
          clearLabel={clearLabel}
          isSmall={isSmall}
          isLarge={isLarge}
        />
      ) : (
        <span className="min-w-0 flex-1 truncate text-left">{placeholder}</span>
      )}
      <SelectTriggerChevron isLarge={isLarge} />
    </Button>
  )
}
