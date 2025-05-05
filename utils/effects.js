import { useEffect, useRef } from 'react';

// run useEFFect only after the first render
export function useUpdateEffect(effect, deps) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    return effect();
  }, deps);
}