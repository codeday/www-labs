import { Box, Heading, List, ListItem, Text } from "@codeday/topo/Atom";
import group from 'array.prototype.group';
import { DateTime } from "luxon";
import { useMemo } from "react";

export function MiniCalendar({ events }) {
  const dates = useMemo(() => (
    group(
      events.map(e => ({
        ...e,
        displayDate: e.date.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY),
      })),
      (e) => e.displayDate,
    )
  ), [events, typeof window]);

  return (
    <Box p={4} mt={8} bg="purple.50" borderColor="purple.700" borderWidth={1} color="purple.900" mb={8}>
      <Heading as="h3" fontSize="md" mb={2}>Calendar</Heading>
      <List styleType="disc" pl={6}>
        {Object.entries(dates).map(([date, entries]) => (
          <ListItem key={date}>
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