import { Box } from "@codeday/topo/Atom";
import { DateTime } from "luxon";
import { cautionFloatToString, cautionStringToColor } from "../../../utils";

function avg(numbers) {
  return numbers.reduce((a, b) => a + b, 0) / numbers.length;
}

function getRecentAverageCaution (statusEvents) {
  // If there are no events, return ok.
  console.log('a');
  if (!statusEvents || statusEvents.length === 0) return 0;
  console.log('b');

  const noDates = statusEvents.filter(e => !e.date);
  const withDates = statusEvents
    .filter(e => !!e.date)
    .sort((a, b) => a.date > b.date ? -1 : 1);

  // Add events from the last 10 days
  // TODO(@tylermenezes): we should have a way to calculate this dynamically
  const dateCutoff = DateTime.now().minus({ days: 10 }).startOf('day');
  const considerEvents = withDates.filter(e => e.date > dateCutoff);

  // If there are not enough dated events, add more from the dated list
  if (considerEvents.length < 5) {
    withDates.push(...withDates
      .filter(e => e.date < dateCutoff)
      .slice(0, Math.min(5 - considerEvents.length, withDates.length))
    );
  }

  // If there are still not enough dated events, add all undated ones
  if (considerEvents.length < 5) {
    considerEvents.push(...noDates);
  }

  return avg(considerEvents.map(e => e.caution));
}

export default function SummaryBadge({ statusEvents, ...props }) {
  const caution = getRecentAverageCaution(statusEvents);
  const cautionString = cautionFloatToString(caution);
  const color = cautionStringToColor(cautionString);

  return (
    <Box
      display="inline-block"
      rounded="full"
      w="0.5em"
      h="0.5em"
      mb="0.1em"
      backgroundColor={cautionString === 'ok' || !cautionString ? 'transparent' : `${color}.500`}
      borderColor={`${color}.500`}
      borderWidth={1}
      aria-label={cautionString}
      opacity={cautionString === 'ok' || !cautionString ? 0.4 : 1}
      {...props}
    />
  )
}