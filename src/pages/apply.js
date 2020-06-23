import React, { useEffect } from 'react';
import { Content } from '@codeday/topo/Box';
import CognitoForm from '@codeday/topo/CognitoForm';
import Text, { Heading, Link } from '@codeday/topo/Text';
import { useAnalytics } from '@codeday/topo/utils';
import Page from '../components/Page';

export default () => {
  const { goal } = useAnalytics();

  return (
    <Page slug="/apply" title="Student Application">
      <Content>
        <Heading as="h2" size="xl" marginBottom={3}>Student Application</Heading>
        <Text>Questions? Email us at <Link href="mailto:labs@codeday.org">labs@codeday.org</Link></Text>
        <Text color="red.800">Applications are now closed! You should hear back by June 26.</Text>
      </Content>
    </Page>
  );
}
