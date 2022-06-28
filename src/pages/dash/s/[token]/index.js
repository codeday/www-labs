import { print } from 'graphql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Content } from '@codeday/topo/Molecule';
import { Text, Heading, Link, Button, Spinner, Box, Grid, List, ListItem } from '@codeday/topo/Atom';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import { StudentDashboardQuery } from './index.gql'
import { Match } from '../../../../components/Dashboard/Match';
import { DateTime } from 'luxon';

export default function Dashboard() {
  const { query } = useRouter();
  const { isValidating, data } = useSwr(print(StudentDashboardQuery));
  useEffect(() => {
    if (typeof window === 'undefined' || data?.labs?.student?.status !== 'ACCEPTED' ) return;
    if (
      (!data?.labs?.student?.projects || data.labs.student.projects.length === 0)
      && !(data?.labs?.projectPreferences && data.labs.projectPreferences.length > 0)
    ) window.location = `${window.location.href}/matching`;
  }, [ data?.labs?.projects, data?.labs?.projectPreferences, typeof window ]);

  if (isValidating || !data?.labs?.student) return (
    <Page title="Student Dashboard">
      <Content textAlign="center">
        <Spinner />
      </Content>
    </Page>
  );

  if (data?.labs?.student?.status !== 'ACCEPTED') return (
    <Page title="Student Dashboard">
      <Content textAlign="center">
        <Text>Your dashboard will become available if you are accepted to CodeDay Labs.</Text>
      </Content>
    </Page>
  );

  if (
    (data?.labs?.projectPreferences && data.labs.projectPreferences.length > 0)
    && (!data?.labs?.student?.projects || data.labs.student.projects.length === 0)
  ) return (
    <Page title="Student Dashboard">
      <Content textAlign="center">
        <Text>Your project preferences have been submitted! Check back once you've been matched.</Text>
      </Content>
    </Page>
  );


  if (data?.labs?.student?.projects && data.labs.student.projects.length > 0) return (
    <Page title="Student Dashboard">
      <Content>
        <Heading as="h2" mb={8} fontSize="4xl">Student Dashboard</Heading>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
          <Box>
            {data.labs.student.projects.map((p) => (
              <Match
                match={p}
                selectedTags={[]}
                allowSelect={false}
              />
            ))}
          </Box>
          <Box>
            <Box p={4} bg="purple.50" borderColor="purple.700" borderWidth={1} color="purple.900" mb={8}>
              <Heading as="h3" fontSize="md" mb={4}>Mentor Contact Information</Heading>
              {data.labs.student.projects.map(({ mentors }) => mentors).flat().map((mentor) => (
                <Box d="inline-block">
                  {mentor.name}<br />
                  <Link href={`mailto:${mentor.email}`}>{mentor.email}</Link>
                  {mentor.profile?.phone && (
                    <>
                      <br />
                      <Link href={`tel:${mentor.profile.phone}`}>{mentor.profile.phone}</Link>
                    </>
                  )}
                </Box>
              ))}
            </Box>

            {data?.labs?.surveys && (
              <>
                <Heading as="h3" fontSize="md" mb={2}>Surveys</Heading>
                <List mb={8} styleType="disc" pl={6}>
                  {data.labs.surveys.flatMap((s) => s.occurrences.map((o) => {
                    if (o.surveyResponses.filter((r) => r.authorStudentId === data?.labs?.student?.id).length > 0) return <></>;
                    return (
                      <ListItem key={o.id}>
                        <Link href={`/dash/s/${query.token}/survey/${s.id}/${o.id}`} target="_blank">
                          <Text d="inline" fontWeight="bold">{s.name}</Text>
                          <Text fontSize="sm">due {DateTime.fromISO(o.dueAt).toLocaleString(DateTime.DATE_MED)}</Text>
                        </Link>
                      </ListItem>
                    );
                  }))}
                </List>
              </>
            )}

            <Heading as="h3" fontSize="md" mb={4}>Additional Resources</Heading>
            <Button as="a" href={`/dash/s/${query?.token}/onboarding`}>Onboarding Week Assignments</Button>
          </Box>
        </Grid>
      </Content>
    </Page>
  );

  return (
    <Page title="Student Dashboard">
      <Content>
        <Spinner />
      </Content>
    </Page>
  )
}
