
import { print } from 'graphql';
import { Heading } from '@codeday/topo/Atom/Text';
import CognitoForm from '@codeday/topo/Molecule/CognitoForm';
import Content from '@codeday/topo/Molecule/Content';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../../components/Page';
import { TrackQuery } from './track.gql';

export default function PaymentTrack({ track }) {
  return (
    <Page slug={`/apply/${track}/payment`} title={`Payment`}>
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl">Payment</Heading>
        <CognitoForm
          formId="92"
        />
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
