import { useEffect, useState } from 'react';
import {
  type ArcLayoutConfig,
  type Cell,
  type CircleLayoutConfig,
  type GridLayoutConfig,
  type LayoutConfig,
  type SectionBlock,
  type SectionsLayoutConfig,
  ZonetrixCanvas,
  ZonetrixLegend,
} from 'zonetrix';
import { presets } from './config-presets';

// Local storage key
const STORAGE_KEY = 'zonetrix-demo-config';

function App() {
  // Layout configuration state
  const [layoutType, setLayoutType] = useState<'grid' | 'arc' | 'circle' | 'sections'>('grid');
  const [selected, setSelected] = useState<string[]>([]);
  const [rtl, setRtl] = useState(false);

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

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const config = JSON.parse(saved);
        if (config.layoutType) setLayoutType(config.layoutType);
        if (config.gridRows) setGridRows(config.gridRows);
        if (config.gridCols) setGridCols(config.gridCols);
        // ... load other values
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
          origin: { x: 100, y: 100 },
          labelPrefix: gridLabelPrefix,
          numbering: { scheme: gridScheme, startIndex: 1 },
        } as GridLayoutConfig;

      case 'arc':
        return {
          type: 'arc',
          radius: arcRadius,
          sweepDegrees: arcSweepDegrees,
          count: arcCount,
          cellSize: arcCellSize,
          origin: { x: 400, y: 300 },
          numbering: { scheme: 'index', startIndex: 1 },
        } as ArcLayoutConfig;

      case 'circle':
        return {
          type: 'circle',
          radius: circleRadius,
          count: circleCount,
          cellSize: circleCellSize,
          origin: { x: 300, y: 300 },
          numbering: { scheme: 'index', startIndex: 1 },
        } as CircleLayoutConfig;

      case 'sections':
        return {
          type: 'sections',
          blocks: sectionBlocks,
        } as SectionsLayoutConfig;

      default:
        return {
          type: 'grid',
          rows: 10,
          cols: 12,
          cellSize: 22,
          gap: 6,
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

  return (
    <div className="app">
      <aside className="sidebar">
        <h1>Zonetrix Demo</h1>
        <p>Configure and preview venue layouts</p>

        <div className="divider" />

        <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Presets</h3>
        <div className="preset-buttons">
          {presets.map((preset) => (
            <button
              key={preset.name}
              className="preset-button"
              onClick={() => handleLoadPreset(preset.config)}
            >
              <div style={{ fontWeight: 600 }}>{preset.name}</div>
              <div style={{ fontSize: 12, color: '#6b7280' }}>{preset.description}</div>
            </button>
          ))}
        </div>

        <div className="divider" />

        <div className="form-group">
          <label>Layout Type</label>
          <select value={layoutType} onChange={(e) => setLayoutType(e.target.value as any)}>
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
              <select value={gridScheme} onChange={(e) => setGridScheme(e.target.value as any)}>
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

          <ZonetrixLegend />
        </div>

        <div className="canvas-container">
          <div className="canvas-wrapper">
            <ZonetrixCanvas
              layout={currentLayout}
              value={selected}
              onSelectionChange={setSelected}
              onCellClick={(cell: Cell) => console.log('Cell clicked:', cell)}
              dir={rtl ? 'rtl' : 'ltr'}
              theme={{
                seatColorSelected: '#818cf8',
                seatColor: '#f3f4f6',
                seatColorUnavailable: '#d1d5db',
                seatBorder: '#cbd5e1',
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
