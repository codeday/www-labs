import React from 'react';
import { Content } from '@codeday/topo/Box';
import CognitoForm from '@codeday/topo/CognitoForm';
import Text, { Heading } from '@codeday/topo/Text';
import Page from '../components/Page';

export default function DemoDaySubmission() {
  return (
    <Page slug="/demoday" title="Demo Day Day Submission">
      <Content>
        <Heading as="h2" size="xl" marginBottom={3}>Demo Day Submission</Heading>
        <Text bold>Please only submit your 2-minute demo day presentation (NOT your 10-15min tech talk).</Text>
        <CognitoForm formId="72" />
      </Content>
    </Page>
  );
}
