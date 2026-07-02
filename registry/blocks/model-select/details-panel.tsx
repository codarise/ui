import {
  Cpu,
  Database,
  Euro,
  ExternalLink,
  Star,
  Tag,
  Wrench,
} from "lucide-react"
import type { ElementType, ReactNode } from "react"

import { cn } from "../../lib/utils"
import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"

import {
  formatCurrency,
  formatParameterCount,
  getModelColor,
  getModelLabel,
} from "./helpers"
import type { ModelOption } from "./types"

interface ModelDetailsPanelProps {
  option: ModelOption
  isFavorite?: boolean
  onToggleFavorite?: (modelId: string) => void
  className?: string
}

export function ModelDetailsPanel({
  option,
  isFavorite,
  onToggleFavorite,
  className,
}: ModelDetailsPanelProps) {
  const modelColor = getModelColor(option)
  const pricing = option.pricing
  const hasPricing =
    pricing &&
    (pricing.inputPer1m !== undefined || pricing.outputPer1m !== undefined)

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Header: just name + star, colored accent line */}
      <div
        className="flex items-center justify-between gap-2 border-b px-3 py-2.5"
        style={{ borderTopColor: modelColor, borderTopWidth: 2, borderTopStyle: "solid" }}
      >
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-semibold leading-tight" title={option.id}>
            {getModelLabel(option)}
          </h4>
          {option.description && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {option.description}
            </p>
          )}
        </div>
        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggleFavorite(option.id)}
            className="size-6 shrink-0 rounded"
          >
            <Star
              className={cn(
                "size-3.5",
                isFavorite
                  ? "fill-amber-400 text-amber-400"
                  : "text-muted-foreground"
              )}
            />
          </Button>
        )}
      </div>

      {/* Body */}
      <div className="space-y-3 p-3">
        {option.parameterCount !== undefined && (
          <DetailRow icon={Database} label="Parameters">
            {formatParameterCount(option.parameterCount)}
          </DetailRow>
        )}

        {option.license && (
          <DetailRow icon={Tag} label="License">
            <Badge variant="outline" className="text-xs">{option.license}</Badge>
          </DetailRow>
        )}

        {option.capabilities && option.capabilities.length > 0 && (
          <DetailRow icon={Cpu} label="Specs">
            <div className="flex flex-wrap gap-1">
              {option.capabilities.map((cap, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {cap}
                </Badge>
              ))}
            </div>
          </DetailRow>
        )}

        {hasPricing && (
          <DetailRow icon={Euro} label="Pricing">
            {pricing!.inputPer1m === 0 && pricing!.outputPer1m === 0 ? (
              <Badge variant="secondary">Free</Badge>
            ) : (
              <div className="flex flex-col gap-0.5">
                {pricing!.inputPer1m !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(pricing!.inputPer1m, pricing!.currency)}/1M in
                  </span>
                )}
                {pricing!.outputPer1m !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    {formatCurrency(pricing!.outputPer1m, pricing!.currency)}/1M out
                  </span>
                )}
              </div>
            )}
          </DetailRow>
        )}

        {option.features && option.features.length > 0 && (
          <DetailRow icon={Wrench} label="Features">
            <div className="flex flex-wrap gap-1">
              {option.features.map((feat, i) => {
                const FeatIcon = feat.icon
                return (
                  <Badge key={i} variant="outline" className="gap-1 px-1.5 text-xs">
                    {FeatIcon && <FeatIcon className="size-3" />}
                    {feat.label}
                  </Badge>
                )
              })}
            </div>
          </DetailRow>
        )}

        {option.externalUrl && (
          <a
            href={option.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 pt-1 text-xs text-primary/70 transition-colors hover:text-primary hover:underline"
            title={option.externalUrl}
          >
            <ExternalLink className="size-3 shrink-0" />
            <span className="truncate">
              {option.externalLabel ?? option.externalUrl.replace(/^https?:\/\//, "")}
            </span>
          </a>
        )}
      </div>
    </div>
  )
}

interface DetailRowProps {
  icon: ElementType<{ className?: string }>
  label: string
  children: ReactNode
}

function DetailRow({ icon: Icon, label, children }: DetailRowProps) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex flex-col gap-0.5">
        <span className="mr-1.5 text-xs font-medium text-muted-foreground">
          {label}
        </span>
        <span className="text-xs">{children}</span>
      </div>
    </div>
  )
}
