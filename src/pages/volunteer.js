
import Box, { Grid, Content } from '@codeday/topo/Box';
import Image from '@codeday/topo/Image';
import Divider from '@codeday/topo/Divider';
import CognitoForm from '@codeday/topo/CognitoForm';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Page from '../components/Page';
import MentorSeo from '../components/MentorSeo';

export default () => (
  <Page slug="/volunteer" title="Volunteer">
    <MentorSeo />
    <Content textAlign="center">
      <Image
        width="100%"
        maxHeight="300px"
        borderRadius="md"
        marginBottom={4}
        src="https://img.codeday.org/w=1024;h=300;fit=crop;crop=faces,edges/b/s/bsi4mxy595o46b8qufi5xa4c3oisfhz5to8x1c3t7yz9j9d4utrwdrov4zhihtdxc5.jpg"
      />
      <Heading as="h2" size="2xl">Help launch a student's career at CodeLabs.</Heading>
      <Text color="gray.700" fontSize="xl">We need more than coding mentors to make this summer a success.</Text>
    </Content>
    <Content paddingTop={8} paddingBottom={8}>
      <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={6} textAlign="center">
        <Box>
          <Heading as="h3" size="md">People Ops/HR</Heading>
          <Text>
            Provide feedback on student resumes, or host calls to answer individual questions about hiring and careers
            in the tech industry.
          </Text>
          <Text>July 2020 (flexible)</Text>
        </Box>
        <Box>
          <Heading as="h3" size="md">Engineers</Heading>
          <Text>
            Provide feedback on student resumes, or host mock-technical interviews.
          </Text>
          <Text>July 2020 (flexible)</Text>
        </Box>
      </Grid>
      <Text bold textAlign="center" mt={4}>
        You're welcome to keep in touch with any talented students you meet. There is no cost to participate.
      </Text>
    </Content>
    <Content>
      <Divider marginBottom={8} />
      <Heading as="h3" size="md" marginBottom={4}>Ready to give back? Express your interest below:</Heading>
      <CognitoForm formId={69} />
    </Content>
  </Page>
);
