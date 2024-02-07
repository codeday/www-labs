import { useMemo } from 'react';
import { DateTime } from 'luxon';

export function useIso(timestamp) {
  return useMemo(
    () => timestamp ? DateTime.fromISO(timestamp) : null,
    [ timestamp ],
  );
}