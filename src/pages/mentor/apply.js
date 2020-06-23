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
        <Text color="red.800">Applications are now closed!</Text>
        <Link href="/volunteer">You can still help as a volunteer!</Link>
      </Content>
    </Page>
  );
};
