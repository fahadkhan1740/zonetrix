# Zonetrix

A highly-flexible React + TypeScript library for rendering venue layouts (seats, booths, and more). Built for npm publishing, tree-shakeable, and fully typed.

![Zonetrix Demo](https://img.shields.io/badge/status-ready-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18-blue)

## 🎯 Features

- 🎭 **Multiple Layout Types**: Grid, Arc, Circle/Ring, and Multi-section layouts
- ⚡ **Performant**: Handles thousands of cells with smooth interaction
- 🎨 **Themeable**: CSS variables and custom theme support
- ♿ **Accessible**: Full keyboard navigation, ARIA labels, and focus management
- 🌍 **RTL Support**: Works seamlessly in both LTR and RTL directions
- 🔧 **Flexible**: Controlled and uncontrolled selection patterns
- 📦 **Tree-shakeable**: ESM and CJS builds with optimal bundle size
- 🎯 **TypeScript**: Fully typed for great DX
- ✅ **Tested**: Comprehensive test suite with Vitest

## 📦 Project Structure

```
zonetrix/
├── packages/
│   └── zonetrix/          # Main library package
│       ├── src/
│       │   ├── core/      # Layout algorithms & utilities
│       │   ├── components/ # React components
│       │   ├── styles/    # CSS styling system
│       │   └── index.ts   # Public exports
│       ├── dist/          # Built output (ESM + CJS + types)
│       └── package.json
├── examples/
│   └── basic/             # Interactive demo app
└── README.md
```

## 🚀 Quick Start

### For Library Development

```bash
# Install dependencies
cd packages/zonetrix
npm install

# Build the library
npm run build

# Run tests
npm test

# Lint and format with Biome
npm run lint        # Lint only
npm run format      # Format only
npm run check       # Lint + format + organize imports

# Type checking
npm run typecheck
```

### For Demo App

```bash
# Install dependencies
cd examples/basic
npm install

# Run dev server
npm run dev

# Visit http://localhost:3000
```

## 📚 Usage Example

```tsx
import { useState } from 'react';
import { ZonetrixCanvas, type LayoutConfig } from 'zonetrix';
import 'zonetrix/dist/index.css';

function App() {
  const [selected, setSelected] = useState<string[]>([]);

  const layout: LayoutConfig = {
    type: 'grid',
    rows: 10,
    cols: 12,
    cellSize: 22,
    gap: 6,
    numbering: { scheme: 'row-col', startIndex: 1 },
    labelPrefix: 'A',
  };

  return (
    <ZonetrixCanvas
      layout={layout}
      value={selected}
      onSelectionChange={setSelected}
      onCellClick={(cell) => console.log('Clicked:', cell.meta?.label)}
    />
  );
}
```

## 🎨 Layout Types

### 1. Grid Layout
Classic rows × columns seating (theaters, auditoriums)

### 2. Arc Layout
Seats along a circular arc (amphitheaters, curved rows)

### 3. Circle Layout
Full 360° seating arrangement (round tables, arenas)

### 4. Multi-Section Layout
Multiple independent sections (conference halls, stadiums)

See [packages/zonetrix/README.md](packages/zonetrix/README.md) for detailed API documentation.

## 🧪 Testing

```bash
cd packages/zonetrix
npm test
```

Tests cover:
- Layout algorithms (grid, arc, circle, sections)
- Numbering schemes
- Math utilities
- Selection logic
- A11y features

## 🏗️ Building

The library uses `tsup` for building:

```bash
cd packages/zonetrix
npm run build
```

Output:
- `dist/index.js` - ESM bundle
- `dist/index.cjs` - CommonJS bundle
- `dist/index.d.ts` - TypeScript definitions
- `dist/index.css` - Styles

## 🎯 Acceptance Checklist

All requirements from the spec have been implemented:

✅ **Layout Types**
- Grid (rows × columns)
- Arc (circular segment)
- Circle/Ring (full 360°)
- Free-plan sections (multi-block)

✅ **Core Features**
- Click to select/deselect cells
- Number display on hover and click
- Controlled/uncontrolled selection modes
- Generic Cell model for extensibility
- Event handlers (onCellClick, onSelectionChange, onCellHover)

✅ **A11y & RTL**
- Keyboard navigation (arrow keys, Enter, Space)
- ARIA roles (grid, gridcell)
- Focus states
- RTL mode support

✅ **Styling**
- CSS variables for theming
- Minimal Tailwind-friendly classNames
- Theme prop for customization

✅ **Demo App**
- Form-based configuration UI
- Live preview
- Preset layouts
- RTL toggle
- Selection display
- LocalStorage persistence

✅ **Technical**
- TypeScript with full typing
- Tree-shakeable (sideEffects: false)
- ESM + CJS builds
- Tests with Vitest
- Comprehensive README

✅ **Numbering Schemes**
- row-col (A1, A2, B1, B2)
- snake (zigzag)
- index (1, 2, 3...)
- alpha-rows (custom row labels)

## 📖 Documentation

- **Library API**: [packages/zonetrix/README.md](packages/zonetrix/README.md)
- **Demo App**: Visit `examples/basic` and run `npm run dev`
- **Config Presets**: [examples/basic/src/config-presets.ts](examples/basic/src/config-presets.ts)

## 🔄 Running the Demo

```bash
# From repository root
cd examples/basic
npm install
npm run dev

# Open http://localhost:3000 in your browser
```

The demo provides:
- Layout type selector (grid/arc/circle/sections)
- Dynamic form controls for each layout type
- 4 preset configurations
- Real-time preview
- Selection tracking
- RTL mode toggle
- Theme customization
- localStorage persistence

## 🛠️ Tech Stack

- **React 18** - UI library
- **TypeScript 5.3** - Type safety
- **tsup** - Build tool
- **Vitest** - Testing
- **Vite** - Demo app bundler
- **CSS Modules** - Styling
- **Biome** - Fast linting & formatting

## 📝 Future Enhancements (v2)

- Booth rendering with custom shapes (rectangles, polygons)
- Pan & zoom functionality
- Multi-row pricing
- Section labels and stage markers
- Export to SVG/PNG
- Storybook documentation

## 📄 License

MIT © Zonetrix Contributors

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

---

**Built with ❤️ for the events industry**
