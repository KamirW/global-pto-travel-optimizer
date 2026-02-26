import { useState } from 'react';

/**
 * Custom hook to handle button hover state
 * Works on both desktop (hover) and mobile (active/tap)
 * 
 * Usage:
 * const { isHovered, bind } = useButtonHover();
 * <button {...bind} className={isHovered ? 'bg-blue-700' : 'bg-blue-600'}>
 *   Click me
 * </button>
 */
export const useButtonHover = () => {
  const [isHovered, setIsHovered] = useState(false);

  return {
    isHovered,
    bind: {
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      onTouchStart: () => setIsHovered(true),
      onTouchEnd: () => setIsHovered(false),
    },
  };
};

export default useButtonHover;
