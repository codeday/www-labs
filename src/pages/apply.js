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
        <Text color="red.700" fontWeight="700">
          Our student application has not opened. Check back May 11, or leave your email below.
        </Text>
        <CognitoForm
          formId="62"
          onFirstPageChange={() => goal('KLA6SYAR')}
          onSubmit={() => goal('TDG3BSHH')}
        />
      </Content>
    </Page>
  );
}
