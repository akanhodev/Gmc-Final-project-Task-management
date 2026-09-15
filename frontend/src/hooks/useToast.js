import { useCallback, useEffect, useRef, useState } from 'react';

export default function useToast(ms) {
  const [toast, setToast] = useState('');
  const timer = useRef(null);
  const say = useCallback((msg) => {
    setToast(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(''), ms || 2400);
  }, [ms]);
  useEffect(() => () => timer.current && clearTimeout(timer.current), []);
  return [toast, say];
}
