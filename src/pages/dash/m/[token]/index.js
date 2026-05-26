import { print } from 'graphql';
import { useMemo } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { Content } from '@codeday/topo/Molecule';
import { Box, Button, Grid, Heading, Link, List, ListItem, Text } from '@codeday/topo/Atom';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import MentorProfile from '../../../../components/Dashboard/MentorProfile';
import ProjectEditor from '../../../../components/Dashboard/ProjectEditor';
import MentorManagerDetails from '../../../../components/Dashboard/MentorManagerDetails';
import { MiniCalendar } from '../../../../components/Dashboard/MiniCalendar';
import DashboardStateGate from '../../../../components/Dashboard/DashboardStateGate';
import ActionRequiredBox from '../../../../components/Dashboard/ActionRequiredBox';
import DashboardInfoBox from '../../../../components/Dashboard/DashboardInfoBox';
import { DashboardQuery } from './index.gql';

const TITLE = 'Mentor Dashboard';

function dueSurveysFor(surveys, mentorId) {
  return (surveys || [])
    .flatMap((survey) => survey.occurrences
      .sort((a, b) => DateTime.fromISO(a.dueAt) > DateTime.fromISO(b.dueAt) ? -1 : 1)
      .slice(0, 1)
      .map((o) => ({ survey, ...o }))
    )
    .filter((o) => (o.surveyResponses || []).filter((r) => r.authorMentorId === mentorId).length === 0);
}

function buildMentorCalendarEvents(event, students) {
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
    { date: startsAt, name: 'Student onboarding week' },
    { date: workStartsAt, name: 'Mentor meetings start' },
    ...students.map((s) => ({
      date: startsAt.plus({ weeks: s.weeks }).minus({ days: 3 }),
      name: `${s.name}'s last day`,
    })),
  ];
}

function DueSurveysBox({ surveys, token }) {
  if (surveys.length === 0) return null;
  return (
    <ActionRequiredBox mb={8}>
      {surveys.map((o) => (
        <ListItem key={o.id}>
          <Link textDecor="none" href={`/dash/m/${token}/survey/${o.survey.id}/${o.id}`} target="_blank">
            <Text textDecor="underline" display="inline" fontWeight="bold">{o.survey.name}</Text>
            <Text fontSize="sm">Due on {DateTime.fromISO(o.dueAt).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}</Text>
          </Link>
        </ListItem>
      ))}
    </ActionRequiredBox>
  );
}

function MentorResourcesBox({ token, slackId, resources }) {
  return (
    <DashboardInfoBox title="Resources">
      <List styleType="disc" pl={6}>
        <ListItem>
          <Link href={`/dash/m/${token}/students`} target="_blank">Review Student Feedback</Link>
        </ListItem>
        {slackId && (
          <ListItem><Link href={`/api/link-slack?token=${token}&r=m`}>Re-Link Slack Account</Link></ListItem>
        )}
        {resources.map((r) => (
          <ListItem key={r.id}><Link href={r.link} target="_blank">{r.name}</Link></ListItem>
        ))}
      </List>
    </DashboardInfoBox>
  );
}

function MentorDashboardContent({ mentor, event, students, surveys, resources, tags, token }) {
  const dueSurveys = useMemo(() => dueSurveysFor(surveys, mentor.id), [surveys, mentor.id]);
  return (
    <Page title={TITLE}>
      <Content mt={-8}>
        <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} alignItems="top" gap={8}>
          <Box>
            <Heading as="h2" fontSize="3xl" mb={4}>Your Profile</Heading>
            <MentorProfile mentor={mentor} limited borderWidth={1} p={4} shadow="sm" rounded="sm" mb={2} />
            <Heading as="h2" fontSize="3xl" mb={4} mt={8}>
              Your Project{mentor.projects.length !== 1 ? 's' : ''}
            </Heading>
            {mentor.projects.map((project) => (
              <ProjectEditor
                key={project.id}
                limited
                tags={tags}
                project={project}
                borderWidth={1}
                p={4}
                shadow="sm"
                rounded="sm"
                mb={2}
              />
            ))}
          </Box>
          <Box>
            <Button as="a" size="md" mb={4} colorScheme="blue" w="100%" rounded="sm" href={`/dash/m/${token}/students`}>
              Review Student Feedback
            </Button>
            {!mentor.slackId && (
              <Button as="a" size="md" mb={4} colorScheme="yellow" w="100%" rounded="sm" href={`/api/link-slack?token=${token}&r=m`}>
                Link Slack Account
              </Button>
            )}
            <DueSurveysBox surveys={dueSurveys} token={token} />
            <MentorManagerDetails mb={4} mentor={mentor} />
            <MentorResourcesBox token={token} slackId={mentor.slackId} resources={resources} />
            <MiniCalendar events={buildMentorCalendarEvents(event, students)} />
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}

export default function MentorDashboard() {
  const { query } = useRouter();
  const { error, data } = useSwr(print(DashboardQuery));

  return (
    <DashboardStateGate title={TITLE} error={error} isLoading={!data?.labs?.mentor}>
      {data?.labs?.mentor && (
        <MentorDashboardContent
          mentor={data.labs.mentor}
          event={data.labs.event}
          students={data.labs.students}
          surveys={data.labs.surveys}
          resources={data.labs.resources}
          tags={data.labs.tags}
          token={query.token}
        />
      )}
    </DashboardStateGate>
  );
}
