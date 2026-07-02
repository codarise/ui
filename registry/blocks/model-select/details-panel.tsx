import {
  BrainCircuit,
  Cpu,
  Database,
  Euro,
  ExternalLink,
  Star,
  Tag,
  Wrench,
} from "lucide-react"
import type { ElementType, ReactNode } from "react"

import { Badge } from "../../ui/badge"
import { Button } from "../../ui/button"
import { cn } from "../../lib/utils"
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
  const Icon = option.icon ?? BrainCircuit
  const pricing = option.pricing
  const hasPricing =
    pricing &&
    (pricing.inputPer1m !== undefined || pricing.outputPer1m !== undefined)

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <ModelDetailsHeader
        option={option}
        modelColor={modelColor}
        icon={Icon}
        isFavorite={isFavorite}
        onToggleFavorite={onToggleFavorite}
      />

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        <div className="grid gap-4 text-sm">
          {option.parameterCount !== undefined && (
            <DetailRow icon={Database} label="Parameters">
              {formatParameterCount(option.parameterCount)}
            </DetailRow>
          )}

          {option.license && (
            <DetailRow icon={Tag} label="License">
              <Badge variant="outline">{option.license}</Badge>
            </DetailRow>
          )}

          {option.capabilities && option.capabilities.length > 0 && (
            <CapabilitiesSection capabilities={option.capabilities} />
          )}

          {hasPricing && <PricingSection pricing={pricing} />}

          {option.features && option.features.length > 0 && (
            <FeaturesSection features={option.features} />
          )}

          {option.externalUrl && (
            <ExternalLinkSection
              url={option.externalUrl}
              label={option.externalLabel}
            />
          )}
        </div>
      </div>
    </div>
  )
}

interface ModelDetailsHeaderProps {
  option: ModelOption
  modelColor: string
  icon: ElementType<{ className?: string }>
  isFavorite?: boolean
  onToggleFavorite?: (modelId: string) => void
}

function ModelDetailsHeader({
  option,
  modelColor,
  icon: Icon,
  isFavorite,
  onToggleFavorite,
}: ModelDetailsHeaderProps) {
  return (
    <div
      className="sticky top-0 z-10 flex items-start gap-3 border-b bg-background/95 p-4 backdrop-blur-sm"
      style={{
        backgroundImage: `linear-gradient(135deg, ${modelColor}15 0%, transparent 100%)`,
      }}
    >
      <div
        className="flex size-10 flex-shrink-0 items-center justify-center rounded-lg shadow-sm"
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
                  "size-4 transition-colors duration-150",
                  isFavorite
                    ? "fill-amber-400 text-amber-400"
                    : "text-muted-foreground hover:text-amber-400/70"
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
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div>
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  )
}

function CapabilitiesSection({ capabilities }: { capabilities: string[] }) {
  return (
    <DetailRow icon={Cpu} label="Capabilities">
      <div className="flex flex-wrap gap-1.5">
        {capabilities.map((cap, i) => (
          <Badge key={i} variant="secondary" className="text-xs">
            {cap}
          </Badge>
        ))}
      </div>
    </DetailRow>
  )
}

function PricingSection({
  pricing,
}: {
  pricing: NonNullable<ModelOption["pricing"]>
}) {
  const isFree = pricing.inputPer1m === 0 && pricing.outputPer1m === 0

  return (
    <DetailRow icon={Euro} label="Pricing">
      {isFree ? (
        <Badge variant="secondary">Free</Badge>
      ) : (
        <div className="flex flex-col gap-0.5">
          {pricing.inputPer1m !== undefined && (
            <p className="text-xs">
              Input: {formatCurrency(pricing.inputPer1m, pricing.currency)}/1M
              tokens
            </p>
          )}
          {pricing.outputPer1m !== undefined && (
            <p className="text-xs">
              Output: {formatCurrency(pricing.outputPer1m, pricing.currency)}/1M
              tokens
            </p>
          )}
        </div>
      )}
    </DetailRow>
  )
}

function FeaturesSection({
  features,
}: {
  features: NonNullable<ModelOption["features"]>
}) {
  return (
    <DetailRow icon={Wrench} label="Features">
      <div className="flex flex-wrap gap-1.5">
        {features.map((feat, i) => {
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
  )
}

function ExternalLinkSection({ url, label }: { url: string; label?: string }) {
  return (
    <div className="border-t pt-3">
      <p className="mb-1 text-xs font-medium text-muted-foreground">
        {label ?? "External"}
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-primary transition-colors hover:text-primary/80 hover:underline"
      >
        {url.replace(/^https?:\/\//, "")}
        <ExternalLink className="size-3" />
      </a>
    </div>
  )
}
