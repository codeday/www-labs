import { useClientEffect } from './useClientEffect';

export function useInterval(fn, interval, deps) {
  useClientEffect(() => {
    const intervalId = setInterval(fn, interval);
    return () => clearInterval(intervalId);
  }, [interval, deps]);
}