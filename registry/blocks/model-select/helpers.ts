import { getModelColorByName } from "../../lib/model-colors"
import type { ModelOption } from "./types"

export function formatParameterCount(count?: number | null): string {
  if (!count) return "N/A"
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`
  return `${(count / 1_000).toFixed(1)}K`
}

export function formatCurrency(value: number, currency = "EUR"): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(value)
  } catch {
    return `${value}`
  }
}

export function getModelColor(option: ModelOption): string {
  return option.color ?? getModelColorByName(option.id, "hex")
}

export function getModelLabel(option: ModelOption): string {
  return option.label ?? option.id
}
