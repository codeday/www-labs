import { print } from 'graphql';
import { Text, Button } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../components/Page';
import CheckApplicationsOpen from '../../components/CheckApplicationsOpen';
import { IndexQuery } from './index.gql';

export default function ApplyHome() {
  return (
    <Page slug="/apply" title="Apply">
      <Content mt={-8}>
        <CheckApplicationsOpen>
          <Text>
            Applications are open! This year we are only offering the intermediate/advanced tracks, which use
            one single application.
          </Text>
          <Button as="a" href="/apply/advanced" colorScheme="green">Apply Now</Button>
        </CheckApplicationsOpen>
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  const data = await apiFetch(print(IndexQuery));

  return {
    props: {
      query: data || {},
      random: Math.random(),
    },
    revalidate: 240,
  };
}
