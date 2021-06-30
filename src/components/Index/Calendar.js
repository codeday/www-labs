import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import { DateTime } from 'luxon';
import { useQuery } from '../../providers';

const COLORS = {
  'Tech Talk': `blue.600`,
  'Career Talk': 'pink.600',
  'Expert Lunch': 'purple.600',
  'AMA': 'purple.600',
  'Onboarding': 'green.600',
  'Meta': 'green.600',
};

export default function Calendar({ primary, ...props }) {
  const { thisYear, lastYear } = useQuery('calendar');
  const eventsThisYear = thisYear && thisYear.length > 0;
  const events = eventsThisYear ? thisYear : lastYear;

  if (!events || events.length === 0) return <></>;

  return (
    <Content {...props}>
      <Box textAlign="center" mb={8}>
        {primary ? (
          <Heading as="h3" fontSize="5xl">Talk Schedule</Heading>
        ) : (
          <Heading as="h3">Learn From Experts &amp; Build Your Network</Heading>
        )}
        {!eventsThisYear && (
          <Text mb={0}>This year's talk schedule hasn't been released yet, so have a look at last year's lineup:</Text>
        )}
      </Box>
      <Grid gap={8} templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'}}>
        {events.map((e) => {
          const [typeOrName, ...nameRest] = e.title.split(': ');
          const c = COLORS[typeOrName] || 'gray.700';
          const name = nameRest.join(': ');

          return (
            <Box
              as="a"
              href={`https://www.codeday.org/e/labs/${e.id}`}
              target="_blank"
              shadow={primary ? 'sm' : undefined}
              borderWidth={primary ? 1 : 0}
              p={primary ? 4 : 0}
              pb={primary ? 4 : 2}
            >
              {name && (
                <Box
                  d="inline-block"
                  rounded="sm"
                  p={1}
                  pl={2}
                  pr={2}
                  mb={2}
                  fontSize="sm"
                  bg={c}
                  color="white"
                >
                  {typeOrName}
                </Box>
              )}
              <Text mb={0} fontSize="sm" color="current.textLight" fontWeight="bold">
                {DateTime.fromISO(e.start).toLocaleString({ month: 'long', day: 'numeric', weekday: 'long'})}
              </Text>
              <Text mb={0} fontSize="sm" color="current.textLight">
                {DateTime.fromISO(e.start).toLocaleString({ hour: 'numeric', minute: 'numeric', timeZoneName: 'short' })}
              </Text>
              <Text bold mt={2} mb={0}>{name || typeOrName}</Text>
            </Box>
          )
        })}
      </Grid>
    </Content>
  )
}
