import { print } from 'graphql';
import { Text, Button, List, ListItem } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../components/Page';
import CheckApplicationsOpen from '../../components/CheckApplicationsOpen';
import { UpcomingEventsQuery } from './index.gql';
import { DateTime } from 'luxon';
import { Box } from '@chakra-ui/react';

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
                  <strong>{e.name}</strong><br />
                  {DateTime.fromISO(e.startsAt).toLocaleString(DateTime.DATE_MED)}
                  &mdash;
                  {DateTime.fromISO(e.startsAt).plus({ weeks: e.defaultWeeks }).toLocaleString(DateTime.DATE_MED)}<br />
                  <Button as="a" href={`/apply/${e.id}/advanced`} colorScheme="green">Apply Now</Button>
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
