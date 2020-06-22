import React, { useEffect } from 'react';
import { Content } from '@codeday/topo/Box';
import CognitoForm from '@codeday/topo/CognitoForm';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Page from '../../components/Page';

export const getServerSideProps = ({ params: { id } }) => {
  return {
    props: {
      id,
    }
  }
}

export default ({ id }) => {
  return (
    <Page slug={`/postevent/${id}`} title="Event Feedback">
      <Content>
        <Heading as="h2" size="xl" marginBottom={3}>Event Feedback</Heading>
        <CognitoForm
          formId="68"
          prefill={{ EventId: id }}
        />
      </Content>
    </Page>
  );
}
