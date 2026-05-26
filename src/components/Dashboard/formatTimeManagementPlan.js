const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatMinutes(minutes) {
  return `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padEnd(2, '0')}`;
}

export function formatTimeManagementPlanDay(plan, day) {
  return plan[day.toLowerCase()]
    .map(({ start, end }) => `${formatMinutes(start)} to ${formatMinutes(end)}`)
    .join('; ');
}

export { DAYS };
