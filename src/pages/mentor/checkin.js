import React, { useState } from 'react';
import Head from 'next/head'
import atob from 'atob'
import Box, { Content } from '@codeday/topo/Box';
import CognitoForm from '@codeday/topo/CognitoForm';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Page from '../../components/Page';
import MentorSeo from '../../components/MentorSeo';

export const getServerSideProps = ({ query: { token }}) => {
  return {
    props: {
      prefill: JSON.parse(atob(token || '') || '{}'),
    },
  };
}

export default function MentorApplyPage ({ prefill }) {
  return (
    <Page slug="/mentor/checkin" title="Mentor Check-In">
      <MentorSeo />
      <Content>
        <Heading as="h2" size="xl" marginBottom={3}>Weekly Mentor Check-In</Heading>
        <CognitoForm
          formId="59"
          prefill={{
            MentorID: prefill.id,
            MentorName: { First: prefill.firstName, Last: prefill.lastName },
            CC: prefill.cc || 'labs',
            Students: (prefill.students || []).map((student) => ({
              Name: student.name,
              StudentID: student.id,
              ProjectID: student.project_id
            })),
          }} />
      </Content>
    </Page>
  );
};
