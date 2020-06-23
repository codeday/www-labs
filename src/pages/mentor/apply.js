import React, { useState } from 'react';
import Head from 'next/head'
import Box, { Content } from '@codeday/topo/Box';
import Image from '@codeday/topo/Image';
import CognitoForm from '@codeday/topo/CognitoForm';
import Text, { Heading, Link } from '@codeday/topo/Text';
import List, { Item as ListItem } from '@codeday/topo/List';
import { useAnalytics } from '@codeday/topo/utils';
import { FathomContext } from 'fathom-react/dist/context';
import Page from '../../components/Page';
import MentorSeo from '../../components/MentorSeo';

export default function MentorApplyPage () {
  const { goal } = useAnalytics();
  const [hasStarted, setHasStarted] = useState(false);

  return (
    <Page slug="/mentor/apply" title="Mentor Application">
      <MentorSeo />
      <Content>
        <Image
          width="100%"
          maxHeight="300px"
          borderRadius="md"
          marginBottom={4}
          src="https://img.codeday.org/w=1024;h=300;fit=crop;crop=faces,edges/w/v/wvs5jzy36vt5hw1y71pnn7hsfupbh2v9ew3v7fc4z9otg265zzejg9iq97an9aszfa.jpg"
        />
        <Heading as="h2" size="xl" marginBottom={3}>Mentor Application</Heading>
        <Box bg="orange.50" borderColor="orange.200" borderWidth={2} borderRadius={2} p={4} mb={4} color="orange.800">
          <Heading as="h3" fontSize="lg" mb={4}>Approaching Deadline</Heading>
          <Text>
            We'll need to complete a 15min on-boarding call and finalize a project description by{' '}
            <Text bold as="span">end-of-day Friday, June 26.</Text>
          </Text>
          <Text>
            You can help us speed things up by submitting a detailed project proposal with your application.
          </Text>
        </Box>
        <CognitoForm
          formId="57"
          onFirstPageChange={() => { goal('VA6TNIKN'); setHasStarted(true); }}
          onSubmit={() => goal('FQKVLN2E')}
        />
      </Content>
      {hasStarted && (
        <img
          height="1"
          width="1"
          style={{ 'display': 'none' }}
          alt=""
          src="https://px.ads.linkedin.com/collect/?pid=1831116&fmt=gif"
        />
      )}
    </Page>
  );
};
