import { print } from 'graphql';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Spinner from '@codeday/topo/Atom/Spinner';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import MentorProfile from '../../../../components/Dashboard/MentorProfile';
import ProjectEditor from '../../../../components/Dashboard/ProjectEditor';
import MentorManagerDetails from '../../../../components/Dashboard/MentorManagerDetails';
import { DashboardQuery } from './index.gql';

export default function MentorDashboard() {
  const { loading, error, data } = useSwr(print(DashboardQuery));
  if (!data?.labs) return <Page title="Mentor Dashboard"><Content><Spinner /></Content></Page>

  return (
    <Page title="Mentor Dashboard">
      <Content mt={-8}>
        <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} alignItems="top" gap={8}>
          <Box>
            <MentorProfile mb={16} mentor={data?.labs?.mentor} />
            <Heading as="h3" fontSize="xl" mb={4}>Your Projects</Heading>
            {data?.labs?.mentor?.projects?.map((project) => <ProjectEditor project={project} />)}
          </Box>
          <Box>
            <MentorManagerDetails mentor={data?.labs?.mentor} />
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}
