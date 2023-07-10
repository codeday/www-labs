import { useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { Box, Grid, Image, Text, Heading, Link, Spinner, Button} from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import { DashboardQuery } from './index.gql';
import MentorStats from '../../../../components/Dashboard/MentorStats';
import { useColorMode } from '@chakra-ui/react';

function MentorIndicator({ status }) {
  const color = {
    'APPLIED': 'red',
    'REJECTED': 'gray',
    'CANCELED': 'gray',
    'SCHEDULED': 'purple',
    'ACCEPTED': 'gray',
  }[status || 'CANCELED'] || 'red';

  return (
    <Box bg={`${color}.700`} rounded="full" size={3} p={1} d="inline-block" color={`${color}.50`} />
  );
}

function ProjectIndicator({ status, track }) {
  const color = {
    'DRAFT': 'red',
    'PROPOSED': 'purple',
    'ACCEPTED': 'gray',
    'MATCHED': 'gray',
  }[status || 'CANCELED'] || 'red';

  return (
    <Box bg={`${color}.700`} rounded="sm" fontSize="sm" d="inline-block" p={1} m={1} color={`${color}.50`}>
      {track[0]}{track.slice(1).toLowerCase()}
    </Box>
  );
}

export default function MentorDashboard() {
  const { query } = useRouter();
  const { isValidating, data } = useSwr(print(DashboardQuery), {}, { refreshInterval: 1000 * 30 });
  const [lastUpdated, setLastUpdated] = useState(DateTime.local());
  const { colorMode } = useColorMode();
  useEffect(() => {
    if (typeof window !== 'undefined' && !isValidating) setLastUpdated(DateTime.local());
  }, [typeof window, isValidating]);

  if (!data?.labs) return <Page title="Mentor Manager Dashboard"><Content textAlign="center"><Spinner /></Content></Page>;

  const { sid: myUsername } = decode(query.token) || {};

  const sortedMentors = (data.labs.mentors || [])
    .sort((a, b) => {
      if (['CANCELED', 'REJECTED'].includes(a.status) && !['CANCELED', 'REJECTED'].includes(b.status)) return 1;
      if (!['CANCELED', 'REJECTED'].includes(a.status) && ['CANCELED', 'REJECTED'].includes(b.status)) return -1;
      if (myUsername && a.manager?.username === myUsername && b.manager?.username !== myUsername) return -1;
      if (myUsername && a.manager?.username !== myUsername && b.manager?.username === myUsername) return 1;
      if (myUsername && !a.manager?.username && b.manager?.username) return -1;
      if (myUsername && a.manager?.username && !b.manager?.username) return 1;
      if (a.manager && !b.manager) return -1;
      if (!a.manager && b.manager) return 1;
      if (a.manager?.name !== b.manager?.name) return a.manager?.name > b.manager?.name ? 1 : -1;
      if (a.status === 'APPLIED' && b.status !== 'APPLIED') return -1;
      if (a.status !== 'APPLIED' && b.status === 'APPLIED') return 1;
      if (a.status === 'SCHEDULED' && b.status !== 'SCHEDULED') return -1;
      if (a.status !== 'SCHEDULD' && b.status === 'SCHEDULED') return 1;
      return a.status > b.status ? 1 : -1;
    });

  return (
    <Page title="Mentor Manager Dashboard">
      <Content mt={-8}>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }}>
          <Heading as="h2" fontSize="3xl" mb={4}>Mentor Manager Dashboard</Heading>
          <Box textAlign="right">
            {isValidating ? <Spinner /> : (
              <>
                Updated {lastUpdated.toLocaleString({
                  day: 'numeric',
                  month: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric'
                })}
              </>
            )}
          </Box>
        </Grid>
        <MentorStats mentors={sortedMentors} />
        <Box textAlign="right">
          <Button as="a" fontSize="sm" href={`/dash/mm/${query.token}/students`} target="_blank" mb={8} mr={4}>
            All Students &raquo;
          </Button>
          <Button as="a" fontSize="sm" href={`/dash/mm/${query.token}/status`} target="_blank" mb={8}>
            Student Reflections &raquo;
          </Button>
          <Button as="a" fontSize="sm" href={`/dash/mm/${query.token}/mentor-surveys`} target="_blank" mb={8}>
            Mentor Reflections &raquo;
          </Button>
        </Box>
        <Box as="table" w="100%">
          <Box as="tr" fontWeight="bold" textAlign="left" borderBottomColor="black" borderBottomWidth={1}>
            <Box as="th">Name</Box>
            <Box as="th">Email</Box>
            <Box as="th">Manager</Box>
            <Box as="th" textAlign="center">Projects</Box>
          </Box>
          {sortedMentors.map((mentor, id) => (
            <Box as="tr" bg={id % 2 === 1 ? ( colorMode === 'dark' ? 'gray.900' : 'gray.50') : undefined} borderBottomWidth={1}>
              <Box
                as="td"
                bold
                textDecoration={['REJECTED', 'CANCELED'].includes(mentor.status) ? 'line-through' : undefined}
              >
                <MentorIndicator status={mentor.status} />
                <Link as="a" href={`/dash/mm/${query.token}/${mentor.id}`} p={3} d="inline-block">
                  {mentor.name}
                </Link>
              </Box>
              <Box as="td">
                <Link as="a" href={`mailto:${mentor.email}`}>
                  {mentor.email}
                </Link>
              </Box>
              <Box as="td">
                {mentor.manager && (
                  <>
                    <Image src={mentor.manager.picture} d="inline-block" h="1.2em" mr={1} alt="" />
                    {mentor.manager.name}
                  </>
                )}
              </Box>
              <Box as="td" textAlign="center" pb={2} pt={2} verticalAlign="bottom">
                {!['CANCELED', 'REJECTED', 'APPLIED', 'SCHEDULED'].includes(mentor.status) && mentor.projects.map(({ status, track }) => (
                  <ProjectIndicator status={status} track={track} />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Content>
    </Page>
  );
}
