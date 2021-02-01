import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Button from '@codeday/topo/Atom/Button';
import Image from '@codeday/topo/Atom/Image';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import List, { Item } from '@codeday/topo/Atom/List';
import Highlight from '../../components/Highlight';
import Testimonials from '../../components/Mentor/Testimonials';
import Page from '../../components/Page';
import { useProgramDates } from '../../providers';
import { IndexQuery } from './index.gql';

export default function Mentor() {
  const { mentorApplicationEndsAt, startsAt, endsAt, mentoringStartsAt } = useProgramDates();
  const weeks = Math.round(endsAt.diff(mentoringStartsAt, 'weeks').weeks);
  const f = { day: 'numeric', month: 'long' };

  return (
    <Page slug="/mentor" title="Mentor">
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
              Students who don't attend a top CS university rely on internships to gain real-world skills and build a
              resume, but most companies focus their internships on the ivy-leagues and other brand-name schools. These
              talented students who just need someone like you to give them a chance to show what they can do.
            </Text>
            <Text>
              As a mentor, you will lead a group of 3 students, helping them build a project based on your experience
              and expertise, in {weeks} weeks. You propose the project, and lead the students through design,
              implementation, test, completion, and presentation of the project.
            </Text>
            <Text>
              You will guide your student team through real world challenges faced by real engineers working on real
              projects.
            </Text>
            <Button as="a" href="/mentor/apply" variantColor="green">Apply Now</Button>{' '}
            <Button
              as="a"
              href="https://www.codeday.org/help/labs/volunteer"
              target="_blank"
              variant="ghost"
              variantColor="green"
            >
              FAQs
            </Button>
            <Button as="a" href="mailto:labs@codeday.org" variant="ghost" variantColor="green">Email Us</Button>
          </Box>
          <Box backgroundColor="red.50" padding={6} marginTop="-2rem">
            <Heading as="h3" size="lg" paddingBottom={2}>Timeline</Heading>
            <Heading as="h4" size="sm">Mentor onboarding:</Heading>
            <Text>On a rolling basis</Text>
            <Heading as="h4" size="sm">Mentor application due:</Heading>
            <Text>{mentorApplicationEndsAt?.toLocaleString(f)}</Text>
            <Heading as="h4" size="sm">Mentor training:</Heading>
            <Text>~{mentorApplicationEndsAt?.plus({ days: 1 }).toLocaleString(f)}</Text>
            <Heading as="h4" size="sm">Student bootcamp:</Heading>
            <Text>
              (No mentor commitment)<br />
              {startsAt?.toLocaleString(f)} &mdash; {startsAt?.set({ weekday: 6 }).toLocaleString(f)}
            </Text>
            <Heading as="h4" size="sm">Mentored program:</Heading>
            <Text>{mentoringStartsAt?.toLocaleString(f)} &mdash; {endsAt?.toLocaleString(f)}</Text>
          </Box>
        </Grid>
      </Content>
      <Content>
        <Testimonials />
      </Content>
      <Content>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <Box paddingTop={6}>
            <Heading as="h3" size="lg" paddingBottom={2}>Mentor Time Commitment</Heading>
            <Text>
              Approximately <Highlight>{5 + (5 * weeks)} hours</Highlight> of mentorship over <Highlight>{weeks}
              weeks, </Highlight>with a <Highlight>flexible schedule:</Highlight>
            </Text>
            <List styleType="disc" stylePos="outside" paddingLeft={4}>
              <Item mb={2}>
                <Text bold mb={0}>Project scoping and training, total:</Text>
                2 hours
              </Item>
              <Item mb={2}>
                <Text bold mb={0}>Two team meetings, per week:</Text>
                2 hours/week
              </Item>
              <Item mb={2}>
                <Text bold mb={0}>One performance feedback form, per week:</Text>
                &frac14;-hour/week
              </Item>
              <Item mb={2}>
                <Text bold mb={0}>Three one-on-ones per student, total:</Text>
                &frac12;-hour &times; 3 students &times; 3 meetings = 4&frac12; hours
              </Item>
              <Item mb={2}>
                <Text bold mb={0}>Extra support as needed, per week:</Text>
                Varies, 0-2 hours/week
              </Item>
            </List>
          </Box>
          <Box paddingTop={6}>
            <Heading as="h3" size="lg" paddingBottom={2}>About CodeDay</Heading>
            <Text>
              CodeDay Labs is a program of CodeDay, an non-profit known for its in-person, hackathon-style events for
              high school and college students, and CodeDay Labs, its online internship-style experience. Since 2009,
              more than 55,000 students have attended CodeDay's events.
            </Text>

            <Heading as="h3" size="lg" paddingBottom={2}>How students benefit</Heading>
            <Text>
              Through this internship-style experience, you're giving students their first sustained hands-on experience
              working with an industry professional. Project management, team work, communications, modern technical
              skills, and standard industry practices.
            </Text>
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  const data = await apiFetch(print(IndexQuery));

  return {
    props: {
      query: data || {},
      random: Math.random(),
    },
    revalidate: 240,
  };
}

