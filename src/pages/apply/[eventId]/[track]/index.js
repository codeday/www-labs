import { print } from 'graphql';
import { Heading } from '@codeday/topo/Atom';
import { CognitoForm, Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import CheckLoggedIn from '../../../../components/CheckLoggedIn';
import { LabsApplyInformationQuery } from './track.gql';
import ApplyForm from '../../../../components/ApplyForm';

const TRACK_NAMES = {
  beginner: 'Beginner',
  advanced: 'Intermediate/Advanced',
}

export default function ApplyTrack({ track, partnerCode, eventId }) {
  return (
    <Page slug={`/apply/${track}`} title={`Apply for ${TRACK_NAMES[track] || track} (${partnerCode})`}>
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl" marginBottom={12}>Student Application: {TRACK_NAMES[track] || track}</Heading>
        <CheckLoggedIn>
          {(session) => (
            <ApplyForm
              givenName={session?.user?.given_name}
              surname={session?.user?.family_name}
              email={session?.user?.email}
              partnerCode={partnerCode}
              track={track.toUpperCase()}
              eventId={eventId}
            />
          )}
        </CheckLoggedIn>
      </Content>
    </Page>
  );
}

export function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params: { track, eventId } }) {
  return {
    props: {
      track,
      eventId,
    },
  };
}