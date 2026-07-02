import { Check, Copy, Package } from "lucide-react"

import type { ManifestItem } from "../../generated/manifest"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../registry/ui/card"
import { Badge } from "../../../registry/ui/badge"
import { CopyButton } from "../../../registry/custom/copy-button"

import { PreviewBoundary } from "./PreviewBoundary"
import { noPreviewItems, previewComponents } from "./previews"

function CodeRow({
  label,
  value,
  copyText,
}: {
  label: string
  value: string
  copyText: string
}) {
  return (
    <div className="group/code flex items-center gap-2">
      <span className="w-12 shrink-0 text-[0.65rem] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <code className="scrollbar-thin min-w-0 flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap">
        {value}
      </code>
      <CopyButton
        text={copyText}
        variant="ghost"
        size="icon-xs"
        title={`Copy ${label.toLowerCase()}`}
        className="text-muted-foreground hover:text-foreground"
      >
        {(copied) =>
          copied ? (
            <Check className="size-3 text-success" />
          ) : (
            <Copy className="size-3" />
          )
        }
      </CopyButton>
    </div>
  )
}

function PreviewArea({ item }: { item: ManifestItem }) {
  const Preview = previewComponents[item.name]
  if (Preview) {
    return (
      <PreviewBoundary>
        <div className="flex min-h-32 items-center justify-center p-6">
          <Preview />
        </div>
      </PreviewBoundary>
    )
  }

  const hasNoPreview = noPreviewItems.has(item.name)
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-1 p-6 text-center text-muted-foreground">
      <Package className="size-5 opacity-40" />
      <p className="text-xs">
        {hasNoPreview
          ? "Runtime preview — see the install command below."
          : "Preview coming soon"}
      </p>
    </div>
  )
}

export function ShowcaseCard({ item }: { item: ManifestItem }) {
  return (
    <Card className="overflow-hidden p-0">
      <CardHeader className="gap-1.5 border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[0.6rem] uppercase">
            {item.registry}
          </Badge>
          {item.mainExport && (
            <Badge variant="outline" className="text-[0.6rem]">
              {item.mainExport}
            </Badge>
          )}
        </div>
        <CardTitle className="text-sm">{item.title}</CardTitle>
        <CardDescription className="line-clamp-2 text-xs">
          {item.description}
        </CardDescription>
      </CardHeader>

      <PreviewArea item={item} />

      <CardContent className="flex flex-col gap-2 border-t bg-card/50 p-3">
        {item.importStatement && (
          <CodeRow
            label="import"
            value={item.importStatement}
            copyText={item.importStatement}
          />
        )}
        <CodeRow
          label="install"
          value={item.installCommand}
          copyText={item.installCommand}
        />
      </CardContent>
    </Card>
  )
}
