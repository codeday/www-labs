import React, { useState } from 'react';
import Head from 'next/head'
import Box, { Content } from '@codeday/topo/Box';
import CognitoForm from '@codeday/topo/CognitoForm';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Page from '../../components/Page';
import MentorSeo from '../../components/MentorSeo';

export default function MentorApplyPage () {
  return (
    <Page slug="/mentor/checkin" title="Mentor Check-In">
      <MentorSeo />
      <Content>
        <Heading as="h2" size="xl" marginBottom={3}>Weekly Mentor Check-In</Heading>
        <CognitoForm formId="59" />
      </Content>
    </Page>
  );
};
