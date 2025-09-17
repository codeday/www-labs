import { useEffect } from "react";

export function useClientEffect(fn, deps) {
  const isClient = typeof window !== 'null';
  useEffect(() => {
    if (isClient) return fn();
    return;
  }, [ ...(deps || []), isClient ]);
}