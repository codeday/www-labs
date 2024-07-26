import { useColorMode } from "@chakra-ui/react";
import { Box, Heading, List, ListItem, Text } from "@codeday/topo/Atom";
import group from 'array.prototype.group';
import { DateTime } from "luxon";
import { useEffect, useMemo, useState } from "react";

export function MiniCalendar({ events }) {
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';
  const bg = dark ? 900 : 50;
  const borderColor = dark ? 600 : 700;
  const color = dark ? 50 : 900;
  const colorLight = dark ? 600 : 700;
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
    <Box p={4} bg={`blue.${bg}`} borderColor={`blue.${borderColor}`} borderWidth={1} color={`blue.${color}`} rounded="sm">
      <Heading as="h3" fontSize="md" mb={2}>Calendar</Heading>
      <List styleType="disc" pl={6}>
        {Object.entries(dates).map(([date, entries]) => (
          <ListItem key={date} mb={2} {...(entries[0].date < now ? { color: `blue.${colorLight}` } : { color: `blue.${color}` })}>
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