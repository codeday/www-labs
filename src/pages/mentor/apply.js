import Head from 'next/head'
import Box, { Content } from '@codeday/topo/Box';
import Image from '@codeday/topo/Image';
import CognitoForm from '@codeday/topo/CognitoForm';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Page from '../../components/Page';

export default () => (
  <Page title="Mentor">
    <Content>
      <Box height="300px" overflow="hidden" borderRadius="md" marginBottom={4}>
        <Image
          width="100%"
          maxHeight="300px"
          borderRadius="md"
          marginBottom={4}
          src="https://img.codeday.org/1024x300/w/v/wvs5jzy36vt5hw1y71pnn7hsfupbh2v9ew3v7fc4z9otg265zzejg9iq97an9aszfa.jpg"
        />
      </Box>
      <Heading as="h2" size="xl" marginBottom={3}>Apply as a CodeLabs Mentor</Heading>
      <CognitoForm id="57" />
    </Content>
  </Page>
)
