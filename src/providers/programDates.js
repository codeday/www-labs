import { DateTime } from 'luxon';
import { useQuery } from './query';

const wrapDt = (dict) => Object.keys(dict).reduce((accum, k) => ({ ...accum, [k]: DateTime.fromISO(dict[k]) }), {});
export const useProgramDates = () => {
  const dates = wrapDt(useQuery('cms.programDates.items.0' || {}));
  return {
    ...dates,
    mentoringStartsAt: dates.startsAt.plus({ weeks: 1 }),
    extendedProgramEndsAt: dates.startsAt.plus({ weeks: 12 }),
    mentorApplicationEndsAt: dates.startsAt.plus({ weeks: -2 }),
    mentorApplicationWarningAt: dates.startsAt.plus({ weeks: -3 }),
  };
}
