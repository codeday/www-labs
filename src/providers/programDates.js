import { DateTime } from 'luxon';
import { useQuery } from './query';

const wrapDt = (dict) => Object.keys(dict).reduce((accum, k) => ({ ...accum, [k]: DateTime.fromISO(dict[k]) }), {});
export const useProgramDates = () => {
  const dates = wrapDt(useQuery('cms.programDates.items.0' || {}));
  let mentoringStartsAt = dates.startsAt.plus({ weeks: 1 });
  if (mentoringStartsAt.month === 7 && mentoringStartsAt.day === 4) {
    mentoringStartsAt = mentoringStartsAt.plus({ days: 1});
  }
  return {
    ...dates,
    mentoringStartsAt,
    extendedProgramEndsAt: dates.startsAt.plus({ weeks: 12 }),
    mentorApplicationEndsAt: dates.startsAt.plus({ weeks: -2 }),
    mentorApplicationFocusAt: dates.startsAt.plus({ weeks: -6 }),
    mentorApplicationWarningAt: dates.startsAt.plus({ weeks: -1 }),
  };
}
