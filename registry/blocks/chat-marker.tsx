import type { ReactNode } from 'react'

import {
  Marker,
  MarkerContent,
  MarkerIcon,
  type MarkerProps,
} from '../custom/marker'

export type ChatMarkerVariant = 'default' | 'separator' | 'border'

export interface ChatMarkerProps extends Omit<MarkerProps, 'variant'> {
  variant?: ChatMarkerVariant
  /** Optional leading icon node rendered inside MarkerIcon. */
  icon?: ReactNode
  children?: ReactNode
}

export function ChatMarker({
  variant = 'default',
  icon,
  children,
  className,
  ...props
}: ChatMarkerProps) {
  return (
    <Marker variant={variant} className={className} {...props}>
      {icon && <MarkerIcon>{icon}</MarkerIcon>}
      {children && <MarkerContent>{children}</MarkerContent>}
    </Marker>
  )
}
