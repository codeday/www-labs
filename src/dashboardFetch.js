import useSwrNative from 'swr';
import { useRouter } from 'next/router';
import { apiFetch } from '@codeday/topo/utils';

export function useFetcher(variables) {
  const { query } = useRouter();
  if (!query.token) return () => { throw Error('No token specified') };
  return (q, v, h) => apiFetch(q, { ...v, ...variables }, {
    'X-Labs-Authorization': `Bearer ${query.token}`,
    ...h
  });
}

export function useSwr(query, variables, options) {
  const r = useRouter();
  return useSwrNative([query, null, null, r?.query?.token], useFetcher(variables), options);
}
