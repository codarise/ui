import {
  BrainCircuit,
  ChevronDown,
  Cpu,
  Database,
  Euro,
  ExternalLink,
  Star,
  Tag,
  Wrench,
} from 'lucide-react'
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from 'react'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { getModelColorByName } from '../lib/model-colors'
import { cn } from '../lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface ModelOption {
  /** Unique identifier — also used as the display name if no `label` is given */
  id: string
  /** Display name (defaults to id) */
  label?: string
  /** Subtitle / description (e.g. family, pipeline tag) */
  description?: string
  /** Hex color override (otherwise auto-derived from id via model-colors) */
  color?: string
  /** Icon component, defaults to BrainCircuit */
  icon?: ElementType<{ className?: string }>
  /** Detail panel: license */
  license?: string
  /** Detail panel: parameter count (formatted as B/M/K) */
  parameterCount?: number
  /** Detail panel: capability badges */
  capabilities?: string[]
  /** Detail panel: feature badges with optional icon */
  features?: { label: string; icon?: ElementType<{ className?: string }> }[]
  /** Detail panel: pricing */
  pricing?: {
    inputPer1m?: number
    outputPer1m?: number
    currency?: string
  }
  /** Detail panel: external link */
  externalUrl?: string
  externalLabel?: string
}

export interface ModelSelectProps {
  /** Selected model id (empty string = cleared) */
  value: string
  /** Called when the user selects a model */
  onValueChange: (modelId: string) => void
  /** Available models */
  options: ModelOption[]
  /** Loading state */
  loading?: boolean
  /** Error state */
  error?: boolean
  /** Show a visible label above the trigger */
  showLabel?: boolean
  /** Trigger size */
  size?: 'sm' | 'md' | 'lg'
  /** Allow clearing the selection (renders a "default/none" option) */
  allowClear?: boolean
  /** Label for the clear option */
  clearLabel?: string
  /** Show the details panel on the right */
  showDetails?: boolean
  /** localStorage key for favorites (set to null to disable favorites) */
  favoritesStorageKey?: string | null
  className?: string
}

// ============================================================================
// Helpers
// ============================================================================

function formatParameterCount(count?: number | null): string {
  if (!count) return 'N/A'
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  return `${(count / 1_000).toFixed(1)}K`
}

function formatCurrency(value: number, currency = 'EUR'): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${value}`
  }
}

function getModelColor(option: ModelOption): string {
  return option.color ?? getModelColorByName(option.id, 'hex')
}

function getModelLabel(option: ModelOption): string {
  return option.label ?? option.id
}

// ============================================================================
// Favorites hook (inlined)
// ============================================================================

function useFavoriteModels(storageKey: string | null) {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    if (!storageKey) return new Set()
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        const parsed = JSON.parse(stored) as string[]
        return new Set(Array.isArray(parsed) ? parsed : [])
      }
    } catch {
      // ignore
    }
    return new Set()
  })

  useEffect(() => {
    if (!storageKey) return
    try {
      localStorage.setItem(storageKey, JSON.stringify([...favorites]))
    } catch {
      // ignore
    }
  }, [favorites, storageKey])

  const toggleFavorite = useCallback((modelId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(modelId)) next.delete(modelId)
      else next.add(modelId)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (modelId: string) => favorites.has(modelId),
    [favorites]
  )

  return { isFavorite, toggleFavorite }
}

// ============================================================================
// Selector state hook (inlined)
// ============================================================================

function useModelSelectorState(
  options: ModelOption[],
  value: string,
  onValueChange: (id: string) => void,
  loading: boolean,
  error: boolean,
  allowClear: boolean,
  isFavorite: (id: string) => boolean
) {
  const [hoveredModelId, setHoveredModelId] = useState<string | null>(null)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [open, setOpen] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const detailsHoveredRef = useRef(false)

  const sortedModels = useMemo(
    () =>
      [...options].sort((a, b) => {
        const aFav = isFavorite(a.id)
        const bFav = isFavorite(b.id)
        if (aFav && !bFav) return -1
        if (!aFav && bFav) return 1
        return a.id.localeCompare(b.id)
      }),
    [options, isFavorite]
  )

  const totalItemCount = sortedModels.length + (allowClear ? 1 : 0)
  const selectedModelData = options.find((m) => m.id === value)
  const disabled = loading || error || options.length === 0

  const placeholder = useMemo(() => {
    if (loading) return 'Loading models...'
    if (error) return 'Error loading models'
    if (options.length === 0) return 'No models available'
    return 'Select a model'
  }, [loading, error, options.length])

  const clearHoverTimer = useCallback(() => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }, [])

  const scheduleHoverClear = useCallback(() => {
    clearHoverTimer()
    hoverTimerRef.current = setTimeout(() => {
      if (!detailsHoveredRef.current) setHoveredModelId(null)
    }, 150)
  }, [clearHoverTimer])

  const handleRowMouseEnter = useCallback(
    (modelId: string) => {
      clearHoverTimer()
      setHoveredModelId(modelId)
    },
    [clearHoverTimer]
  )

  const handleRowMouseLeave = useCallback(() => {
    scheduleHoverClear()
  }, [scheduleHoverClear])

  const handleClearRowMouseEnter = useCallback(() => {
    clearHoverTimer()
    setHoveredModelId(null)
  }, [clearHoverTimer])

  const handleDetailsMouseEnter = useCallback(() => {
    clearHoverTimer()
    detailsHoveredRef.current = true
  }, [clearHoverTimer])

  const handleDetailsMouseLeave = useCallback(() => {
    detailsHoveredRef.current = false
    scheduleHoverClear()
  }, [scheduleHoverClear])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!open) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((prev) => (prev < totalItemCount - 1 ? prev + 1 : prev))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (focusedIndex >= 0) {
          if (allowClear && focusedIndex === 0) {
            onValueChange('')
          } else {
            const modelIndex = allowClear ? focusedIndex - 1 : focusedIndex
            if (sortedModels[modelIndex]) {
              onValueChange(sortedModels[modelIndex].id)
            }
          }
          setOpen(false)
        }
      }
    },
    [open, focusedIndex, totalItemCount, allowClear, sortedModels, onValueChange]
  )

  const selectModel = useCallback(
    (modelId: string) => {
      onValueChange(modelId)
      setOpen(false)
    },
    [onValueChange]
  )

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen)
      if (!nextOpen) {
        clearHoverTimer()
        setHoveredModelId(null)
        setFocusedIndex(-1)
        detailsHoveredRef.current = false
      }
    },
    [clearHoverTimer]
  )

  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-model-item]')
      items[focusedIndex]?.scrollIntoView({ block: 'nearest' })
    }
  }, [focusedIndex])

  useEffect(() => clearHoverTimer, [clearHoverTimer])

  const focusedModelId = useMemo(() => {
    if (focusedIndex < 0) return null
    if (allowClear && focusedIndex === 0) return null
    const modelIndex = allowClear ? focusedIndex - 1 : focusedIndex
    return sortedModels[modelIndex]?.id ?? null
  }, [focusedIndex, allowClear, sortedModels])

  const previewModelId = hoveredModelId ?? focusedModelId ?? value
  const previewModel = previewModelId
    ? options.find((m) => m.id === previewModelId)
    : undefined

  return {
    open,
    hoveredModelId,
    focusedIndex,
    listRef,
    sortedModels,
    selectedModelData,
    disabled,
    placeholder,
    previewModel,
    handleRowMouseEnter,
    handleRowMouseLeave,
    handleClearRowMouseEnter,
    handleDetailsMouseEnter,
    handleDetailsMouseLeave,
    handleKeyDown,
    selectModel,
    handleOpenChange,
  }
}

// ============================================================================
// Trigger
// ============================================================================

function FavoriteStarButton({
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
    if (e.key === 'Enter' || e.key === ' ') {
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
            'inline-flex shrink-0 cursor-pointer items-center justify-center rounded p-0.5 transition-colors hover:bg-muted/80',
            favorited && 'text-amber-400'
          )}
        >
          <Star
            className={cn(isLarge ? 'h-5 w-5' : 'h-4 w-4', favorited && 'fill-amber-400')}
          />
        </span>
      </TooltipTrigger>
      <TooltipContent>
        {favorited ? 'Remove from favorites' : 'Add to favorites'}
      </TooltipContent>
    </Tooltip>
  )
}

function SelectedModelContent({
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
        'flex min-w-0 flex-1 items-center',
        isLarge ? 'gap-3' : 'gap-2'
      )}
    >
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded',
          isSmall ? 'size-5' : isLarge ? 'size-7' : 'size-6'
        )}
        style={{
          background: `linear-gradient(135deg, ${modelColor}33 0%, ${modelColor}10 100%)`,
          color: modelColor,
        }}
      >
        <Icon className={cn(isSmall ? 'size-3' : isLarge ? 'size-4' : 'size-3.5')} />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-start">
        <span
          className={cn(
            'w-full truncate text-left font-medium leading-tight',
            isLarge && 'text-base'
          )}
        >
          {getModelLabel(option)}
        </span>
        {!isSmall && option.description && (
          <span
            className={cn(
              'w-full truncate text-left leading-tight text-muted-foreground',
              isLarge ? 'text-xs' : 'text-[10px]'
            )}
          >
            {option.description}
          </span>
        )}
      </div>
    </div>
  )
}

function ClearOptionContent({
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
        'flex min-w-0 flex-1 items-center',
        isLarge ? 'gap-3' : 'gap-2'
      )}
    >
      <div
        className={cn(
          'flex flex-shrink-0 items-center justify-center rounded bg-muted text-muted-foreground',
          isSmall ? 'size-5' : isLarge ? 'size-7' : 'size-6'
        )}
      >
        <BrainCircuit
          className={cn(isSmall ? 'size-3' : isLarge ? 'size-4' : 'size-3.5')}
        />
      </div>
      <span
        className={cn(
          'min-w-0 flex-1 truncate text-left font-medium',
          isLarge && 'text-base'
        )}
      >
        {clearLabel}
      </span>
    </div>
  )
}

// ============================================================================
// Model List
// ============================================================================

function ModelList({
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
}: {
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
}) {
  return (
    <div
      ref={listRef}
      className="min-w-0 flex-1 overflow-y-auto py-1"
      onKeyDown={onKeyDown}
      role="listbox"
    >
      {allowClear && (
        <div
          data-model-item
          role="option"
          aria-selected={!value}
          tabIndex={focusedIndex === 0 ? 0 : -1}
          className={cn(
            'mx-1 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors',
            !value ? 'bg-accent text-accent-foreground' : 'hover:bg-muted/60',
            focusedIndex === 0 && 'bg-accent/50'
          )}
          onClick={() => onSelect('')}
          onMouseEnter={onClearRowMouseEnter}
        >
          <div className="flex size-8 flex-shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
            <BrainCircuit className="size-4" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <span className="truncate text-sm font-medium">{clearLabel}</span>
          </div>
        </div>
      )}
      {options.map((option, index) => {
        const modelColor = getModelColor(option)
        const Icon = option.icon ?? BrainCircuit
        const itemIndex = allowClear ? index + 1 : index
        return (
          <div
            key={option.id}
            data-model-item
            role="option"
            aria-selected={value === option.id}
            tabIndex={focusedIndex === itemIndex ? 0 : -1}
            className={cn(
              'mx-1 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors',
              value === option.id
                ? 'bg-accent text-accent-foreground'
                : 'hover:bg-muted/60',
              hoveredModelId === option.id && value !== option.id && 'bg-muted/40',
              focusedIndex === itemIndex && 'ring-1 ring-ring/30'
            )}
            onClick={() => onSelect(option.id)}
            onMouseEnter={() => onRowMouseEnter(option.id)}
            onMouseLeave={onRowMouseLeave}
            onFocus={() => onRowMouseEnter(option.id)}
          >
            <div
              className="flex size-8 flex-shrink-0 items-center justify-center rounded-md"
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
            {isFavorite(option.id) && (
              <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-400" />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// Details Panel
// ============================================================================

function ModelDetailsPanel({
  option,
  isFavorite,
  onToggleFavorite,
  className,
}: {
  option: ModelOption
  isFavorite?: boolean
  onToggleFavorite?: (modelId: string) => void
  className?: string
}) {
  const modelColor = getModelColor(option)
  const Icon = option.icon ?? BrainCircuit
  const pricing = option.pricing
  const hasPricing =
    pricing && (pricing.inputPer1m !== undefined || pricing.outputPer1m !== undefined)
  const isFree =
    hasPricing && pricing.inputPer1m === 0 && pricing.outputPer1m === 0

  return (
    <div className={cn('flex h-full flex-col', className)}>
      <div
        className="flex items-start gap-3 border-b p-4"
        style={{
          background: `linear-gradient(135deg, ${modelColor}15 0%, transparent 100%)`,
        }}
      >
        <div
          className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${modelColor}33 0%, ${modelColor}10 100%)`,
            color: modelColor,
          }}
        >
          <Icon className="size-5" />
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold" title={option.id}>
              {getModelLabel(option)}
            </h4>
            {onToggleFavorite && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onToggleFavorite(option.id)}
                className="size-7 shrink-0 rounded transition-colors hover:bg-muted/80"
              >
                <Star
                  className={cn(
                    'h-4 w-4',
                    isFavorite
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-muted-foreground hover:text-amber-400/70'
                  )}
                />
              </Button>
            )}
          </div>
          {option.description && (
            <p className="mt-0.5 text-xs font-medium text-muted-foreground">
              {option.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        <div className="grid gap-3 text-sm">
          {option.parameterCount !== undefined && (
            <div className="flex items-start gap-2">
              <Database className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground">Parameters</p>
                <p>{formatParameterCount(option.parameterCount)}</p>
              </div>
            </div>
          )}

          {option.license && (
            <div className="flex items-start gap-2">
              <Tag className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">License</p>
                <Badge variant="outline">{option.license}</Badge>
              </div>
            </div>
          )}

          {option.capabilities && option.capabilities.length > 0 && (
            <div className="flex items-start gap-2">
              <Cpu className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">
                  Capabilities
                </p>
                <div className="flex flex-wrap gap-1">
                  {option.capabilities.map((cap, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hasPricing && (
            <div className="flex items-start gap-2">
              <Euro className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Pricing</p>
                {isFree ? (
                  <Badge variant="secondary">Free</Badge>
                ) : (
                  <div className="space-y-0.5">
                    {pricing.inputPer1m !== undefined && (
                      <p className="text-xs">
                        Input: {formatCurrency(pricing.inputPer1m, pricing.currency)}/1M
                        tokens
                      </p>
                    )}
                    {pricing.outputPer1m !== undefined && (
                      <p className="text-xs">
                        Output:{' '}
                        {formatCurrency(pricing.outputPer1m, pricing.currency)}/1M tokens
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {option.features && option.features.length > 0 && (
            <div className="flex items-start gap-2">
              <Wrench className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
              <div>
                <p className="mb-1 text-xs font-medium text-muted-foreground">Features</p>
                <div className="flex flex-wrap gap-1">
                  {option.features.map((feat, i) => {
                    const FeatIcon = feat.icon
                    return (
                      <Badge
                        key={i}
                        variant="outline"
                        className="gap-1 px-1.5 text-xs"
                      >
                        {FeatIcon && <FeatIcon className="size-3" />}
                        {feat.label}
                      </Badge>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {option.externalUrl && (
            <div className="border-t pt-2">
              <p className="mb-1 text-xs font-medium text-muted-foreground">
                {option.externalLabel ?? 'External'}
              </p>
              <a
                href={option.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                {option.externalUrl.replace(/^https?:\/\//, '')}
                <ExternalLink className="size-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Main component
// ============================================================================

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
  size = 'md',
  allowClear = false,
  clearLabel = 'Default / none',
  showDetails = true,
  favoritesStorageKey = 'model-select-favorites',
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

  const isSmall = size === 'sm'
  const isLarge = size === 'lg'

  return (
    <div className={cn('flex items-center gap-2', isLarge && 'w-full', className)}>
      <div className="w-full space-y-2">
        <Label
          htmlFor="model-select"
          className={cn('text-xs text-muted-foreground', !showLabel && 'sr-only')}
        >
          Select Model
        </Label>
        <div className="flex items-center">
          <Popover open={state.open} onOpenChange={state.handleOpenChange}>
            <PopoverTrigger asChild>
              <Button
                id="model-select"
                variant="ghost"
                role="combobox"
                disabled={state.disabled}
                className={cn(
                  'justify-between gap-1',
                  isSmall && 'h-8 max-w-48 gap-1 px-2 text-xs',
                  size === 'md' && 'h-12 w-66 gap-2 px-3',
                  isLarge &&
                    'h-18 w-full gap-3 border border-border bg-background px-4',
                  !value && 'text-muted-foreground'
                )}
              >
                {state.selectedModelData && (
                  <FavoriteStarButton
                    modelId={value}
                    isFavorite={isFavorite}
                    toggleFavorite={toggleFavorite}
                    isLarge={isLarge}
                  />
                )}
                {state.selectedModelData ? (
                  <SelectedModelContent
                    option={state.selectedModelData}
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
                  <span className="min-w-0 flex-1 truncate text-left">
                    {state.placeholder}
                  </span>
                )}
                <ChevronDown
                  className={cn(
                    'shrink-0 justify-end opacity-50',
                    isLarge ? 'h-5 w-5' : 'h-4 w-4'
                  )}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)] min-w-96 p-0 md:min-w-158"
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="flex">
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
                    className="m-1 w-1/2 shrink-0 overflow-x-hidden rounded-md"
                    onMouseEnter={state.handleDetailsMouseEnter}
                    onMouseLeave={state.handleDetailsMouseLeave}
                  >
                    {state.previewModel && (
                      <ModelDetailsPanel
                        option={state.previewModel}
                        isFavorite={isFavorite(state.previewModel.id)}
                        onToggleFavorite={toggleFavorite}
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
