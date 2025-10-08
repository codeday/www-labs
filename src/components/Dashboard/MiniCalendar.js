import { useColorModeValue } from '@codeday/topo/Theme';
import { Box, Heading, List, ListItem, Text } from "@codeday/topo/Atom";
import group from 'array.prototype.group';
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

export function MiniCalendar({ events }) {
  const bg = useColorModeValue('blue.50', 'blue.900');
  const borderColor = useColorModeValue('blue.700', 'blue.600');
  const color = useColorModeValue('blue.900', 'blue.50');
  const colorLight = useColorModeValue('blue.600', 'blue.700');
  const [now, setNow] = useState(DateTime.now());

  const dates = useMemo(() => (
    group(
      events.map(e => ({
        ...e,
        displayDate: e.date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
      })),
      (e) => e.displayDate,
    )
  ), [events, typeof window]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const interval = setInterval(() => setNow(DateTime.now()), 1000 * 60 * 5);
    return () => clearInterval(interval);
  }, [setNow, typeof window]);

  return (
    <Box p={4} bg={bg} borderColor={borderColor} borderWidth={1} color={color} rounded="sm">
      <Heading as="h3" fontSize="md" mb={2}>Calendar</Heading>
      <List styleType="disc" pl={6}>
        {Object.entries(dates).map(([date, entries]) => (
          <ListItem key={date} mb={2} {...(entries[0].date < now ? { color: colorLight } : { color: color })}>
            <Text fontWeight="bold">
              {date}
            </Text>
            {entries.map(e => (
              <Text>{e.name}</Text>
            ))}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}