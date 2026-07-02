import { useCallback, useEffect, useState } from "react"

export interface UseFavoriteModelsReturn {
  isFavorite: (modelId: string) => boolean
  toggleFavorite: (modelId: string) => void
}

export function useFavoriteModels(
  storageKey: string | null
): UseFavoriteModelsReturn {
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
