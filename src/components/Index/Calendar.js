import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Content from '@codeday/topo/Molecule/Content';
import { DateTime } from 'luxon';
import { useQuery } from '../../providers';

const COLORS = {
  'Tech Talk': `blue.600`,
  'Career Talk': 'green.600',
  'Expert Lunch': 'pink.600',
};

export default function Calendar(props) {
  const { thisYear, lastYear } = useQuery('calendar');
  const eventsThisYear = thisYear && thisYear.length > 0;
  const events = eventsThisYear ? thisYear : lastYear;

  if (!events || events.length === 0) return <></>;

  return (
    <Content {...props}>
      <Box textAlign="center" mb={8}>
        <Heading as="h3">Learn From Experts &amp; Build Your Network</Heading>
        {!eventsThisYear && (
          <Text mb={0}>This year's talk schedule hasn't been released yet, so have a look at last year's lineup:</Text>
        )}
      </Box>
      <Grid gap={8} templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'}}>
        {events.map((e) => {
          const [typeOrName, name] = e.title.split(': ', 2);
          const c = COLORS[typeOrName] || 'gray.700';

          return (
            <Box>
              {name && (
                <Box
                  d="inline-block"
                  rounded="sm"
                  p={1}
                  pl={2}
                  pr={2}
                  fontSize="sm"
                  bg={c}
                  color="white"
                >
                  {typeOrName}
                </Box>
              )}
              <Text mb={0} fontSize="sm" color="current.textLight">
                {DateTime.fromISO(e.start).toLocaleString(DateTime.DATETIME_MED)}
              </Text>
              <Text bold mb={0}>{name || typeOrName}</Text>
            </Box>
          )
        })}
      </Grid>
    </Content>
  )
}
