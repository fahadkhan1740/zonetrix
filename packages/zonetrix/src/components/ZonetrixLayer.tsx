/**
 * ZonetrixLayer - Container layer for future overlays and annotations
 */

import type { ReactNode } from 'react';

export interface ZonetrixLayerProps {
  children?: ReactNode;
  className?: string;
}

export function ZonetrixLayer({ children, className = '' }: ZonetrixLayerProps) {
  return <g className={`zonetrix-layer ${className}`.trim()}>{children}</g>;
}
