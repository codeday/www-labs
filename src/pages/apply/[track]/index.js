import { print } from 'graphql';
import { Heading } from '@codeday/topo/Atom';
import { CognitoForm, Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../../components/Page';
import CheckApplicationsOpen from '../../../components/CheckApplicationsOpen';
import CheckLoggedIn from '../../../components/CheckLoggedIn';
import { TrackQuery } from './track.gql';

const TRACK_NAMES = {
  beginner: 'Beginner',
  advanced: 'Intermediate/Advanced',
}

export default function ApplyTrack({ track, partnerCode }) {
  return (
    <Page slug={`/apply/${track}`} title={`Apply for ${TRACK_NAMES[track] || track} (${partnerCode})`}>
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl" marginBottom={12}>Student Application: {TRACK_NAMES[track] || track}</Heading>
        <CheckApplicationsOpen skip={partnerCode}>
          <CheckLoggedIn>
            {(session) => (
              <CognitoForm
                formId="87"
                prefill={{
                  Track: TRACK_NAMES[track] || track,
                  Username: session?.user?.nickname,
                  Name: { First: session?.user?.given_name, Last: session?.user?.family_name },
                  Email: session?.user?.email,
                  PartnerCode: partnerCode,
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
    paths: [{ params: { track: 'beginner' } }, { params: { track: 'advanced' } }],
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
