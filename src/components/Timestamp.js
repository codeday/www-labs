import { useIso } from "../utils/useIso";
import { DateTime } from 'luxon';

function getFormat(date, time, format) {
  if (format) return format;
  if (date && time) return DateTime.DATETIME_MED;
  if (date) return DateTime.DATE_MED;
  if (time) return DateTime.TIME_SIMPLE;
  return DateTime.DATETIME_MED;
}

export default function Timestamp({ children, ts, date, time, format }) {
  const input = ts ?? children;
  const dateTime = typeof input === 'string'
    ? useIso(input)
    : input;

  return dateTime
    ? <>{dateTime.toLocaleString(getFormat(date, time, format))}</>
    : <></>;
}