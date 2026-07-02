import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import type { ModelOption, ModelSelectProps } from "./model-select/types"
import { useFavoriteModels } from "./model-select/use-favorites"
import { useModelSelectorState } from "./model-select/use-model-selector"
import { ModelDetailsPanel } from "./model-select/details-panel"
import { ModelList } from "./model-select/model-list"
import { ModelSelectTrigger } from "./model-select/trigger"

export type { ModelOption, ModelSelectProps }

/**
 * A model selector with popover list, keyboard navigation, favorites (localStorage),
 * and optional details panel. Generic — uses `ModelOption` instead of a domain type.
 *
 * Color is auto-derived from the model id via `model-colors` or can be overridden per option.
 * Favorites are sorted to the top of the list.
 */
export function ModelSelect({
  value,
  onValueChange,
  options,
  loading = false,
  error = false,
  showLabel = false,
  size = "md",
  allowClear = false,
  clearLabel = "Default / none",
  showDetails = true,
  favoritesStorageKey = "model-select-favorites",
  className,
}: ModelSelectProps) {
  const { isFavorite, toggleFavorite } = useFavoriteModels(favoritesStorageKey)
  const state = useModelSelectorState(
    options,
    value,
    onValueChange,
    loading,
    error,
    allowClear,
    isFavorite
  )

  const isSmall = size === "sm"
  const isLarge = size === "lg"

  return (
    <div
      className={cn("flex items-center gap-2", isLarge && "w-full", className)}
    >
      <div className="w-full space-y-2">
        <Label
          htmlFor="model-select"
          className={cn(
            "text-xs text-muted-foreground",
            !showLabel && "sr-only"
          )}
        >
          Select Model
        </Label>
        <div className="flex items-center">
          <Popover open={state.open} onOpenChange={state.handleOpenChange}>
            <PopoverTrigger asChild>
              <ModelSelectTrigger
                value={value}
                placeholder={state.placeholder}
                selectedModelData={state.selectedModelData}
                allowClear={allowClear}
                clearLabel={clearLabel}
                isSmall={isSmall}
                isLarge={isLarge}
                disabled={state.disabled}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
              />
            </PopoverTrigger>
            <PopoverContent
              className={cn(
                "w-[var(--radix-popover-trigger-width)] overflow-hidden p-0",
                showDetails ? "min-w-80 md:min-w-96" : "min-w-72"
              )}
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="flex items-stretch">
                <ModelList
                  options={state.sortedModels}
                  value={value}
                  allowClear={allowClear}
                  clearLabel={clearLabel}
                  focusedIndex={state.focusedIndex}
                  hoveredModelId={state.hoveredModelId}
                  isFavorite={isFavorite}
                  listRef={state.listRef}
                  onSelect={state.selectModel}
                  onRowMouseEnter={state.handleRowMouseEnter}
                  onRowMouseLeave={state.handleRowMouseLeave}
                  onClearRowMouseEnter={state.handleClearRowMouseEnter}
                  onKeyDown={state.handleKeyDown}
                />
                {showDetails && (
                  <div
                    className="w-1/2 shrink-0 border-l bg-muted/30"
                    onMouseEnter={state.handleDetailsMouseEnter}
                    onMouseLeave={state.handleDetailsMouseLeave}
                  >
                    {state.previewModel && (
                      <ModelDetailsPanel
                        key={state.previewModel.id}
                        option={state.previewModel}
                        isFavorite={isFavorite(state.previewModel.id)}
                        onToggleFavorite={toggleFavorite}
                        className="animate-in duration-200 zoom-in-95 fade-in"
                      />
                    )}
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
