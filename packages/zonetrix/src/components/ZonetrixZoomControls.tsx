import React from 'react';

export interface ZonetrixZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFitToView: () => void;
  minZoom?: number;
  maxZoom?: number;
  className?: string;
}

/**
 * Zoom control buttons for the Zonetrix canvas
 */
export const ZonetrixZoomControls: React.FC<ZonetrixZoomControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  onFitToView,
  minZoom = 0.1,
  maxZoom = 5,
  className = '',
}) => {
  const zoomPercentage = Math.round(zoom * 100);
  const canZoomIn = zoom < maxZoom;
  const canZoomOut = zoom > minZoom;

  return (
    <div className={`zonetrix-zoom-controls ${className}`} role="toolbar" aria-label="Zoom controls">
      <div className="zonetrix-zoom-controls-group">
        <button
          type="button"
          className="zonetrix-zoom-btn zonetrix-zoom-btn-out"
          onClick={onZoomOut}
          disabled={!canZoomOut}
          aria-label="Zoom out"
          title="Zoom out (or use mouse wheel)"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="4" y="9" width="12" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>

        <div className="zonetrix-zoom-display" aria-live="polite">
          {zoomPercentage}%
        </div>

        <button
          type="button"
          className="zonetrix-zoom-btn zonetrix-zoom-btn-in"
          onClick={onZoomIn}
          disabled={!canZoomIn}
          aria-label="Zoom in"
          title="Zoom in (or use mouse wheel)"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="4" y="9" width="12" height="2" rx="1" fill="currentColor" />
            <rect x="9" y="4" width="2" height="12" rx="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className="zonetrix-zoom-controls-group">
        <button
          type="button"
          className="zonetrix-zoom-btn zonetrix-zoom-btn-reset"
          onClick={onReset}
          disabled={zoom === 1}
          aria-label="Reset zoom to 100%"
          title="Reset zoom (1:1)"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10 4V2M10 18v-2M16 10h2M2 10h2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="10" cy="10" r="3" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        </button>

        <button
          type="button"
          className="zonetrix-zoom-btn zonetrix-zoom-btn-fit"
          onClick={onFitToView}
          aria-label="Fit all seats to view"
          title="Fit to view (show all seats)"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M2 6V3a1 1 0 011-1h3M18 6V3a1 1 0 00-1-1h-3M2 14v3a1 1 0 001 1h3M18 14v3a1 1 0 01-1 1h-3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

ZonetrixZoomControls.displayName = 'ZonetrixZoomControls';
