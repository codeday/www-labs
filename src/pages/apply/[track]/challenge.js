
import { print } from 'graphql';
import { Heading } from '@codeday/topo/Atom/Text';
import CognitoForm from '@codeday/topo/Molecule/CognitoForm';
import Content from '@codeday/topo/Molecule/Content';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../../components/Page';
import CheckApplicationsOpen from '../../../components/CheckApplicationsOpen';
import CheckLoggedIn from '../../../components/CheckLoggedIn';
import { TrackQuery } from './track.gql';

const TRACK_NAMES = {
  beginner: 'Beginner',
  intermeidate: 'Intermediate',
  advanced: 'Advanced',
}

export default function ChallengeTrack({ track }) {
  return (
    <Page slug={`/apply/${track}/challenge`} title={`Coding Challenge for ${TRACK_NAMES[track] || track}-Track`}>
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl" marginBottom={12}>Coding Challenge: {TRACK_NAMES[track] || track}-Track</Heading>
        <CheckApplicationsOpen>
          <CheckLoggedIn>
            {(session) => (
              <CognitoForm
                formId="90"
                prefill={{
                  Track: TRACK_NAMES[track] || track,
                  TrackId: track,
                  Username: session?.user?.nickname,
                  Name: { First: session?.user?.given_name, Last: session?.user?.family_name },
                  Email: session?.user?.email,
                }}
              />
            )}
          </CheckLoggedIn>
        </CheckApplicationsOpen>
      </Content>
    </Page>
  );
}

export function getStaticPaths() {
  return {
    paths: Object.keys(TRACK_NAMES).map((track) => ({ params: { track } })),
    fallback: false,
  };
}

export async function getStaticProps({ params: { track } }) {
  const data = await apiFetch(print(TrackQuery));

  return {
    props: {
      query: data || {},
      random: Math.random(),
      track,
    },
    revalidate: 240,
  };
}
