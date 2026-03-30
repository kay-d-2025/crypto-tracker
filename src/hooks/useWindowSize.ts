// src/hooks/useWindowSize.ts
// A custom hook that tracks the current window dimensions.
// We use this to conditionally apply mobile styles throughout the app
// rather than using CSS media queries — keeps styling co-located with
// the components that use it since we're using inline styles.

import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;   // < 640px
  isTablet: boolean;   // 640px - 1024px
  isDesktop: boolean;  // > 1024px
}

const useWindowSize = (): WindowSize => {
  const [size, setSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
    isMobile: window.innerWidth < 640,
    isTablet: window.innerWidth >= 640 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setSize({
        width,
        height: window.innerHeight,
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
      });
    };

    window.addEventListener('resize', handleResize);
    // Cleanup listener when component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};

export default useWindowSize;