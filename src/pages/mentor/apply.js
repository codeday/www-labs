import React, { useEffect, useContext } from 'react';
import Head from 'next/head'
import Box, { Content } from '@codeday/topo/Box';
import Image from '@codeday/topo/Image';
import CognitoForm from '@codeday/topo/CognitoForm';
import Text, { Heading, Link } from '@codeday/topo/Text';
import { useAnalytics } from '@codeday/topo/utils';
import { FathomContext } from 'fathom-react/dist/context';
import Page from '../../components/Page';
import MentorSeo from '../../components/MentorSeo';

export default function MentorApplyPage () {
  const { goal } = useAnalytics();

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
        <CognitoForm
          formId="57"
          onFirstPageChange={() => goal('VA6TNIKN')}
          onSubmit={() => goal('FQKVLN2E')}
        />
      </Content>
    </Page>
  );
};
