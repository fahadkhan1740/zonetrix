/**
 * ZonetrixLegend - Optional legend showing status indicators
 */

export interface ZonetrixLegendProps {
  showAvailable?: boolean;
  showSelected?: boolean;
  showUnavailable?: boolean;
  showBooked?: boolean;
  showHeld?: boolean;
  showSold?: boolean;
  labels?: {
    available?: string;
    selected?: string;
    unavailable?: string;
    booked?: string;
    held?: string;
    sold?: string;
  };
  className?: string;
}

export function ZonetrixLegend({
  showAvailable = true,
  showSelected = true,
  showUnavailable = true,
  showBooked = false,
  showHeld = false,
  showSold = false,
  labels = {},
  className = '',
}: ZonetrixLegendProps) {
  const {
    available = 'Available',
    selected = 'Selected',
    unavailable = 'Unavailable',
    booked = 'Booked',
    held = 'On Hold',
    sold = 'Sold',
  } = labels;

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
      {showBooked && (
        <div className="zonetrix-legend-item">
          <div className="zonetrix-legend-color booked" />
          <span>{booked}</span>
        </div>
      )}
      {showHeld && (
        <div className="zonetrix-legend-item">
          <div className="zonetrix-legend-color held" />
          <span>{held}</span>
        </div>
      )}
      {showSold && (
        <div className="zonetrix-legend-item">
          <div className="zonetrix-legend-color sold" />
          <span>{sold}</span>
        </div>
      )}
    </div>
  );
}
