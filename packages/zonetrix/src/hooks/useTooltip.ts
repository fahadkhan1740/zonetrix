/**
 * useTooltip - Hook for managing tooltip state and positioning
 */

import { useCallback, useEffect, useState } from 'react';
import type { Cell } from '../core/models';

export interface TooltipPosition {
  x: number;
  y: number;
}

export interface TooltipState {
  cell: Cell | null;
  position: TooltipPosition;
  visible: boolean;
  isTouchMode: boolean;
}

export interface UseTooltipOptions {
  /** Offset from cursor/touch point (px) */
  offset?: { x: number; y: number };
  /** Enable touch mode detection */
  enableTouch?: boolean;
  /** Delay before showing tooltip (ms) */
  showDelay?: number;
  /** Delay before hiding tooltip (ms) */
  hideDelay?: number;
}

export interface UseTooltipReturn {
  tooltipState: TooltipState;
  handleMouseMove: (e: React.MouseEvent | MouseEvent) => void;
  handleMouseEnter: (cell: Cell, e: React.MouseEvent) => void;
  handleMouseLeave: () => void;
  handleTouchStart: (cell: Cell, e: React.TouchEvent) => void;
  handleTouchEnd: () => void;
  hideTooltip: () => void;
  setTooltipCell: (cell: Cell | null) => void;
}

export function useTooltip(options: UseTooltipOptions = {}): UseTooltipReturn {
  const {
    offset = { x: 12, y: 12 },
    enableTouch = true,
    showDelay = 0,
    hideDelay = 0,
  } = options;

  const [tooltipState, setTooltipState] = useState<TooltipState>({
    cell: null,
    position: { x: 0, y: 0 },
    visible: false,
    isTouchMode: false,
  });

  const [showTimeout, setShowTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [hideTimeout, setHideTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  // Detect touch capability
  useEffect(() => {
    if (!enableTouch) return;

    const checkTouchDevice = () => {
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0;

      setTooltipState((prev) => ({ ...prev, isTouchMode: hasTouch }));
    };

    checkTouchDevice();
    window.addEventListener('touchstart', checkTouchDevice, { once: true });

    return () => {
      window.removeEventListener('touchstart', checkTouchDevice);
    };
  }, [enableTouch]);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (showTimeout) clearTimeout(showTimeout);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, [showTimeout, hideTimeout]);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      setTooltipState((prev) => ({
        ...prev,
        position: {
          x: clientX + offset.x,
          y: clientY + offset.y,
        },
      }));
    },
    [offset.x, offset.y]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent | MouseEvent) => {
      if (tooltipState.isTouchMode) return;
      if (!tooltipState.visible) return;

      updatePosition(e.clientX, e.clientY);
    },
    [tooltipState.isTouchMode, tooltipState.visible, updatePosition]
  );

  const handleMouseEnter = useCallback(
    (cell: Cell, e: React.MouseEvent) => {
      if (tooltipState.isTouchMode) return;

      // Clear any pending hide timeout
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        setHideTimeout(null);
      }

      // Calculate initial position
      const initialX = e.clientX + offset.x;
      const initialY = e.clientY + offset.y;

      const showTooltip = () => {
        setTooltipState({
          cell,
          position: { x: initialX, y: initialY },
          visible: true,
          isTouchMode: false,
        });
      };

      if (showDelay > 0) {
        const timeout = setTimeout(showTooltip, showDelay);
        setShowTimeout(timeout);
      } else {
        showTooltip();
      }
    },
    [tooltipState.isTouchMode, hideTimeout, offset.x, offset.y, showDelay]
  );

  const handleMouseLeave = useCallback(() => {
    if (tooltipState.isTouchMode) return;

    // Clear any pending show timeout
    if (showTimeout) {
      clearTimeout(showTimeout);
      setShowTimeout(null);
    }

    const hideTooltipFn = () => {
      setTooltipState((prev) => ({
        ...prev,
        cell: null,
        visible: false,
      }));
    };

    if (hideDelay > 0) {
      const timeout = setTimeout(hideTooltipFn, hideDelay);
      setHideTimeout(timeout);
    } else {
      hideTooltipFn();
    }
  }, [tooltipState.isTouchMode, showTimeout, hideDelay]);

  const handleTouchStart = useCallback(
    (cell: Cell, e: React.TouchEvent) => {
      if (!enableTouch) return;

      e.preventDefault();

      const touch = e.touches[0];
      if (!touch) return;

      // Position tooltip near the touch point
      const touchX = touch.clientX;
      const touchY = touch.clientY;

      setTooltipState({
        cell,
        position: {
          x: touchX + offset.x,
          y: touchY + offset.y,
        },
        visible: true,
        isTouchMode: true,
      });
    },
    [enableTouch, offset.x, offset.y]
  );

  const handleTouchEnd = useCallback(() => {
    if (!enableTouch) return;

    // On touch devices, tooltip stays visible until another touch or explicit hide
    // This is intentional for better mobile UX
  }, [enableTouch]);

  const hideTooltip = useCallback(() => {
    setTooltipState((prev) => ({
      ...prev,
      cell: null,
      visible: false,
    }));
  }, []);

  const setTooltipCell = useCallback((cell: Cell | null) => {
    setTooltipState((prev) => ({
      ...prev,
      cell,
      visible: cell !== null,
    }));
  }, []);

  return {
    tooltipState,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleTouchStart,
    handleTouchEnd,
    hideTooltip,
    setTooltipCell,
  };
}
