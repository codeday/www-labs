import { useReducer } from 'react';

export function useSurveyResponses() {
  const [e, r] = useReducer((_prev, { response, ...keys }) => {
    return {
      ..._prev,
      [JSON.stringify(keys)]: { response, ...keys }
    };
  }, {});
  return [Object.values(e), r, (keys) => e[JSON.stringify(keys)]];
}
