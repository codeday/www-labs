import Head from 'next/head'
import Box, { Grid, Content } from '@codeday/topo/Box';
import Button from '@codeday/topo/Button';
import Image from '@codeday/topo/Image';
import Text, { Heading, Link } from '@codeday/topo/Text';
import List, { Item, Icon } from '@codeday/topo/List';
import Page from '../../components/Page';

export default () => (
  <Page title="Mentor">
    <Content>
      <Image
        width="100%"
        maxHeight="300px"
        borderRadius="md"
        marginBottom={4}
        src="https://img.codeday.org/1024x300/q/p/qp1wmuzr9knezo9vtymbcc3ytopxv3fnzr6kdzvmh34wjamjd8dstokuj1sqae749j.jpg"
      />
      <Heading as="h2" size="xl">Become a Mentor</Heading>
    </Content>
    <Content>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "3fr 1fr" }} gap={6}>
        <Box marginBottom={4}>
          <Text>
            Due to the Covid-19 lockdown, many students in CS, EECS, CSE, and other tech majors are without
            opportunities to further their CS journeys this summer as they normally would. In response to this need,
            CodeDay and Mentors in Tech are offering a virtual internship experience lead by industry volunteers
            for current CS majors.
          </Text>
          <Text>
            Each industry volunteer will lead a group of 3 students, helping them build a project based on the
            volunteer’s experience and expertise, in 6 weeks. Volunteers will lead the students through design,
            implementation, test, completion, and presentation of the project.
          </Text>
          <Text>
            As an industry expert, the volunteer will guide the student team through the project facing real world
            challenges faced by real engineers working on real projects.
          </Text>
          <Button as="a" href="/mentor/apply" variantColor="green">Apply Now</Button>{' '}
          <Button as="a" href="/mentor/faq">FAQ</Button>
        </Box>
        <Box backgroundColor="red.50" padding={6} marginTop="-2rem">
          <Heading as="h3" size="lg" paddingBottom={2}>Timeline</Heading>
          <Heading as="h4" size="sm">Application opens:</Heading>
          <Text>May 11</Text>
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
          <Text><Text as="span" fontWeight="700">Approximately 20 hours,</Text> as follows:</Text>
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
            Volunteers can also participate in various program activities designed for students including tech talks,
            career panels, and other mentoring opportunities.
          </Text>
          <Text>
            Volunteers of participating companies and organizations can also use their volunteer hour matching programs
            to donate to CodeDay.
          </Text>
        </Box>
      </Grid>
    </Content>
  </Page>
)
