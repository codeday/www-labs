import { DateTime } from 'luxon';
import { useInterval } from './useInterval';

export function useDateTime(fn, deps) {
  useInterval(() => fn(DateTime.now()), 1000, deps);
}