import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { ModelOption } from "./types"

export interface UseModelSelectorStateReturn {
  open: boolean
  hoveredModelId: string | null
  focusedIndex: number
  listRef: React.RefObject<HTMLDivElement | null>
  sortedModels: ModelOption[]
  selectedModelData: ModelOption | undefined
  disabled: boolean
  placeholder: string
  previewModel: ModelOption | undefined
  handleRowMouseEnter: (modelId: string) => void
  handleRowMouseLeave: () => void
  handleClearRowMouseEnter: () => void
  handleDetailsMouseEnter: () => void
  handleDetailsMouseLeave: () => void
  handleKeyDown: (e: React.KeyboardEvent) => void
  selectModel: (modelId: string) => void
  handleOpenChange: (nextOpen: boolean) => void
}

export function useModelSelectorState(
  options: ModelOption[],
  value: string,
  onValueChange: (id: string) => void,
  loading: boolean,
  error: boolean,
  allowClear: boolean,
  isFavorite: (id: string) => boolean
): UseModelSelectorStateReturn {
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
    if (loading) return "Loading models..."
    if (error) return "Error loading models"
    if (options.length === 0) return "No models available"
    return "Select a model"
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
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setFocusedIndex((prev) => (prev < totalItemCount - 1 ? prev + 1 : prev))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0))
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (focusedIndex >= 0) {
          if (allowClear && focusedIndex === 0) {
            onValueChange("")
          } else {
            const modelIndex = allowClear ? focusedIndex - 1 : focusedIndex
            if (sortedModels[modelIndex]) {
              onValueChange(sortedModels[modelIndex].id)
            }
          }
          setOpen(false)
        }
      } else if (e.key === "Escape") {
        setOpen(false)
      } else if (e.key === "Home") {
        e.preventDefault()
        setFocusedIndex(0)
      } else if (e.key === "End") {
        e.preventDefault()
        setFocusedIndex(totalItemCount - 1)
      }
    },
    [
      open,
      focusedIndex,
      totalItemCount,
      allowClear,
      sortedModels,
      onValueChange,
    ]
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
      const items = listRef.current.querySelectorAll("[data-model-item]")
      items[focusedIndex]?.scrollIntoView({ block: "nearest" })
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
