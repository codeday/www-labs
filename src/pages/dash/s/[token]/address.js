
import { Heading } from '@codeday/topo/Atom';
import { CognitoForm, Content } from '@codeday/topo/Molecule';
import Page from '../../../../components/Page';

export default function Address() {
  return (
    <Page title="Address">
      <Content mt={-8} display={{ base: 'none', sm: 'block' }}>
        <Heading as="h2" fontSize="3xl" mb={4}>Address</Heading>
        <CognitoForm formId={115} />
      </Content>
    </Page>
  );
}
