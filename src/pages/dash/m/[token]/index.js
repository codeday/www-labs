import { print } from 'graphql';
import { Content } from '@codeday/topo/Molecule';
import { Box, Grid, Text, Heading, Link, Spinner, List, ListItem } from '@codeday/topo/Atom';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import MentorProfile from '../../../../components/Dashboard/MentorProfile';
import ProjectEditor from '../../../../components/Dashboard/ProjectEditor';
import MentorManagerDetails from '../../../../components/Dashboard/MentorManagerDetails';
import { DashboardQuery } from './index.gql';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';

export default function MentorDashboard() {
  const { query } = useRouter();
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
            {data?.labs?.surveys && (
              <Box p={4} mt={8} bg="red.50" borderColor="red.700" borderWidth={1} color="red.900" mb={8}>
                <Heading as="h3" fontSize="md" mb={2}>Due Check-Ins, Reflections, &amp; Surveys</Heading>
                <List styleType="disc" pl={6}>
                  {data.labs.surveys.flatMap((s) => s.occurrences.sort((a, b) => DateTime.fromISO(a.dueAt) > DateTime.fromISO(b.dueAt) ? -1 : 1).slice(0,1).map((o) => {
                    if (o.surveyResponses.filter((r) => r.authorMentorId === data?.labs?.mentor?.id).length > 0) return <></>;
                    return (
                      <ListItem key={o.id}>
                        <Link href={`/dash/m/${query.token}/survey/${s.id}/${o.id}`} target="_blank">
                          <Text d="inline" fontWeight="bold">{s.name}</Text>
                          <Text fontSize="sm">due {DateTime.fromISO(o.dueAt).toLocaleString(DateTime.DATE_MED)}</Text>
                        </Link>
                      </ListItem>
                    );
                  }))}
                </List>
              </Box>
            )}
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}
