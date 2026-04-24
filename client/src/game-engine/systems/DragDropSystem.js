// file: client/src/game-engine/systems/DragDropSystem.js

import { useState, useCallback, useRef } from 'react';

/**
 * Basic drag-and-drop system using HTML5 Drag API.
 * Provides hooks for draggable items and drop zones.
 */

/**
 * Hook for draggable items.
 * Returns props to spread on the draggable element.
 */
export function useDraggable(data) {
  const handleDragStart = useCallback((e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(data));
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  }, [data]);

  const handleDragEnd = useCallback((e) => {
    e.target.style.opacity = '1';
  }, []);

  return {
    draggable: true,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
  };
}

/**
 * Hook for drop zones.
 * Returns props to spread on the drop zone element + state.
 */
export function useDropZone(onDrop) {
  const [isOver, setIsOver] = useState(false);
  const counterRef = useRef(0);

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    counterRef.current++;
    setIsOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    counterRef.current--;
    if (counterRef.current === 0) {
      setIsOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    counterRef.current = 0;
    setIsOver(false);
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      onDrop?.(data);
    } catch {
      // Silently ignore malformed data
    }
  }, [onDrop]);

  return {
    isOver,
    dropProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
}
