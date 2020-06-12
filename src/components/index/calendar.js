import Box, { Grid, Content } from '@codeday/topo/Box';
import Text, { Heading, Link } from '@codeday/topo/Text';
import moment from 'moment-timezone';

export default ({ calendar, title, border }) => {
  const eventsByDay = {};
  calendar.forEach((e) => {
    const day = e.Date.clone().startOf('day').format('YYYY-MM-DD');
    if (!(day in eventsByDay)) eventsByDay[day] = [];
    eventsByDay[day].push(e);
  });

  const displayStarts = moment('2020-07-06T12:00:00-05:00');
  const displayEnds = moment('2020-07-31T12:00:00-05:00');
  const drawDays = [];
  let day = displayStarts.clone();
  while(day.isSameOrBefore(displayEnds)) {
    if (day.isoWeekday() < 6)
      drawDays.push(day.startOf('day'));
    day = day.clone().add(1, 'day');
  }

  return (
    <>
      { title && (
        <Content>
          <Heading paddingBottom={3} textAlign="center">A full calendar of events.</Heading>
          <Text textAlign="center" paddingBottom={6}>
            It's not all project work, you'll get to talk to leaders from the tech industry.
          </Text>
        </Content>
      )}
      <Content maxWidth="containers.xl">
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(5, 1fr)" }}
          borderWidth={{ base: 0, md: border ? 1 : 0 }}
          borderBottom={0}
          borderColor="gray.100">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
              <Box
                fontSize="sm"
                display={{base: 'none', md: 'block'}}
                textAlign="center"
                color="gray.500"
                borderColor="gray.100"
                borderLeftWidth={day === 'Monday' ? 0 : 1}
              >
                {day}
              </Box>
            ))}
            {drawDays.map((date) => (
              <Box
                borderColor="gray.100"
                borderBottomWidth={1}
                marginTop={{ base: 4, md: 0 }}
                borderLeftWidth={{ base: 0, md: date.isoWeekday() === 1 ? 0 : 1}}
                pt={1}
              >
                <Box fontSize="sm" color="gray.500" textAlign="center">{date.format('MMM D')}</Box>
                {eventsByDay[date.format('YYYY-MM-DD')].sort((a, b) => a.Date.isAfter(b.Date) ? 1 : -1).map((event) => {
                  const baseColor = {
                    'Event': 'gray',
                    'Tech Talk': 'orange',
                    'Career Panel/Workshop': 'purple',
                    'Expert Lunch': 'blue',
                    'Watch Party': 'yellow',
                  }[event.Type || ''] || 'gray';

                  return (
                    <Box
                      m={4}
                      borderWidth={1}
                      borderRadius="sm"
                      borderColor={`${baseColor}.200`}
                      backgroundColor={`${baseColor}.50`}
                    >
                      <Box
                        p={2}
                        pb={1}
                        color={`${baseColor}.800`}
                        fontSize="xs"
                        fontWeight="bold"
                        backgroundColor={`${baseColor}.200`}
                        marginBottom={2}
                        borderBottomWidth={1}
                        borderColor={`${baseColor}.200`}
                      >
                        {event.Type}
                      </Box>
                      <Box pl={2} pr={2} pb={1} fontSize="sm" fontWeight="bold" color={`${baseColor}.900`}>
                        {event.Title || 'TBA'}
                      </Box>
                      <Box pl={2} pr={2} pb={3} fontSize="sm" color={`${baseColor}.700`}>
                        {event.Speakers && event.Speakers.split("\n").filter((e) => e).join(', ')}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            ))}
        </Grid>
      </Content>
    </>
  )
};
