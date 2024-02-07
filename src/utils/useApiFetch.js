import { useState } from 'react';
import { apiFetch } from "@codeday/topo/utils";
import { useClientEffect } from "./useClientEffect";

export function useApiFetch(query, variables, headersOrToken) {
  const [result, setResult] = useState(null);


  useClientEffect(async () => {
    if (!headersOrToken) return null;
    const headers = typeof headersOrToken === 'string'
      ? { 'X-Labs-Authorization': `Bearer ${headersOrToken}` }
      : headersOrToken;
    setResult(
      await apiFetch(query, variables, headers)
    );
  }, [query, JSON.stringify(variables), headersOrToken]);

  return result;
}