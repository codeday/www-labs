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
import { useColorMode } from '@chakra-ui/react';
import { MiniCalendar } from '../../../../components/Dashboard/MiniCalendar';

export default function Dashboard() {
  const { query } = useRouter();
  const { isValidating, data, error } = useSwr(print(StudentDashboardQuery), {}, { 
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';
  const bg = dark ? 900 : 50;
  const borderColor = dark ? 600 : 700;
  const color = dark ? 50 : 900;

  useEffect(() => {
    if (typeof window === 'undefined' || data?.labs?.student?.status !== 'ACCEPTED' ) return;
    if (
      (!data?.labs?.student?.projects || data.labs.student.projects.length === 0)
      && !(data?.labs?.projectPreferences && data.labs.projectPreferences.length > 0)
    ) window.location = `${window.location.href}/matching`;
  }, [ data?.labs?.projects, data?.labs?.projectPreferences, typeof window ]);

  if (error?.message && error?.message.includes('{')) {
    return <Page title="Mentor Dashboard"><Content textAlign="center"><Text>{error.message.split('{')[0]}</Text></Content></Page>
  }

  if (isValidating || !data?.labs?.student) return (
    <Page title="Student Dashboard">
      <Content textAlign="center">
        <Spinner />
      </Content>
    </Page>
  );

  if (data?.labs?.student?.status === 'OFFERED') return (
    <Page title="Student Dashboard">
      <Content textAlign="center">
        <Text>You were offered admission to CodeDay Labs in the {data.labs.student.track} track:</Text>
        <Text>
          <Link href={`/dash/s/${query.token}/offer-accept`}>I accept this offer!</Link>
        </Text>
        <Text>
          <Link href={`/dash/s/${query.token}/withdraw`}>I do NOT accept, and want to withdraw my application.</Link>
        </Text>
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

  const dueSurveys = (data.labs.surveys || [])
    .flatMap((s) => s.occurrences
      .sort((a, b) => DateTime.fromISO(a.dueAt) > DateTime.fromISO(b.dueAt) ? -1 : 1)
      .slice(0,1)
    ).filter((o) => (
      o.surveyResponses
        .filter((r) => r.authorStudentId === data?.labs?.student?.id)
        .length == 0
    ));

  const isOnboardingWeek = DateTime.now() > DateTime.fromISO(data.labs.event.startsAt)
      && DateTime.now() < DateTime.fromISO(data.labs.event.startsAt).plus({ weeks: 1 });

  if (data?.labs?.student?.projects && data.labs.student.projects.length > 0) return (
    <Page title="Student Dashboard">
      <Content>
        <Heading as="h2" mb={8} fontSize="4xl">{data.labs.student.name}'s Dashboard</Heading>
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
            {(dueSurveys.length > 0 || isOnboardingWeek) && (
              <Box p={4} pt={3} mb={8} bg={`red.${bg}`} borderColor={`red.${borderColor}`} borderWidth={4} color={`red.${color}`} rounded="sm">
                <Text mb={0} color="red.700" fontSize="sm">[ACTION REQUIRED]</Text>
                <Heading as="h3" fontSize="md" mb={2}>Due Check-Ins, Reflections, &amp; Surveys</Heading>
                <List styleType="disc" pl={6}>
                  {isOnboardingWeek && (
                    <ListItem>
                      <Link href={`/dash/s/${query?.token}/onboarding`}>
                        <Text d="inline" fontWeight="bold">Onboarding Assignments</Text>
                        <Text fontSize="sm">due {DateTime.fromISO(data.labs.event.startsAt).plus({days: 6}).toLocaleString(DateTime.DATE_MED)}</Text>
                      </Link>
                    </ListItem>
                  )}
                  {data.labs.surveys.flatMap((s) => s.occurrences.sort((a, b) => DateTime.fromISO(a.dueAt) > DateTime.fromISO(b.dueAt) ? -1 : 1).slice(0,1).map((o) => {
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
              </Box>
            )}

            <Box p={4} mb={4} bg={`blue.${bg}`} borderColor={`blue.${borderColor}`} borderWidth={1} color={`blue.${color}`} rounded="sm">
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

            <Box p={4} mb={4} bg={`blue.${bg}`} borderColor={`blue.${borderColor}`} borderWidth={1} color={`blue.${color}`} rounded="sm">
              <Heading as="h3" fontSize="md" mb={2}>Resources</Heading>
              <List styleType="disc" pl={6}>
                <ListItem>
                  <Link href={`/dash/s/${query?.token}/onboarding`}>
                    Onboarding Assignments
                  </Link>
                </ListItem>
                <ListItem>
                  <Link href={`/dash/s/${query?.token}/help`}>
                    Book Coding Help Meeting
                  </Link>
                </ListItem>
                {data.labs.resources.map(r => (
                    <ListItem key={r.id}>
                      <Link href={r.link} target="_blank">{r.name}</Link>
                    </ListItem>
                ))}
              </List>
            </Box>

            <MiniCalendar
              events={[
                {
                  date: DateTime.fromISO(data.labs.event.startsAt).minus({ days: 3 }),
                  name: `Introduction emails sent`,
                },
                {
                  date: DateTime.fromISO(data.labs.event.startsAt),
                  name: `Student onboarding week`,
                },
                {
                  date: DateTime.fromISO(data.labs.event.startsAt).plus({ weeks: 1 }),
                  name: `${data.labs.event.name} mentoring starts`,
                },
                {
                  date: DateTime.fromISO(data.labs.event.startsAt)
                    .plus({ weeks: data.labs.student.weeks })
                    .minus({ days: 3 }),
                  name: `Your last day`,
                },
              ]}
            />

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
