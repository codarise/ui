import * as React from "react"

interface PreviewBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface PreviewBoundaryState {
  hasError: boolean
}

export class PreviewBoundary extends React.Component<
  PreviewBoundaryProps,
  PreviewBoundaryState
> {
  state: PreviewBoundaryState = { hasError: false }

  static getDerivedStateFromError(): PreviewBoundaryState {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error("[showcase] preview crashed:", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center py-8 text-xs text-muted-foreground">
            Preview unavailable
          </div>
        )
      )
    }
    return this.props.children
  }
}
