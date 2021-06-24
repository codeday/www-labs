import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import CognitoForm from '@codeday/topo/Molecule/CognitoForm';
import Page from '../components/Page';

export default function Volunteer() {
  return (
    <Page slug="/volunteer" title="Career Volunteers">
      <Content mt={-8}>
        <Heading as="h2" mb={8}>Help CS students launch their career in an hour a month.</Heading>
        <Text>
          In addition to mentors, CodeDay is looking for engineers, HR professionals, and others who can provide
          resume feedback, conduct practice interviews, and/or host workshops. The time required to volunteer is an hour
          a month or less!
        </Text>
        <CognitoForm formId="94" />
      </Content>
    </Page>
  );
}
