/**
 * ZonetrixLegend - Optional legend showing status indicators
 */

export interface ZonetrixLegendProps {
  showAvailable?: boolean;
  showSelected?: boolean;
  showUnavailable?: boolean;
  labels?: {
    available?: string;
    selected?: string;
    unavailable?: string;
  };
  className?: string;
}

export function ZonetrixLegend({
  showAvailable = true,
  showSelected = true,
  showUnavailable = true,
  labels = {},
  className = '',
}: ZonetrixLegendProps) {
  const { available = 'Available', selected = 'Selected', unavailable = 'Unavailable' } = labels;

  return (
    <div className={`zonetrix-legend ${className}`.trim()}>
      {showAvailable && (
        <div className="zonetrix-legend-item">
          <div className="zonetrix-legend-color available" />
          <span>{available}</span>
        </div>
      )}
      {showSelected && (
        <div className="zonetrix-legend-item">
          <div className="zonetrix-legend-color selected" />
          <span>{selected}</span>
        </div>
      )}
      {showUnavailable && (
        <div className="zonetrix-legend-item">
          <div className="zonetrix-legend-color unavailable" />
          <span>{unavailable}</span>
        </div>
      )}
    </div>
  );
}
