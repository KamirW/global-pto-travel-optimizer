import { useState, useEffect } from 'react';

/**
 * Custom hook to detect if the screen size is mobile
 * Returns true if screen width is less than 768px (Tailwind md breakpoint)
 */
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check initial screen size
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();

    // Add event listener for window resize
    const handleResize = () => {
      checkMobile();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isMobile;
};

export default useIsMobile;
