import { print } from 'graphql';
import { Heading } from '@codeday/topo/Atom';
import { CognitoForm, Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../../components/Page';
import CheckLoggedIn from '../../../components/CheckLoggedIn';
import { TrackQuery } from './track.gql';

export default function ChallengeTrack({ track }) {
  return (
    <Page slug={`/apply/${track}/scholarship`} title={`Scholarship Application`}>
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl" marginBottom={12}>Scholarship Application</Heading>
        <CheckLoggedIn>
          {(session) => (
            <CognitoForm
              formId="89"
              prefill={{
                Username: session?.user?.nickname,
                Name: { First: session?.user?.given_name, Last: session?.user?.family_name },
                Email: session?.user?.email,
              }}
            />
          )}
        </CheckLoggedIn>
      </Content>
    </Page>
  );
}

export function getStaticPaths() {
  return {
    paths: [{ params: { track: 'beginner' } }],
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
