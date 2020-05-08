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
        <CognitoForm
          formId="60"
          onFirstPageChange={() => goal('KLA6SYAR')}
          onSubmit={() => goal('LITUQMOL')}
        />
      </Content>
    </Page>
  );
}
