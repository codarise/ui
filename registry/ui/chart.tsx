import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipValueType, TooltipPayloadEntry } from "recharts"

import { cn } from "@/lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

const INITIAL_DIMENSION = { width: 320, height: 200 } as const
type TooltipNameType = number | string

export type ChartConfig = Record<
  string,
  {
    label?: React.ReactNode
    icon?: React.ComponentType
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
>

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)

  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  initialDimension = INITIAL_DIMENSION,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
  initialDimension?: {
    width: number
    height: number
  }
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer
          initialDimension={initialDimension}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme ?? config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

type ChartPayload = TooltipPayloadEntry<TooltipValueType, TooltipNameType>

type ChartTooltipContentProps = React.ComponentProps<
  typeof RechartsPrimitive.Tooltip
> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
  } & Omit<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >,
    "accessibilityLayer"
  >

function ChartTooltipContent({
  active,
  payload,
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    return getTooltipLabel({
      config,
      payload,
      label,
      labelFormatter,
      labelClassName,
      hideLabel,
      labelKey,
    })
  }, [
    config,
    payload,
    label,
    labelFormatter,
    labelClassName,
    hideLabel,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const nestLabel = payload.length === 1 && indicator !== "dot"

  return (
    <div
      className={cn(
        "grid min-w-[8rem] items-start gap-2 rounded-lg border border-border/50 bg-background px-3 py-2 text-xs shadow-xl dark:border-border/60 dark:bg-background/95",
        className
      )}
    >
      {!nestLabel ? tooltipLabel : null}
      <div className="grid gap-1.5">
        {payload
          .filter((item) => item.type !== "none")
          .map((item, index) => (
            <TooltipPayloadItem
              key={index}
              item={item}
              index={index}
              config={config}
              indicator={indicator}
              hideIndicator={hideIndicator}
              color={color}
              nameKey={nameKey}
              nestLabel={nestLabel}
              tooltipLabel={nestLabel ? tooltipLabel : undefined}
              formatter={formatter}
            />
          ))}
      </div>
    </div>
  )
}

type TooltipLabelOptions = {
  config: ChartConfig
  payload?: ReadonlyArray<ChartPayload>
  label?: React.ReactNode
  labelFormatter?: RechartsPrimitive.DefaultTooltipContentProps<
    TooltipValueType,
    TooltipNameType
  >["labelFormatter"]
  labelClassName?: string
  hideLabel?: boolean
  labelKey?: string
}

function getTooltipLabel({
  config,
  payload,
  label,
  labelFormatter,
  labelClassName,
  hideLabel,
  labelKey,
}: TooltipLabelOptions): React.ReactNode {
  if (hideLabel || !payload?.length) {
    return null
  }

  const [item] = payload
  const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`
  const itemConfig = getPayloadConfigFromPayload(config, item, key)
  const value =
    !labelKey && typeof label === "string"
      ? (config[label]?.label ?? label)
      : itemConfig?.label

  if (labelFormatter) {
    return (
      <div className={cn("font-medium text-foreground", labelClassName)}>
        {labelFormatter(value, payload)}
      </div>
    )
  }

  if (!value) {
    return null
  }

  return (
    <div className={cn("font-medium text-foreground", labelClassName)}>
      {value}
    </div>
  )
}

type TooltipIndicatorProps = {
  indicator: "line" | "dot" | "dashed"
  color: string
  nestLabel: boolean
}

function TooltipIndicator({
  indicator,
  color,
  nestLabel,
}: TooltipIndicatorProps) {
  const indicatorStyle = {
    "--color-bg": color,
    "--color-border": color,
  } as unknown as React.CSSProperties

  return (
    <div
      className={cn(
        "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
        {
          "h-2.5 w-2.5": indicator === "dot",
          "w-1": indicator === "line",
          "w-0 border-[1.5px] border-dashed bg-transparent":
            indicator === "dashed",
          "my-0.5": nestLabel && indicator === "dashed",
        }
      )}
      style={indicatorStyle}
    />
  )
}

type TooltipPayloadItemProps = {
  item: ChartPayload
  index: number
  config: ChartConfig
  indicator: "line" | "dot" | "dashed"
  hideIndicator: boolean
  color?: string
  nameKey?: string
  nestLabel: boolean
  tooltipLabel?: React.ReactNode
  formatter?: NonNullable<
    RechartsPrimitive.DefaultTooltipContentProps<
      TooltipValueType,
      TooltipNameType
    >["formatter"]
  >
}

function TooltipPayloadItem({
  item,
  index,
  config,
  indicator,
  hideIndicator,
  color,
  nameKey,
  nestLabel,
  tooltipLabel,
  formatter,
}: TooltipPayloadItemProps) {
  const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
  const itemConfig = getPayloadConfigFromPayload(config, item, key)
  const indicatorColor: string | undefined =
    color ?? (item.payload?.fill as string | undefined) ?? item.color

  const wrapperClassName = cn(
    "flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5 [&>svg]:text-muted-foreground",
    indicator === "dot" && "items-center"
  )

  if (formatter && item.value !== undefined && item.name) {
    return (
      <div className={wrapperClassName}>
        {formatter(item.value, item.name, item, index, item.payload)}
      </div>
    )
  }

  return (
    <div className={wrapperClassName}>
      {itemConfig?.icon ? (
        <itemConfig.icon />
      ) : (
        !hideIndicator && (
          <TooltipIndicator
            indicator={indicator}
            color={indicatorColor ?? "transparent"}
            nestLabel={nestLabel}
          />
        )
      )}
      <div
        className={cn(
          "flex flex-1 justify-between gap-2 leading-none",
          nestLabel ? "items-end" : "items-center"
        )}
      >
        <div className="grid gap-1.5">
          {nestLabel ? tooltipLabel : null}
          <span className="text-muted-foreground">
            {itemConfig?.label ?? item.name}
          </span>
        </div>
        {item.value != null && (
          <span className="font-mono font-medium text-foreground tabular-nums">
            {typeof item.value === "number"
              ? item.value.toLocaleString()
              : String(item.value)}
          </span>
        )}
      </div>
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> & {
  hideIcon?: boolean
  nameKey?: string
} & RechartsPrimitive.DefaultLegendContentProps) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item, index) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
    </div>
  )
}

// Helper to extract item config from a payload.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getString(
  obj: Record<string, unknown>,
  key: string
): string | undefined {
  const value = obj[key]
  return typeof value === "string" ? value : undefined
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
): ChartConfig[string] | undefined {
  if (!isRecord(payload)) {
    return undefined
  }

  const nested = isRecord(payload.payload) ? payload.payload : undefined
  const configLabelKey =
    getString(payload, key) ??
    (nested ? getString(nested, key) : undefined) ??
    key

  return config[configLabelKey] ?? config[key]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
