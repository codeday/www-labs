import Head from 'next/head'
import Box, { Content } from '@codeday/topo/Box';
import Image from '@codeday/topo/Image';
import CognitoForm from '@codeday/topo/CognitoForm';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Page from '../components/Page';

export default () => (
  <Page title="Mentor">
    <Content>
      <Box maxHeight="300px" overflow="hidden" borderRadius="md" marginBottom={4}>
        <Image width="100%" src="https://picsum.photos/1000/400" />
      </Box>
      <Heading as="h2" size="xl" marginBottom={3}>Student Application</Heading>
      <Text color="red.700" fontWeight="700">Our student application has not opened; it will open May 10.</Text>
      <CognitoForm id="62" />
    </Content>
  </Page>
)
