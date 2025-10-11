import type { LayoutConfig } from 'zonetrix';

export interface Preset {
  name: string;
  description: string;
  config: LayoutConfig;
}

export const presets: Preset[] = [
  {
    name: 'Simple 10×12 Grid',
    description: 'Classic theater seating',
    config: {
      type: 'grid',
      rows: 10,
      cols: 12,
      cellSize: 22,
      gap: 6,
      origin: { x: 100, y: 100 },
      numbering: {
        scheme: 'row-col',
        startIndex: 1,
      },
      labelPrefix: 'A',
    },
  },
  {
    name: 'Semi-Circle 100 Seats',
    description: 'Amphitheater style',
    config: {
      type: 'arc',
      radius: 200,
      sweepDegrees: 180,
      count: 100,
      cellSize: 18,
      origin: { x: 400, y: 300 },
      numbering: {
        scheme: 'index',
        startIndex: 1,
      },
    },
  },
  {
    name: 'Full Circle 60 Seats',
    description: 'Round table layout',
    config: {
      type: 'circle',
      radius: 150,
      count: 60,
      cellSize: 20,
      origin: { x: 300, y: 300 },
      numbering: {
        scheme: 'index',
        startIndex: 1,
      },
    },
  },
  {
    name: 'Conference Hall (3 Sections)',
    description: 'Multi-section venue',
    config: {
      type: 'sections',
      blocks: [
        {
          id: 'left',
          name: 'VIP Section',
          origin: { x: 50, y: 50 },
          rows: 8,
          cols: 6,
          cellSize: 22,
          gap: 6,
          labelPrefix: 'L',
          numbering: {
            scheme: 'row-col',
            startIndex: 1,
          },
        },
        {
          id: 'center',
          name: 'Main Floor',
          origin: { x: 200, y: 50 },
          rows: 8,
          cols: 10,
          cellSize: 22,
          gap: 6,
          labelPrefix: 'C',
          numbering: {
            scheme: 'row-col',
            startIndex: 1,
          },
        },
        {
          id: 'right',
          name: 'Balcony',
          origin: { x: 420, y: 50 },
          rows: 8,
          cols: 6,
          cellSize: 22,
          gap: 6,
          labelPrefix: 'R',
          numbering: {
            scheme: 'row-col',
            startIndex: 1,
          },
        },
      ],
    },
  },
];
