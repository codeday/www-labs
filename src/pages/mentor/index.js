import Head from 'next/head'
import Box, { Grid, Content } from '@codeday/topo/Box';
import Button from '@codeday/topo/Button';
import Image from '@codeday/topo/Image';
import Text, { Heading, Link } from '@codeday/topo/Text';
import List, { Item, Icon } from '@codeday/topo/List';
import Page from '../../components/Page';
import MentorSeo from '../../components/MentorSeo';

export default () => (
  <Page slug="/mentor" title="Mentor">
    <MentorSeo />
    <Content>
      <Image
        width="100%"
        maxHeight="300px"
        borderRadius="md"
        marginBottom={4}
        src="https://img.codeday.org/w=1024;h=300;fit=crop;crop=faces,edges/q/p/qp1wmuzr9knezo9vtymbcc3ytopxv3fnzr6kdzvmh34wjamjd8dstokuj1sqae749j.jpg"
      />
      <Heading as="h2" size="xl">Become a Mentor</Heading>
    </Content>
    <Content>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "3fr 1fr" }} gap={6}>
        <Box marginBottom={4}>
          <Text>
            Due to the Covid-19 lockdown, many students in CS, EECS, CSE, and other tech majors are without
            opportunities to further their CS journeys this summer as they normally would. In response,
            CodeDay and <Link href="https://mentorsintech.com" target="_blank">MinT</Link> are offering a virtual
            internship experience lead by industry volunteers.
          </Text>
          <Text>
            As a mentor, you will lead a group of 3 students, helping them build a project based on your experience and
            expertise, in 4 weeks. Volunteers will lead the students through design, implementation, test, completion,
            and presentation of the project.
          </Text>
          <Text>
            You will guide your student team through real world challenges faced by real engineers working on real
            projects.
          </Text>
          <Button as="a" href="/mentor/apply" variantColor="green">Apply Now</Button>{' '}
          <Button as="a" href="/mentor/faq" variant="ghost" variantColor="green">FAQs</Button>
          <Button as="a" href="mailto:labs@codeday.org" variant="ghost" variantColor="green">Email Us</Button>
        </Box>
        <Box backgroundColor="red.50" padding={6} marginTop="-2rem">
          <Heading as="h3" size="lg" paddingBottom={2}>Timeline</Heading>
          <Heading as="h4" size="sm">Application opens:</Heading>
          <Text>May 1</Text>
          <Heading as="h4" size="sm">Mentor interviews:</Heading>
          <Text>May-June (rolling)</Text>
          <Heading as="h4" size="sm">Mentor Training:</Heading>
          <Text>Late June (TBA)</Text>
          <Heading as="h4" size="sm">Program dates:</Heading>
          <Text>July 6 to July 31</Text>
        </Box>
      </Grid>
    </Content>
    <Content>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        <Box paddingTop={6}>
          <Heading as="h3" size="lg" paddingBottom={2}>Mentor Time Commitment</Heading>
          <Text><Text as="span" fontWeight="700">Approximately 20 hours total,</Text> across 4 weeks, as follows:</Text>
          <List styleType="disc" stylePos="outside" paddingLeft={4}>
            <Item>Training, project scoping, and preparations:<br />2 hours</Item>
            <Item>
              2 weekly, 1-hour meetings with student team:<br />
              2 hours &times; 4 weeks = 8 hours
            </Item>
            <Item>
              Weekly documentation of team progress:<br />
              &frac12; hour &times; 4 weeks = 2 hours
            </Item>
            <Item>
              3 half-hour 1:1 advising sessions with each student:<br />
              &frac12; hour &times; 3 students &times; 3 meetings = 5 hours
            </Item>
            <Item>
              Final project presentation session and feedback:<br />
              2 hours
            </Item>
          </List>
        </Box>
        <Box paddingTop={6}>
          <Heading as="h3" size="lg" paddingBottom={2}>How students benefit</Heading>
          <Text>
            Through this virtual internship experience, the student participants will have had their first sustained
            hands on experience of working with an industry professional. Students will learn from the industry
            volunteer: project management, team work, communications, modern technical skills, and standard industry
            practices.
          </Text>

          <Heading as="h3" size="lg" paddingBottom={2}>More ways to Help</Heading>
          <Text>
            We're looking for volunteers who can also help host program activities including tech talks, career panels,
            and other mentoring opportunities. (We need non-technical volunteers too!)
          </Text>
          <Text>
            As a volunteer, your company may also provide a donation to CodeDay as part of hour matching programs!
          </Text>
        </Box>
      </Grid>
    </Content>
  </Page>
)
