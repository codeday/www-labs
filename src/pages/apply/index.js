import { print } from 'graphql';
import { Text, Button, List, ListItem, Heading } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../components/Page';
import Info from '@codeday/topocons/Icon/UiInfo';
import { UpcomingEventsQuery } from './index.gql';
import { DateTime } from 'luxon';
import { Box, Icon, Tooltip } from '@chakra-ui/react';

const TRACK_DESCRIPTIONS = {
  beginner: `This is the right track for you if you're a college student who has completed some CS classes but hasn't built anything independently and without step-by-step guidance.`,
  intermediate: `This is the right track for you if you're a college student who has completed 101/102-level CS classes but not much more (or a high school student who's participated in hackathons).`,
  advanced: `This is the right track for you if you're a college student with experience beyond the 101/102-level CS classes, or a student who has built projects on your own time (e.g. hackathons).`,
};

export default function ApplyHome({ events }) {
  return (
    <Page slug="/apply" title="Apply">
      <Content mt={-8}>
        <Box bg="blue.50" borderColor="blue.200" borderWidth={2} borderRadius={2} p={4} mb={8} color="blue.800">
          <Text mb={4}>
            This page only lists CodeDay Labs sessions with publicly available applications.
            Some colleges have private partner programs.
          </Text>
          <Text mb={0}>
            If your school provided you with an invitation link, please use that to
            apply.
          </Text>
        </Box>
        {events.length > 0 ? (
          <>
            <Text mb={8}>
              Applications are open for the following:
            </Text>
            <List>
              {events.map(e => (
                <ListItem mb={4}>
                  <Heading fontSize="xl" mb={1}>{e.name}</Heading>
                  {DateTime.fromISO(e.startsAt).toLocaleString(DateTime.DATE_MED)}
                  &mdash;
                  {DateTime.fromISO(e.startsAt).plus({ weeks: e.defaultWeeks }).toLocaleString(DateTime.DATE_MED)}<br />
                  <strong>Apply:</strong>
                  {[['beginner', e.hasBeginner], ['intermediate', e.hasIntermediate], ['advanced', e.hasAdvanced]].filter(t => t[1]).map(t => (
                    <Box key={t[0]} display="inline-block">
                      <Button
                        as="a"
                        href={`/apply/${e.id}/${t[0]}`}
                        colorScheme="gray"
                        ml={4}
                        mr={2}
                        size="sm"
                      >
                        {t[0][0].toUpperCase()}{t[0].slice(1)} Track
                      </Button>
                      <Tooltip shouldWrapChildren label={TRACK_DESCRIPTIONS[t[0]]} placement="bottom">
                        <Icon as={Info} />
                      </Tooltip>
                    </Box>
                  ))}
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <Text>
            Applications are not currently open.
          </Text>
        )}
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  const data = await apiFetch(print(UpcomingEventsQuery));

  return {
    props: {
      events: data?.labs?.events || [],
      random: Math.random(),
    },
    revalidate: 240,
  };
}
