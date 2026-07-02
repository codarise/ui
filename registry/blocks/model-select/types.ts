import type { ElementType } from "react"

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
  size?: "sm" | "md" | "lg"
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
