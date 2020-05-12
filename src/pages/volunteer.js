
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
      <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr 1fr" }} gap={6}>
        <Box>
          <Heading as="h3" size="md">Operations and Marketing</Heading>
          <Text>
            Use your experience to give back by helping <Text as="span" bold>recruit, schedule, and support mentors and
            volunteers.</Text>
          </Text>
          <Text>May-July 2020 (flexible)</Text>
        </Box>
        <Box>
          <Heading as="h3" size="md">People Ops/HR</Heading>
          <Text>
            Help students transition into the workforce by <Text as="span" bold>sharing what companies look for through
            workshops, resume review, and panels.</Text>
          </Text>
          <Text>July 2020 (flexible)</Text>
        </Box>
        <Box>
          <Heading as="h3" size="md">Engineers, PMs, and UX/Designers</Heading>
          <Text>
            <Text as="span" bold>Share modern best practices and techniques</Text> which make your company's product
            teams successful.
          </Text>
          <Text>July 2020 (flexible)</Text>
        </Box>
      </Grid>
    </Content>
    <Content>
      <Divider marginBottom={8} />
      <Heading as="h3" size="md" marginBottom={4}>Ready to give back? Express your interest below:</Heading>
      <CognitoForm formId={64} />
    </Content>
  </Page>
);
