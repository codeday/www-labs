import { print } from 'graphql';
import { Content } from '@codeday/topo/Molecule';
import { Box, Grid, Text, Heading, Link, Spinner } from '@codeday/topo/Atom';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import MentorProfile from '../../../../components/Dashboard/MentorProfile';
import ProjectEditor from '../../../../components/Dashboard/ProjectEditor';
import MentorManagerDetails from '../../../../components/Dashboard/MentorManagerDetails';
import { DashboardQuery } from './index.gql';

export default function MentorDashboard() {
  const { loading, error, data } = useSwr(print(DashboardQuery));
  if (!data?.labs?.mentor) return <Page title="Mentor Dashboard"><Content textAlign="center"><Spinner /></Content></Page>

  return (
    <Page title="Mentor Dashboard">
      <Content mt={-8}>
        <Heading as="h2" fontSize="3xl" mb={4}>
          Your Project{data.labs.mentor.projects.length !== 1 ? 's' : ''}
        </Heading>
      </Content>
      <Content>
        <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} alignItems="top" gap={8}>
          <Box>
            {data?.labs?.mentor?.projects && (
              <>
                {data?.labs?.mentor?.projects?.map((project) => (
                  <ProjectEditor
                    limited
                    tags={data.labs.tags}
                    project={project}
                    borderWidth={1}
                    p={4}
                    shadow="sm"
                    rounded="sm"
                    mb={2}
                  />
                ))}
              </>
            )}
          </Box>
          <Box>
            <MentorManagerDetails mentor={data?.labs?.mentor} />
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}
