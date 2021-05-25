import { print } from 'graphql';
import { useRouter } from 'next/router';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Image from '@codeday/topo/Atom/Image';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Spinner from '@codeday/topo/Atom/Spinner';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import { DashboardQuery } from './index.gql';

function MentorIndicator({ status }) {
  const color = {
    'APPLIED': 'red',
    'REJECTED': 'red',
    'CANCELED': 'red',
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
    <Box bg={`${color}.700`} rounded="sm" fontSize="sm" d="inline-block" p={1} m={1} color={`${color}.50`}>{track}</Box>
  );
}

export default function MentorDashboard() {
  const { query } = useRouter();
  const { loading, error, data } = useSwr(print(DashboardQuery));
  if (!data?.labs) return <Page title="Mentor Manager Dashboard"><Content><Spinner /></Content></Page>;

  const sortedMentors = (data.labs.mentors || [])
    .sort((a, b) => a.manager?.name > b.manager?.name ? -1 : 1);

  return (
    <Page title="Mentor Dashboard">
      <Content mt={-8}>
        <Heading as="h2" fontSize="3xl" mb={4}>Mentors Manager Dashboard</Heading>
        <Box as="table" w="100%">
          <Box as="tr" fontWeight="bold" textAlign="left" borderBottomColor="black" borderBottomWidth={1}>
            <Box as="th">Name</Box>
            <Box as="th">Email</Box>
            <Box as="th">Manager</Box>
            <Box as="th" textAlign="center">Projects</Box>
          </Box>
          {sortedMentors.map((mentor, id) => (
            <Box as="tr" bg={id % 2 === 1 ? 'gray.50' : undefined} borderBottomWidth={1}>
              <Box as="td" bold>
                <MentorIndicator status={mentor.status} />
                <Link as="a" href={`/dash/mm/${query.token}/${mentor.id}`} p={2}>
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
                {mentor.projects.map(({ status, track }) => <ProjectIndicator status={status} track={track} />)}
              </Box>
            </Box>
          ))}
        </Box>
      </Content>
    </Page>
  );
}
