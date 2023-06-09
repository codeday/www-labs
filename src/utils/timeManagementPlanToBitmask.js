import { getTimezoneOffset } from "./getTimezoneOffset";

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const RESOLUTION_MINS = 30;
const BITS_PER_HOUR = 60/RESOLUTION_MINS;

export function timeManagementPlanToBitmask(timeManagementPlan, timezone) {
  if (!timeManagementPlan || !timezone) return '';

  let bitmask = [].fill(0, 0, BITS_PER_HOUR * 24 * DAY_NAMES.length);

  // Fill out the array
  for (let dayNumber = 0; dayNumber < DAY_NAMES.length; dayNumber++) {
    const dayPlan = timeManagementPlan[DAY_NAMES[dayNumber]];
    const dayBitOffset = BITS_PER_HOUR * 24 * dayNumber;

    for (const { start, end } of dayPlan) {
      const startBit = (start / RESOLUTION_MINS) + dayBitOffset;
      const endBit = (end / RESOLUTION_MINS) + dayBitOffset;

      for (let i = startBit; i < endBit; i++) {
        bitmask[i] = 1;
      }
    }
  }

  const timezoneBitOffset = getTimezoneOffset(timezone) / RESOLUTION_MINS;
  if (timezoneBitOffset > 0) {
    // Grab the beginning of the array and move it to the end
    const tmp = bitmask.slice(0, timezoneBitOffset);
    bitmask = [
      ...bitmask.slice(timezoneBitOffset),
      ...tmp,
    ];

  } else if (timezoneBitOffset < 0) {
    // Grab the end of the array and move it to the beginning.
    // (timezoneBitOffset is already negative so we don't need to *-1)
    const tmp = bitmask.slice(timezoneBitOffset);
    bitmask = [
      ...tmp,
      ...bitmask.slice(0, bitmask.length + timezoneBitOffset),
    ];
  }


  // Convert into actual ints
  const out = new Uint8Array(Math.ceil(bitmask.length / 8));
  for (let i = 0; i < bitmask.length; i += 8) {
    out[i/8] = (
      (bitmask[i] || 0) << 7
      | ((bitmask[i+1] || 0) << 6)
      | ((bitmask[i+2] || 0) << 5)
      | ((bitmask[i+3] || 0) << 4)
      | ((bitmask[i+4] || 0) << 3)
      | ((bitmask[i+5] || 0) << 2)
      | ((bitmask[i+6] || 0) << 1)
      | (bitmask[i+7] || 0)
    );
  }


  return Buffer.from(out).toString('base64');
}