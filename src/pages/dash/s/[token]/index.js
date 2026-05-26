import { print } from 'graphql';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { Content } from '@codeday/topo/Molecule';
import { Box, Button, Grid, Heading, Link, List, ListItem, Spinner, Text } from '@codeday/topo/Atom';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import { StudentDashboardQuery } from './index.gql';
import { Match } from '../../../../components/Dashboard/Match';
import { MiniCalendar } from '../../../../components/Dashboard/MiniCalendar';
import CenteredMessagePage from '../../../../components/Dashboard/CenteredMessagePage';
import DashboardStateGate from '../../../../components/Dashboard/DashboardStateGate';
import ActionRequiredBox from '../../../../components/Dashboard/ActionRequiredBox';
import DashboardInfoBox from '../../../../components/Dashboard/DashboardInfoBox';

const TITLE = 'Student Dashboard';

function dueSurveysFor(surveys, studentId) {
  return (surveys || [])
    .flatMap((survey) => survey.occurrences
      .sort((a, b) => DateTime.fromISO(a.dueAt) > DateTime.fromISO(b.dueAt) ? -1 : 1)
      .slice(0, 1)
      .map((o) => ({ survey, ...o }))
    )
    .filter((o) => (o.surveyResponses || []).filter((r) => r.authorStudentId === studentId).length === 0);
}

function isOnboardingWeek(event) {
  const startsAt = DateTime.fromISO(event.startsAt);
  return DateTime.now() > startsAt && DateTime.now() < startsAt.plus({ weeks: 1 });
}

function buildStudentCalendarEvents(event, student) {
  const startsAt = DateTime.fromISO(event.startsAt);
  const workStartsAt = event.projectWorkStartsAt
    ? DateTime.fromISO(event.projectWorkStartsAt)
    : startsAt.plus({ weeks: 1 });
  return [
    ...(event.matchingStartsAt ? [
      { date: DateTime.fromISO(event.matchingStartsAt), name: 'Project descriptions finalized' },
      { date: DateTime.fromISO(event.matchingStartsAt), name: 'Student match preferences open' },
    ] : []),
    ...(event.matchingDueAt ? [
      { date: DateTime.fromISO(event.matchingDueAt), name: 'Student match preferences due' },
    ] : []),
    {
      date: event.matchingEndsAt ? DateTime.fromISO(event.matchingEndsAt) : startsAt.minus({ days: 3 }),
      name: 'Introduction emails sent',
    },
    { date: startsAt, name: 'Onboarding week (no mentor meetings)' },
    { date: workStartsAt, name: 'Onboarding assignments due' },
    { date: workStartsAt, name: 'Project work begins' },
    { date: workStartsAt, name: 'Mentor meetings begin' },
    { date: workStartsAt, name: 'Slack standups begin' },
    { date: startsAt.plus({ weeks: student.weeks }).minus({ days: 3 }), name: 'Your last day' },
  ];
}

function DueSurveysBox({ surveys, token, event }) {
  const showOnboarding = isOnboardingWeek(event);
  if (!showOnboarding && surveys.length === 0) return null;
  return (
    <ActionRequiredBox>
      {showOnboarding && (
        <ListItem>
          <Link href={`/dash/s/${token}/onboarding`}>
            <Text display="inline" fontWeight="bold">Onboarding Assignments</Text>
            <Text fontSize="sm">due {DateTime.fromISO(event.startsAt).plus({ days: 6 }).toLocaleString(DateTime.DATE_MED)}</Text>
          </Link>
        </ListItem>
      )}
      {surveys.map((o) => (
        <ListItem key={o.id}>
          <Link href={`/dash/s/${token}/survey/${o.survey.id}/${o.id}`} target="_blank">
            <Text display="inline" fontWeight="bold">{o.survey.name}</Text>
            <Text fontSize="sm">due {DateTime.fromISO(o.dueAt).toLocaleString(DateTime.DATE_MED)}</Text>
          </Link>
        </ListItem>
      ))}
    </ActionRequiredBox>
  );
}

function MentorContactsBox({ projects }) {
  const mentors = projects.flatMap((p) => p.mentors);
  return (
    <DashboardInfoBox>
      <Heading as="h3" fontSize="md" mb={4}>Mentor Contact Information</Heading>
      {mentors.map((mentor) => (
        <Box key={mentor.email} display="inline-block">
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
    </DashboardInfoBox>
  );
}

function StudentResourcesBox({ token, slackId, resources }) {
  return (
    <DashboardInfoBox title="Resources">
      <List styleType="disc" pl={6}>
        <ListItem>
          <Link href={`/dash/s/${token}/problem`}>Report a Problem</Link>
          <Text fontSize="xs">(e.g., issue already solved, no mentor response)</Text>
        </ListItem>
        <ListItem><Link href={`/dash/s/${token}/onboarding`}>Onboarding Assignments</Link></ListItem>
        <ListItem><Link href={`/dash/s/${token}/feedback`} target="_blank">Review Feedback</Link></ListItem>
        <ListItem><Link href={`/dash/s/${token}/help`}>Book Coding Help Meeting</Link></ListItem>
        {slackId && (
          <ListItem><Link href={`/api/link-slack?token=${token}&r=s`}>Re-Link Slack Account</Link></ListItem>
        )}
        {resources.map((r) => (
          <ListItem key={r.id}><Link href={r.link} target="_blank">{r.name}</Link></ListItem>
        ))}
      </List>
    </DashboardInfoBox>
  );
}

function StudentDashboardContent({ student, event, surveys, resources, token }) {
  const dueSurveys = dueSurveysFor(surveys, student.id);
  return (
    <Page title={TITLE}>
      <Content>
        <Heading as="h2" mb={8} fontSize="4xl">{student.name}'s Dashboard</Heading>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
          <Box>
            {student.projects.map((p) => (
              <Match key={p.id} match={p} selectedTags={[]} allowSelect={false} />
            ))}
          </Box>
          <Box>
            <Button as="a" size="lg" mb={4} colorScheme="blue" w="100%" rounded="sm" href={`/dash/s/${token}/help`}>
              Book Coding Help Meeting
            </Button>
            {!student.slackId && (
              <Button as="a" size="md" mb={4} colorScheme="yellow" w="100%" rounded="sm" href={`/api/link-slack?token=${token}&r=s`}>
                Link Slack Account
              </Button>
            )}
            <DueSurveysBox surveys={dueSurveys} token={token} event={event} />
            <MentorContactsBox projects={student.projects} />
            <StudentResourcesBox token={token} slackId={student.slackId} resources={resources} />
            <MiniCalendar events={buildStudentCalendarEvents(event, student)} />
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}

function StudentDashboardInner({ data, token }) {
  const student = data.labs.student;
  if (student.status === 'OFFERED') return (
    <CenteredMessagePage title={TITLE}>
      <Text>You were offered admission to CodeDay Labs in the {student.track} track:</Text>
      <Text><Link href={`/dash/s/${token}/offer-accept`}>I accept this offer!</Link></Text>
      <Text><Link href={`/dash/s/${token}/withdraw`}>I do NOT accept, and want to withdraw my application.</Link></Text>
    </CenteredMessagePage>
  );
  if (student.status !== 'ACCEPTED') return (
    <CenteredMessagePage title={TITLE}>
      <Text>Your dashboard will become available if you are accepted to CodeDay Labs.</Text>
    </CenteredMessagePage>
  );
  const hasPreferences = data.labs.projectPreferences?.length > 0;
  const hasProjects = student.projects?.length > 0;
  if (hasPreferences && !hasProjects) return (
    <CenteredMessagePage title={TITLE}>
      <Text>Your project preferences have been submitted! Check back once you've been matched.</Text>
    </CenteredMessagePage>
  );
  if (hasProjects) return (
    <StudentDashboardContent
      student={student}
      event={data.labs.event}
      surveys={data.labs.surveys}
      resources={data.labs.resources}
      token={token}
    />
  );
  return <Page title={TITLE}><Content><Spinner /></Content></Page>;
}

export default function Dashboard() {
  const { query } = useRouter();
  const { isValidating, data, error } = useSwr(print(StudentDashboardQuery), {}, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useEffect(() => {
    if (typeof window === 'undefined' || data?.labs?.student?.status !== 'ACCEPTED') return;
    const noProjects = !data.labs.student.projects || data.labs.student.projects.length === 0;
    const noPreferences = !data?.labs?.projectPreferences || data.labs.projectPreferences.length === 0;
    if (noProjects && noPreferences) window.location = `${window.location.href}/matching`;
  }, [data?.labs?.projects, data?.labs?.projectPreferences, typeof window]);

  return (
    <DashboardStateGate title={TITLE} error={error} isLoading={isValidating || !data?.labs?.student}>
      {data?.labs?.student && <StudentDashboardInner data={data} token={query.token} />}
    </DashboardStateGate>
  );
}
