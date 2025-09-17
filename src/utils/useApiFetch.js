import { useState } from 'react';
import { apiFetch } from "@codeday/topo/utils";
import { useClientEffect } from "./useClientEffect";

export function useApiFetch(query, variables, headersOrToken) {
  const [result, setResult] = useState(null);

  useClientEffect(() => {
    if (!headersOrToken) return;
    const headers = typeof headersOrToken === 'string'
      ? { 'X-Labs-Authorization': `Bearer ${headersOrToken}` }
      : headersOrToken;
    apiFetch(query, variables, headers)
      .then(r => setResult(r));
  }, [query, JSON.stringify(variables), headersOrToken]);

  return result;
}