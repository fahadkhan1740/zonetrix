import { useCallback, useRef, useState } from 'react';
import { clamp } from '../core/math';

export interface ZoomPanState {
  zoom: number;
  panX: number;
  panY: number;
}

export interface ZoomPanConfig {
  minZoom?: number;
  maxZoom?: number;
  zoomSpeed?: number;
  initialZoom?: number;
  initialPanX?: number;
  initialPanY?: number;
}

export interface UseZoomPanReturn {
  zoom: number;
  panX: number;
  panY: number;
  zoomIn: () => void;
  zoomOut: () => void;
  setZoom: (zoom: number) => void;
  resetZoom: () => void;
  fitToView: (
    contentWidth: number,
    contentHeight: number,
    viewportWidth: number,
    viewportHeight: number,
    padding?: number
  ) => void;
  handleWheel: (event: WheelEvent) => void;
  startPan: (clientX: number, clientY: number) => void;
  updatePan: (clientX: number, clientY: number) => void;
  endPan: () => void;
  isPanning: boolean;
  zoomToPoint: (clientX: number, clientY: number, deltaZoom: number) => void;
}

/**
 * Custom hook for managing zoom and pan state
 */
export function useZoomPan(config: ZoomPanConfig = {}): UseZoomPanReturn {
  const {
    minZoom = 0.1,
    maxZoom = 5,
    zoomSpeed = 0.1,
    initialZoom = 1,
    initialPanX = 0,
    initialPanY = 0,
  } = config;

  const [zoom, setZoomState] = useState(initialZoom);
  const [panX, setPanX] = useState(initialPanX);
  const [panY, setPanY] = useState(initialPanY);
  const [isPanning, setIsPanning] = useState(false);

  const panStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const setZoom = useCallback(
    (newZoom: number) => {
      setZoomState(clamp(newZoom, minZoom, maxZoom));
    },
    [minZoom, maxZoom]
  );

  const zoomIn = useCallback(() => {
    setZoom(zoom * (1 + zoomSpeed));
  }, [zoom, zoomSpeed, setZoom]);

  const zoomOut = useCallback(() => {
    setZoom(zoom * (1 - zoomSpeed));
  }, [zoom, zoomSpeed, setZoom]);

  const resetZoom = useCallback(() => {
    setZoomState(1);
    setPanX(0);
    setPanY(0);
  }, []);

  const fitToView = useCallback(
    (
      contentWidth: number,
      contentHeight: number,
      viewportWidth: number,
      viewportHeight: number,
      padding: number = 40
    ) => {
      const scaleX = (viewportWidth - padding * 2) / contentWidth;
      const scaleY = (viewportHeight - padding * 2) / contentHeight;
      const newZoom = clamp(Math.min(scaleX, scaleY), minZoom, maxZoom);

      setZoomState(newZoom);
      setPanX(0);
      setPanY(0);
    },
    [minZoom, maxZoom]
  );

  const zoomToPoint = useCallback(
    (clientX: number, clientY: number, deltaZoom: number) => {
      const newZoom = clamp(zoom + deltaZoom, minZoom, maxZoom);
      const zoomRatio = newZoom / zoom;

      // Adjust pan to zoom towards the mouse position
      const newPanX = clientX - (clientX - panX) * zoomRatio;
      const newPanY = clientY - (clientY - panY) * zoomRatio;

      setZoomState(newZoom);
      setPanX(newPanX);
      setPanY(newPanY);
    },
    [zoom, panX, panY, minZoom, maxZoom]
  );

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();

      const delta = -event.deltaY * 0.001;
      const deltaZoom = zoom * delta * zoomSpeed;

      zoomToPoint(event.clientX, event.clientY, deltaZoom);
    },
    [zoom, zoomSpeed, zoomToPoint]
  );

  const startPan = useCallback(
    (clientX: number, clientY: number) => {
      setIsPanning(true);
      panStartRef.current = {
        x: clientX,
        y: clientY,
        panX,
        panY,
      };
    },
    [panX, panY]
  );

  const updatePan = useCallback(
    (clientX: number, clientY: number) => {
      if (!isPanning) return;

      const deltaX = clientX - panStartRef.current.x;
      const deltaY = clientY - panStartRef.current.y;

      setPanX(panStartRef.current.panX + deltaX);
      setPanY(panStartRef.current.panY + deltaY);
    },
    [isPanning]
  );

  const endPan = useCallback(() => {
    setIsPanning(false);
  }, []);

  return {
    zoom,
    panX,
    panY,
    zoomIn,
    zoomOut,
    setZoom,
    resetZoom,
    fitToView,
    handleWheel,
    startPan,
    updatePan,
    endPan,
    isPanning,
    zoomToPoint,
  };
}
