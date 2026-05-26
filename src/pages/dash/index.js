import useSwr from 'swr';
import fetch from 'node-fetch';
import { signIn } from 'next-auth/client';
import { Text, Button, Spinner, Divider, Grid } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../components/Page';
import EventCard from '../../components/Dashboard/EventCard';
import RequestLoginLink from '../../components/Dashboard/RequestLoginLink';
import UniversalSearch from '../../components/Dashboard/UniversalSearch';

function hasEvents(data) {
  return !!(data?.events && Object.keys(data.events).length > 0);
}

function SignInPrompt() {
  return (
    <>
      <Text mb={4}>
        Students/program staff: Log into your CodeDay account to continue.
      </Text>
      <Button onClick={() => signIn('auth0')} colorScheme="green" mb={2}>
        Sign In
      </Button>
    </>
  );
}

function OsmShortcut({ token }) {
  return (
    <Content maxW="container.sm" textAlign="center">
      <Button as="a" href={`/dash/osm/${token}`}>
        Open-Source Manager
      </Button>
    </Content>
  );
}

function EventsList({ data }) {
  return (
    <Content maxW="container.lg">
      <UniversalSearch data={data} />
      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
        {Object.entries(data.events).map(([title, tokens]) => (
          <EventCard key={title} title={title} tokens={tokens} />
        ))}
      </Grid>
    </Content>
  );
}

function CenteredMessage({ children }) {
  return (
    <Content maxW="container.sm" textAlign="center">
      {children}
    </Content>
  );
}

function DashboardBody({ isValidating, data }) {
  if (hasEvents(data)) return <EventsList data={data} />;
  if (data) return <CenteredMessage>Sorry, nothing is associated with your account.</CenteredMessage>;
  if (isValidating) return <CenteredMessage><Spinner /></CenteredMessage>;
  return <CenteredMessage><SignInPrompt /></CenteredMessage>;
}

export default function DashboardLogin() {
  const { isValidating, data } = useSwr('/api/dashRedirect', (url) =>
    fetch(url).then((r) => r.json())
  );

  return (
    <Page slug="/dash" title="Dashboard">
      {data?.osm && <OsmShortcut token={data.osm} />}
      <DashboardBody isValidating={isValidating} data={data} />
      <Content maxW="container.sm">
        <Divider mt={8} mb={8} />
        <Text mb={4}>Mentors: enter your email to receive a login link.</Text>
        <RequestLoginLink />
      </Content>
    </Page>
  );
}
