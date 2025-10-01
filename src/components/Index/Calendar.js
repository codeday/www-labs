import { Box, Grid, Text, Heading, Select } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { DateTime } from 'luxon';
import { useState } from 'react';
import { useQuery } from '../../providers';

const COLORS = {
  'Tech Talk': `blue.600`,
  'Career Talk': 'pink.600',
  'AMA': 'purple.600',
  'Onboarding': 'green.600',
  'Meta': 'green.600',
};

export default function Calendar({ primary, ...props }) {
  const { thisYear, lastYear } = useQuery('calendar');
  const eventsThisYear = thisYear && thisYear.length > 0;
  const events = eventsThisYear ? thisYear : lastYear;
  const [filterType, setFilterType] = useState(null);

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
      {primary && (
        <Box textAlign="right" mb={8}>
          Show only:
          <Box display="inline-block" w="xs">
            <Select ml={2} size="sm" onChange={(e) => setFilterType(e.target.value)}>
              <option value=""></option>
              {Object.keys(COLORS).map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>
          </Box>
        </Box>
      )}
      <Grid gap={8} templateColumns={{ base: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)'}}>
        {events.map((e) => {
          const [typeOrName, ...nameRest] = e.title.split(': ');
          const c = COLORS[typeOrName] || 'gray.700';
          const name = nameRest.join(': ');
          const presenter = e?.metadata?.presenter;
          if (filterType && typeOrName !== filterType) return <></>;

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
            <Grid templateColumns="1fr 1fr" mb={4}>
              <Box>
                <Text mb={0} fontSize="sm" color="current.textLight" fontWeight="bold">
                  {DateTime.fromISO(e.start).toLocaleString({ month: 'long', day: 'numeric', weekday: 'long'})}
                </Text>
                <Text mb={0} fontSize="sm" color="current.textLight">
                  {DateTime.fromISO(e.start).toLocaleString({ hour: 'numeric', minute: 'numeric', timeZoneName: 'short' })}
                </Text>
              {typeof e.subscriberCount === 'number' && (
                <Text mb={0} fontSize="sm" color="current.textLight">
                  {e.subscriberCount} attending
                </Text>
              )}
              </Box>
              <Box textAlign="right">
                {name && (
                  <Box
                    display="inline-block"
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
              </Box>
              </Grid>
              <Text bold mb={0}>{name || typeOrName}</Text>
              {presenter && <Text mt={2}>Presented by {presenter}</Text>}
            </Box>
          )
        })}
      </Grid>
    </Content>
  )
}
