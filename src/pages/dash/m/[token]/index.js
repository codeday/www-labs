import { print } from 'graphql';
import { useMemo } from 'react';
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

  const dueSurveys = useMemo(() =>
    (
      (data?.labs?.surveys || [])
        .flatMap((s) => (
          s.occurrences
            .sort((a, b) => DateTime.fromISO(a.dueAt) > DateTime.fromISO(b.dueAt) ? -1 : 1)
            .slice(0,1)
            .map((o) => ({ survey: s, ...o }))
        ))
        .filter((o) => (
          (o.surveyResponses || [])
            .filter((r) => r.authorMentorId === data?.labs?.mentor?.id).length === 0)
        )
    ),
    [data?.labs?.surveys]
  );

  if (error?.message && error?.message.includes('{')) {
    return <Page title="Mentor Dashboard"><Content textAlign="center"><Text>{error.message.split('{')[0]}</Text></Content></Page>
  }
  if (!data?.labs?.mentor) return <Page title="Mentor Dashboard"><Content textAlign="center"><Spinner /></Content></Page>;

  return (
    <Page title="Mentor Dashboard">
      <Content mt={-8}>
        <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} alignItems="top" gap={8}>
          <Box>
            <Heading as="h2" fontSize="3xl" mb={4}>
              Your Profile
            </Heading>
            <MentorProfile
              mentor={data.labs.mentor}
              limited
              borderWidth={1}
              p={4}
              shadow="sm"
              rounded="sm"
              mb={2}
            />
            <Heading as="h2" fontSize="3xl" mb={4} mt={8}>
              Your Project{data.labs.mentor.projects.length !== 1 ? 's' : ''}
            </Heading>
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
            {dueSurveys.length !== 0 && (
              <Box p={4} mt={8} bg="red.50" borderColor="red.700" borderWidth={1} color="red.900" mb={8}>
                <Heading as="h3" fontSize="md" mb={2}>Due Check-Ins, Reflections, &amp; Surveys</Heading>
                <List styleType="disc" pl={6}>
                  {dueSurveys.map((o) => (
                      <ListItem key={o.id}>
                        <Link href={`/dash/m/${query.token}/survey/${o.survey.id}/${o.id}`} target="_blank">
                          <Text d="inline" fontWeight="bold">{o.survey.name}</Text>
                          <Text fontSize="sm">due {DateTime.fromISO(o.dueAt).toLocaleString(DateTime.DATE_MED)}</Text>
                        </Link>
                      </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}
