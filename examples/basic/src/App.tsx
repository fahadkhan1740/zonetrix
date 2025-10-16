import { useEffect, useMemo, useState } from 'react';
import {
  type ArcLayoutConfig,
  type Cell,
  type CircleLayoutConfig,
  type GridLayoutConfig,
  type LayoutConfig,
  type AxisLabelsConfig,
  type LayoutObject,
  type SectionBlock,
  type SectionsLayoutConfig,
  ZonetrixCanvas,
  ZonetrixLegend,
} from 'zonetrix';
import { presets } from './config-presets';

// Local storage key
const STORAGE_KEY = 'zonetrix-demo-config';
const GRID_ORIGIN = { x: 100, y: 100 } as const;
const ARC_ORIGIN = { x: 400, y: 300 } as const;
const CIRCLE_ORIGIN = { x: 300, y: 300 } as const;
const OBJECT_MARGIN = 48;

function App() {
  // Layout configuration state
  const [layoutType, setLayoutType] = useState<'grid' | 'arc' | 'circle' | 'sections'>('grid');
  const [selected, setSelected] = useState<string[]>([]);
  const [rtl, setRtl] = useState(false);
  const [showSeatLabels, setShowSeatLabels] = useState(false);
  const [axisEnabled, setAxisEnabled] = useState(true);
  const [axisShowColumns, setAxisShowColumns] = useState(true);
  const [axisShowRows, setAxisShowRows] = useState(true);
  const [showObject, setShowObject] = useState(true);
  const [objectType, setObjectType] = useState<'stage' | 'screen' | 'custom'>('stage');
  const [objectLabel, setObjectLabel] = useState('Stage');

  // Grid config
  const [gridRows, setGridRows] = useState(10);
  const [gridCols, setGridCols] = useState(12);
  const [gridCellSize, setGridCellSize] = useState(22);
  const [gridGap, setGridGap] = useState(6);
  const [gridLabelPrefix, setGridLabelPrefix] = useState('A');
  const [gridScheme, setGridScheme] = useState<'row-col' | 'snake' | 'index' | 'alpha-rows'>(
    'row-col'
  );

  // Arc config
  const [arcRadius, setArcRadius] = useState(200);
  const [arcSweepDegrees, setArcSweepDegrees] = useState(180);
  const [arcCount, setArcCount] = useState(100);
  const [arcCellSize, setArcCellSize] = useState(18);

  // Circle config
  const [circleRadius, setCircleRadius] = useState(150);
  const [circleCount, setCircleCount] = useState(60);
  const [circleCellSize, setCircleCellSize] = useState(20);

  // Sections config
  const [sectionBlocks, setSectionBlocks] = useState<SectionBlock[]>([
    {
      id: 'section-1',
      origin: { x: 50, y: 50 },
      rows: 8,
      cols: 6,
      cellSize: 22,
      gap: 6,
      labelPrefix: 'A',
      numbering: { scheme: 'row-col', startIndex: 1 },
    },
  ]);

  // Seat color customization
  const [seatColorEmpty, setSeatColorEmpty] = useState('#e0f2fe');
  const [seatBorderEmpty, setSeatBorderEmpty] = useState('#7dd3fc');
  const [seatTextEmpty, setSeatTextEmpty] = useState('#0c4a6e');

  const [seatColorHover, setSeatColorHover] = useState('#bae6fd');
  const [seatBorderHover, setSeatBorderHover] = useState('#0ea5e9');
  const [seatTextHover, setSeatTextHover] = useState('#075985');

  const [seatColorSelected, setSeatColorSelected] = useState('#22c55e');
  const [seatBorderSelected, setSeatBorderSelected] = useState('#15803d');
  const [seatTextSelected, setSeatTextSelected] = useState('#ffffff');

  const [seatColorUnavailable, setSeatColorUnavailable] = useState('#f1f5f9');
  const [seatBorderUnavailable, setSeatBorderUnavailable] = useState('#cbd5e1');
  const [seatTextUnavailable, setSeatTextUnavailable] = useState('#94a3b8');

  const [seatColorBooked, setSeatColorBooked] = useState('#fee2e2');
  const [seatBorderBooked, setSeatBorderBooked] = useState('#fca5a5');
  const [seatTextBooked, setSeatTextBooked] = useState('#991b1b');

  const [seatColorHeld, setSeatColorHeld] = useState('#fef3c7');
  const [seatBorderHeld, setSeatBorderHeld] = useState('#fbbf24');
  const [seatTextHeld, setSeatTextHeld] = useState('#92400e');

  const [seatColorSold, setSeatColorSold] = useState('#ffe4e6');
  const [seatBorderSold, setSeatBorderSold] = useState('#f43f5e');
  const [seatTextSold, setSeatTextSold] = useState('#881337');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const config = JSON.parse(saved);
        if (config.layoutType) setLayoutType(config.layoutType);
        if (config.gridRows) setGridRows(config.gridRows);
        if (config.gridCols) setGridCols(config.gridCols);
        // Load seat colors
        if (config.seatColorEmpty) setSeatColorEmpty(config.seatColorEmpty);
        if (config.seatBorderEmpty) setSeatBorderEmpty(config.seatBorderEmpty);
        if (config.seatTextEmpty) setSeatTextEmpty(config.seatTextEmpty);
        if (config.seatColorHover) setSeatColorHover(config.seatColorHover);
        if (config.seatBorderHover) setSeatBorderHover(config.seatBorderHover);
        if (config.seatTextHover) setSeatTextHover(config.seatTextHover);
        if (config.seatColorSelected) setSeatColorSelected(config.seatColorSelected);
        if (config.seatBorderSelected) setSeatBorderSelected(config.seatBorderSelected);
        if (config.seatTextSelected) setSeatTextSelected(config.seatTextSelected);
        if (config.seatColorUnavailable) setSeatColorUnavailable(config.seatColorUnavailable);
        if (config.seatBorderUnavailable) setSeatBorderUnavailable(config.seatBorderUnavailable);
        if (config.seatTextUnavailable) setSeatTextUnavailable(config.seatTextUnavailable);
        if (config.seatColorBooked) setSeatColorBooked(config.seatColorBooked);
        if (config.seatBorderBooked) setSeatBorderBooked(config.seatBorderBooked);
        if (config.seatTextBooked) setSeatTextBooked(config.seatTextBooked);
        if (config.seatColorHeld) setSeatColorHeld(config.seatColorHeld);
        if (config.seatBorderHeld) setSeatBorderHeld(config.seatBorderHeld);
        if (config.seatTextHeld) setSeatTextHeld(config.seatTextHeld);
        if (config.seatColorSold) setSeatColorSold(config.seatColorSold);
        if (config.seatBorderSold) setSeatBorderSold(config.seatBorderSold);
        if (config.seatTextSold) setSeatTextSold(config.seatTextSold);
      } catch (e) {
        console.error('Failed to load saved config:', e);
      }
    }
  }, []);

  // Save to localStorage when config changes
  useEffect(() => {
    const config = {
      layoutType,
      gridRows,
      gridCols,
      gridCellSize,
      gridGap,
      gridLabelPrefix,
      gridScheme,
      arcRadius,
      arcSweepDegrees,
      arcCount,
      arcCellSize,
      circleRadius,
      circleCount,
      circleCellSize,
      // Seat colors
      seatColorEmpty,
      seatBorderEmpty,
      seatTextEmpty,
      seatColorHover,
      seatBorderHover,
      seatTextHover,
      seatColorSelected,
      seatBorderSelected,
      seatTextSelected,
      seatColorUnavailable,
      seatBorderUnavailable,
      seatTextUnavailable,
      seatColorBooked,
      seatBorderBooked,
      seatTextBooked,
      seatColorHeld,
      seatBorderHeld,
      seatTextHeld,
      seatColorSold,
      seatBorderSold,
      seatTextSold,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [
    layoutType,
    gridRows,
    gridCols,
    gridCellSize,
    gridGap,
    gridLabelPrefix,
    gridScheme,
    arcRadius,
    arcSweepDegrees,
    arcCount,
    arcCellSize,
    circleRadius,
    circleCount,
    circleCellSize,
    // Seat colors
    seatColorEmpty,
    seatBorderEmpty,
    seatTextEmpty,
    seatColorHover,
    seatBorderHover,
    seatTextHover,
    seatColorSelected,
    seatBorderSelected,
    seatTextSelected,
    seatColorUnavailable,
    seatBorderUnavailable,
    seatTextUnavailable,
    seatColorBooked,
    seatBorderBooked,
    seatTextBooked,
    seatColorHeld,
    seatBorderHeld,
    seatTextHeld,
    seatColorSold,
    seatBorderSold,
    seatTextSold,
  ]);

  const axisConfig = useMemo<AxisLabelsConfig>(
    () =>
      axisEnabled
        ? {
            enabled: true,
            showX: axisShowColumns,
            showY: axisShowRows,
            position: { x: 'top', y: 'left' },
            offset: 48,
          }
        : { enabled: false },
    [axisEnabled, axisShowColumns, axisShowRows]
  );

  const layoutObjects = useMemo<LayoutObject[]>(() => {
    if (!showObject) return [];

    const resolvedLabel =
      objectLabel.trim() ||
      (objectType === 'stage' ? 'Stage' : objectType === 'screen' ? 'Screen' : 'Custom Object');

    if (layoutType === 'grid') {
      const totalWidth = gridCols * gridCellSize + (gridCols - 1) * gridGap;
      const width = Math.max(100, totalWidth);
      const height = Math.max(36, gridCellSize * 1.4);
      const x = GRID_ORIGIN.x + totalWidth / 2;
      const y = GRID_ORIGIN.y - height / 2 - OBJECT_MARGIN;

      return [
        {
          id: 'primary-object',
          type: objectType,
          label: resolvedLabel,
          x,
          y,
          width,
          height,
        },
      ];
    }

    if (layoutType === 'arc') {
      const width = Math.max(140, arcRadius * 1.6);
      const height = Math.max(36, arcCellSize * 1.4);
      const x = ARC_ORIGIN.x;
      const y = ARC_ORIGIN.y - arcRadius - height / 2 - OBJECT_MARGIN;
      return [
        {
          id: 'primary-object',
          type: objectType,
          label: resolvedLabel,
          x,
          y,
          width,
          height,
        },
      ];
    }

    if (layoutType === 'circle') {
      const width = Math.max(140, circleRadius * 1.4);
      const height = Math.max(32, circleCellSize * 1.3);
      const x = CIRCLE_ORIGIN.x;
      const y = CIRCLE_ORIGIN.y - circleRadius - height / 2 - OBJECT_MARGIN;
      return [
        {
          id: 'primary-object',
          type: objectType,
          label: resolvedLabel,
          x,
          y,
          width,
          height,
        },
      ];
    }

    if (layoutType === 'sections' && sectionBlocks.length > 0) {
      let minX = Number.POSITIVE_INFINITY;
      let maxX = Number.NEGATIVE_INFINITY;
      let minY = Number.POSITIVE_INFINITY;
      let maxCellSize = 0;

      for (const block of sectionBlocks) {
        const gap = block.gap ?? 0;
        const blockWidth = block.cols * block.cellSize + (block.cols - 1) * gap;
        minX = Math.min(minX, block.origin.x);
        maxX = Math.max(maxX, block.origin.x + blockWidth);
        minY = Math.min(minY, block.origin.y);
        maxCellSize = Math.max(maxCellSize, block.cellSize);
      }

      if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY)) {
        return [];
      }

      const seatWidth = maxX - minX;
      const width = Math.max(120, seatWidth);
      const height = Math.max(36, maxCellSize * 1.4);
      const x = minX + seatWidth / 2;
      const y = minY - height / 2 - OBJECT_MARGIN;

      return [
        {
          id: 'primary-object',
          type: objectType,
          label: resolvedLabel,
          x,
          y,
          width,
          height,
        },
      ];
    }

    return [];
  }, [
    showObject,
    objectLabel,
    objectType,
    layoutType,
    gridCols,
    gridCellSize,
    gridGap,
    arcRadius,
    arcCellSize,
    circleRadius,
    circleCellSize,
    sectionBlocks,
  ]);

  // Build current layout config
  const currentLayout: LayoutConfig = (() => {
    switch (layoutType) {
      case 'grid':
        return {
          type: 'grid',
          rows: gridRows,
          cols: gridCols,
          cellSize: gridCellSize,
          gap: gridGap,
          origin: GRID_ORIGIN,
          labelPrefix: gridLabelPrefix,
          numbering: { scheme: gridScheme, startIndex: 1 },
          objects: layoutObjects,
        } as GridLayoutConfig;

      case 'arc':
        return {
          type: 'arc',
          radius: arcRadius,
          sweepDegrees: arcSweepDegrees,
          count: arcCount,
          cellSize: arcCellSize,
          origin: ARC_ORIGIN,
          numbering: { scheme: 'index', startIndex: 1 },
          objects: layoutObjects,
        } as ArcLayoutConfig;

      case 'circle':
        return {
          type: 'circle',
          radius: circleRadius,
          count: circleCount,
          cellSize: circleCellSize,
          origin: CIRCLE_ORIGIN,
          numbering: { scheme: 'index', startIndex: 1 },
          objects: layoutObjects,
        } as CircleLayoutConfig;

      case 'sections':
        return {
          type: 'sections',
          blocks: sectionBlocks,
          objects: layoutObjects,
        } as SectionsLayoutConfig;

      default:
        return {
          type: 'grid',
          rows: 10,
          cols: 12,
          cellSize: 22,
          gap: 6,
          origin: GRID_ORIGIN,
          objects: layoutObjects,
        } as GridLayoutConfig;
    }
  })();

  const handleLoadPreset = (config: LayoutConfig) => {
    if (config.type === 'grid') {
      setLayoutType('grid');
      setGridRows(config.rows);
      setGridCols(config.cols);
      setGridCellSize(config.cellSize);
      setGridGap(config.gap || 0);
      setGridLabelPrefix(config.labelPrefix || 'A');
      setGridScheme(config.numbering?.scheme || 'row-col');
    } else if (config.type === 'arc') {
      setLayoutType('arc');
      setArcRadius(config.radius);
      setArcSweepDegrees(config.sweepDegrees);
      setArcCount(config.count);
      setArcCellSize(config.cellSize);
    } else if (config.type === 'circle') {
      setLayoutType('circle');
      setCircleRadius(config.radius);
      setCircleCount(config.count);
      setCircleCellSize(config.cellSize);
    } else if (config.type === 'sections') {
      setLayoutType('sections');
      setSectionBlocks(config.blocks);
    }
    setSelected([]);
  };

  const handleAddSection = () => {
    const newBlock: SectionBlock = {
      id: `section-${sectionBlocks.length + 1}`,
      origin: { x: 50 + sectionBlocks.length * 150, y: 50 },
      rows: 5,
      cols: 5,
      cellSize: 22,
      gap: 6,
      labelPrefix: String.fromCharCode(65 + sectionBlocks.length),
      numbering: { scheme: 'row-col', startIndex: 1 },
    };
    setSectionBlocks([...sectionBlocks, newBlock]);
  };

  const handleRemoveSection = (index: number) => {
    setSectionBlocks(sectionBlocks.filter((_, i) => i !== index));
  };

  const handleUpdateSection = (index: number, updates: Partial<SectionBlock>) => {
    setSectionBlocks(
      sectionBlocks.map((block, i) => (i === index ? { ...block, ...updates } : block))
    );
  };

  const handleObjectTypeChange = (type: 'stage' | 'screen' | 'custom') => {
    setObjectType(type);
    setObjectLabel((prev) => {
      const defaults = ['Stage', 'Screen', 'Custom Object'];
      if (defaults.includes(prev) || prev.trim().length === 0) {
        if (type === 'stage') return 'Stage';
        if (type === 'screen') return 'Screen';
        return 'Custom Object';
      }
      return prev;
    });
  };

  const axisColor = '#1f2937';
  const objectFillColor =
    objectType === 'stage' ? '#1f2937' : objectType === 'screen' ? '#0f172a' : '#334155';
  const objectBorderColor = '#020617';
  const objectTextColor = '#f8fafc';

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Zonetrix Demo</h1>
        <p>Configure and preview venue layouts</p>

        <div className="divider" />

        <h3 className="text-sm font-semibold mb-3">Presets</h3>
        <div className="preset-buttons">
          {presets.map((preset) => (
            <button
              key={preset.name}
              className="preset-button"
              onClick={() => handleLoadPreset(preset.config)}
            >
              <div className="font-semibold">{preset.name}</div>
              <div className="text-xs text-gray-500">{preset.description}</div>
            </button>
          ))}
        </div>

        <div className="divider" />

        <div className="form-group">
          <label>Layout Type</label>
          <select value={layoutType} onChange={(e) => setLayoutType(e.target.value as 'grid' | 'arc' | 'circle' | 'sections')}>
            <option value="grid">Grid</option>
            <option value="arc">Arc</option>
            <option value="circle">Circle</option>
            <option value="sections">Sections</option>
          </select>
        </div>

        {layoutType === 'grid' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Rows</label>
                <input
                  type="number"
                  value={gridRows}
                  onChange={(e) => setGridRows(Number(e.target.value))}
                  min={1}
                  max={50}
                />
              </div>
              <div className="form-group">
                <label>Columns</label>
                <input
                  type="number"
                  value={gridCols}
                  onChange={(e) => setGridCols(Number(e.target.value))}
                  min={1}
                  max={50}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Cell Size</label>
                <input
                  type="number"
                  value={gridCellSize}
                  onChange={(e) => setGridCellSize(Number(e.target.value))}
                  min={10}
                  max={50}
                />
              </div>
              <div className="form-group">
                <label>Gap</label>
                <input
                  type="number"
                  value={gridGap}
                  onChange={(e) => setGridGap(Number(e.target.value))}
                  min={0}
                  max={20}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Label Prefix</label>
              <input
                type="text"
                value={gridLabelPrefix}
                onChange={(e) => setGridLabelPrefix(e.target.value)}
                maxLength={3}
              />
            </div>

            <div className="form-group">
              <label>Numbering Scheme</label>
              <select value={gridScheme} onChange={(e) => setGridScheme(e.target.value as 'row-col' | 'snake' | 'index' | 'alpha-rows')}>
                <option value="row-col">Row-Column</option>
                <option value="snake">Snake</option>
                <option value="index">Index</option>
                <option value="alpha-rows">Alpha Rows</option>
              </select>
            </div>
          </>
        )}

        {layoutType === 'arc' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Radius</label>
                <input
                  type="number"
                  value={arcRadius}
                  onChange={(e) => setArcRadius(Number(e.target.value))}
                  min={50}
                  max={500}
                />
              </div>
              <div className="form-group">
                <label>Sweep (°)</label>
                <input
                  type="number"
                  value={arcSweepDegrees}
                  onChange={(e) => setArcSweepDegrees(Number(e.target.value))}
                  min={30}
                  max={360}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Seat Count</label>
                <input
                  type="number"
                  value={arcCount}
                  onChange={(e) => setArcCount(Number(e.target.value))}
                  min={1}
                  max={200}
                />
              </div>
              <div className="form-group">
                <label>Cell Size</label>
                <input
                  type="number"
                  value={arcCellSize}
                  onChange={(e) => setArcCellSize(Number(e.target.value))}
                  min={10}
                  max={50}
                />
              </div>
            </div>
          </>
        )}

        {layoutType === 'circle' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Radius</label>
                <input
                  type="number"
                  value={circleRadius}
                  onChange={(e) => setCircleRadius(Number(e.target.value))}
                  min={50}
                  max={500}
                />
              </div>
              <div className="form-group">
                <label>Seat Count</label>
                <input
                  type="number"
                  value={circleCount}
                  onChange={(e) => setCircleCount(Number(e.target.value))}
                  min={1}
                  max={200}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Cell Size</label>
              <input
                type="number"
                value={circleCellSize}
                onChange={(e) => setCircleCellSize(Number(e.target.value))}
                min={10}
                max={50}
              />
            </div>
          </>
        )}

        {layoutType === 'sections' && (
          <>
            <button className="add-section-button" onClick={handleAddSection}>
              + Add Section
            </button>

            {sectionBlocks.map((block, index) => (
              <div key={block.id} className="section-block">
                <h4>Section {index + 1}</h4>

                <div className="form-group">
                  <label>Section Name</label>
                  <input
                    type="text"
                    value={block.name || ''}
                    onChange={(e) => handleUpdateSection(index, { name: e.target.value })}
                    placeholder="e.g., VIP, Balcony"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Origin X</label>
                    <input
                      type="number"
                      value={block.origin.x}
                      onChange={(e) =>
                        handleUpdateSection(index, {
                          origin: { ...block.origin, x: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Origin Y</label>
                    <input
                      type="number"
                      value={block.origin.y}
                      onChange={(e) =>
                        handleUpdateSection(index, {
                          origin: { ...block.origin, y: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rows</label>
                    <input
                      type="number"
                      value={block.rows}
                      onChange={(e) => handleUpdateSection(index, { rows: Number(e.target.value) })}
                      min={1}
                    />
                  </div>
                  <div className="form-group">
                    <label>Cols</label>
                    <input
                      type="number"
                      value={block.cols}
                      onChange={(e) => handleUpdateSection(index, { cols: Number(e.target.value) })}
                      min={1}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Label Prefix</label>
                  <input
                    type="text"
                    value={block.labelPrefix || ''}
                    onChange={(e) => handleUpdateSection(index, { labelPrefix: e.target.value })}
                    maxLength={3}
                  />
                </div>

                {sectionBlocks.length > 1 && (
                  <button
                    className="remove-section-button"
                    onClick={() => handleRemoveSection(index)}
                  >
                    Remove Section
                  </button>
                )}
              </div>
            ))}
          </>
        )}

        <div className="divider" />

        <h3 className="text-sm font-semibold mb-3">Display</h3>
        <div className="display-section">
          <label className="checkbox-row">
            <input
              type="checkbox"
              className="checkbox"
              checked={showSeatLabels}
              onChange={(e) => setShowSeatLabels(e.target.checked)}
            />
            Show seat labels
          </label>

          <div>
            <label className="checkbox-row">
              <input
                type="checkbox"
                className="checkbox"
                checked={axisEnabled}
                onChange={(e) => setAxisEnabled(e.target.checked)}
              />
              Show axis labels
            </label>
            {axisEnabled && (
              <div className="axis-options">
                <label className="checkbox-row axis-option">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={axisShowColumns}
                    onChange={(e) => setAxisShowColumns(e.target.checked)}
                  />
                  Columns (X axis)
                </label>
                <label className="checkbox-row axis-option">
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={axisShowRows}
                    onChange={(e) => setAxisShowRows(e.target.checked)}
                  />
                  Rows (Y axis)
                </label>
              </div>
            )}
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              className="checkbox"
              checked={showObject}
              onChange={(e) => setShowObject(e.target.checked)}
            />
            Show stage/screen
          </label>

          {showObject && (
            <>
              <div className="form-group">
                <label>Object Type</label>
                <select
                  value={objectType}
                  onChange={(e) => handleObjectTypeChange(e.target.value as 'stage' | 'screen' | 'custom')}
                >
                  <option value="stage">Stage</option>
                  <option value="screen">Screen</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="form-group">
                <label>Object Label</label>
                <input
                  type="text"
                  value={objectLabel}
                  onChange={(e) => setObjectLabel(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <div className="divider" />

        <h3 className="text-sm font-semibold mb-3">Seat Colors</h3>

        <details className="mb-4">
          <summary className="cursor-pointer font-medium text-sm mb-2">Empty Seats</summary>
          <div className="ml-4 space-y-2">
            <div className="form-group">
              <label>Fill Color</label>
              <input
                type="color"
                value={seatColorEmpty}
                onChange={(e) => setSeatColorEmpty(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Border Color</label>
              <input
                type="color"
                value={seatBorderEmpty}
                onChange={(e) => setSeatBorderEmpty(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={seatTextEmpty}
                onChange={(e) => setSeatTextEmpty(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </details>

        <details className="mb-4">
          <summary className="cursor-pointer font-medium text-sm mb-2">Hover State</summary>
          <div className="ml-4 space-y-2">
            <div className="form-group">
              <label>Fill Color</label>
              <input
                type="color"
                value={seatColorHover}
                onChange={(e) => setSeatColorHover(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Border Color</label>
              <input
                type="color"
                value={seatBorderHover}
                onChange={(e) => setSeatBorderHover(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={seatTextHover}
                onChange={(e) => setSeatTextHover(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </details>

        <details className="mb-4">
          <summary className="cursor-pointer font-medium text-sm mb-2">Selected Seats</summary>
          <div className="ml-4 space-y-2">
            <div className="form-group">
              <label>Fill Color</label>
              <input
                type="color"
                value={seatColorSelected}
                onChange={(e) => setSeatColorSelected(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Border Color</label>
              <input
                type="color"
                value={seatBorderSelected}
                onChange={(e) => setSeatBorderSelected(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={seatTextSelected}
                onChange={(e) => setSeatTextSelected(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </details>

        <details className="mb-4">
          <summary className="cursor-pointer font-medium text-sm mb-2">Unavailable Seats</summary>
          <div className="ml-4 space-y-2">
            <div className="form-group">
              <label>Fill Color</label>
              <input
                type="color"
                value={seatColorUnavailable}
                onChange={(e) => setSeatColorUnavailable(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Border Color</label>
              <input
                type="color"
                value={seatBorderUnavailable}
                onChange={(e) => setSeatBorderUnavailable(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={seatTextUnavailable}
                onChange={(e) => setSeatTextUnavailable(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </details>

        <details className="mb-4">
          <summary className="cursor-pointer font-medium text-sm mb-2">Booked Seats</summary>
          <div className="ml-4 space-y-2">
            <div className="form-group">
              <label>Fill Color</label>
              <input
                type="color"
                value={seatColorBooked}
                onChange={(e) => setSeatColorBooked(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Border Color</label>
              <input
                type="color"
                value={seatBorderBooked}
                onChange={(e) => setSeatBorderBooked(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={seatTextBooked}
                onChange={(e) => setSeatTextBooked(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </details>

        <details className="mb-4">
          <summary className="cursor-pointer font-medium text-sm mb-2">Held Seats</summary>
          <div className="ml-4 space-y-2">
            <div className="form-group">
              <label>Fill Color</label>
              <input
                type="color"
                value={seatColorHeld}
                onChange={(e) => setSeatColorHeld(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Border Color</label>
              <input
                type="color"
                value={seatBorderHeld}
                onChange={(e) => setSeatBorderHeld(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={seatTextHeld}
                onChange={(e) => setSeatTextHeld(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </details>

        <details className="mb-4">
          <summary className="cursor-pointer font-medium text-sm mb-2">Sold Seats</summary>
          <div className="ml-4 space-y-2">
            <div className="form-group">
              <label>Fill Color</label>
              <input
                type="color"
                value={seatColorSold}
                onChange={(e) => setSeatColorSold(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Border Color</label>
              <input
                type="color"
                value={seatBorderSold}
                onChange={(e) => setSeatBorderSold(e.target.value)}
                className="w-full h-10"
              />
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <input
                type="color"
                value={seatTextSold}
                onChange={(e) => setSeatTextSold(e.target.value)}
                className="w-full h-10"
              />
            </div>
          </div>
        </details>

        <div className="divider" />

        <button className="button button-secondary" onClick={() => setSelected([])}>
          Clear Selection
        </button>

        {selected.length > 0 && (
          <div className="selection-info">
            <h3>Selected ({selected.length})</h3>
            <div className="selection-pills">
              {selected.slice(0, 20).map((label) => (
                <div key={label} className="selection-pill">
                  {label}
                </div>
              ))}
              {selected.length > 20 && (
                <div className="selection-pill">+{selected.length - 20}</div>
              )}
            </div>
          </div>
        )}
      </aside>

      <main className="main-content">
        <div className="controls-bar">
          <label>
            <input
              type="checkbox"
              className="checkbox"
              checked={rtl}
              onChange={(e) => setRtl(e.target.checked)}
            />
            RTL Mode
          </label>

          <ZonetrixLegend showBooked={true} showHeld={true} />
        </div>

        <div className="canvas-container">
          <div className="canvas-wrapper">
            <ZonetrixCanvas
              layout={currentLayout}
              value={selected}
              onSelectionChange={setSelected}
              onCellClick={(cell: Cell) => console.log('Cell clicked:', cell)}
              dir={rtl ? 'rtl' : 'ltr'}
              showSeatLabels={showSeatLabels}
              axisLabels={axisConfig}
              theme={{
                // Seat colors from state
                seatColorEmpty,
                seatBorderEmpty,
                seatTextEmpty,
                seatColorHover,
                seatBorderHover,
                seatTextHover,
                seatColorSelected,
                seatBorderSelected,
                seatTextSelected,
                seatColorUnavailable,
                seatBorderUnavailable,
                seatTextUnavailable,
                seatColorBooked,
                seatBorderBooked,
                seatTextBooked,
                axisLabelColor: axisColor,
                objectFillColor,
                objectBorderColor,
                objectTextColor,
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
