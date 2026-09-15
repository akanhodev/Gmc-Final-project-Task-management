import { useEffect, useState } from 'react';

/** True below `width` px. Drives the single-column layout. */
export default function useBreakpoint(width) {
  const w = width || 880;
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.innerWidth < w);
  useEffect(() => {
    const fit = () => setNarrow(window.innerWidth < w);
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [w]);
  return narrow;
}
