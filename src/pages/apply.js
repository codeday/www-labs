import Head from 'next/head'
import Box, { Content } from '@codeday/topo/Box';
import Image from '@codeday/topo/Image';
import CognitoForm from '@codeday/topo/CognitoForm';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Page from '../components/Page';

export default () => (
  <Page title="Mentor">
    <Content>
      <Heading as="h2" size="xl" marginBottom={3}>Student Application</Heading>
      <Text color="red.700" fontWeight="700">
        Our student application has not opened. Check back May 11, or leave your email below.
      </Text>
      <CognitoForm id="62" />
    </Content>
  </Page>
)
