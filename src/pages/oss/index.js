import { useEffect } from 'react';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import LinkedInTag from 'react-linkedin-insight';
import { apiFetch } from '@codeday/topo/utils';
import { Box, Grid, Button, Image, Text, Heading, Link, List, ListItem as Item } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../components/Page';
import { useProgramDates } from '../../providers';
import { IndexQuery } from './index.gql';
import { useColorModeValue } from '@codeday/topo/Theme';

export default function Mentor() {
  const { mentorApplicationFocusAt, mentorApplicationEndsAt, startsAt, endsAt, mentoringStartsAt } = useProgramDates();
  const weeks = Math.round(endsAt.diff(mentoringStartsAt, 'weeks').weeks);
  const { query } = useRouter();
  const f = { day: 'numeric', month: 'long' };
  useEffect(() => typeof window !== 'undefined' && LinkedInTag.init('1831116', null, false), typeof window);
  const qs = (new URLSearchParams(query || {})).toString() || '';

  return (
    <Page slug="/oss" title="CONTRIBUTING.md (CodeDay Labs for OSS Maintainers)">
      <Content mt={-8}>
        <Image
          width="100%"
          maxHeight="300px"
          borderRadius="md"
          marginBottom={4}
          src="https://img.codeday.org/w=1024;h=220;fit=crop;crop=faces,edges/q/p/qp1wmuzr9knezo9vtymbcc3ytopxv3fnzr6kdzvmh34wjamjd8dstokuj1sqae749j.jpg"
        />
        <Heading as="h2" size="xl">Recruit new contributors to your OSS project!</Heading>
        <Text bold>Help students gain real-world experience while becoming contributors to your project.</Text>
      </Content>
      <Content>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "3fr 1fr" }} gap={6}>
          <Box marginBottom={4}>
            <Text mb={2}>
              Most college students have only learned how to follow a predefined set of instructions through classwork.
              There’s no sense of discovery, or the feeling of “I did this myself.”
            </Text>
            <Text mb={2}>
              CodeDay Labs provides students with independent experience contributing to real-world, large-scale software
              projects, so they can gain problem-solving skills and get the satisfaction of becoming a contributor to the
              world of Open Source Software.
            </Text>
            <Button
              as="a"
              href={`/oss/signup`}
              colorScheme="green"
              size="lg"
            >
              Sign Up Your Project
            </Button>{' '}
            <Button as="a" href="mailto:labs@codeday.org" variant="ghost" colorScheme="green">Email Us</Button>
          </Box>
          <Box backgroundColor={useColorModeValue('red.50', 'red.900')} padding={6} marginTop="-2rem">
            <Heading as="h3" size="lg" paddingBottom={2}>Next Session</Heading>
            <Heading as="h4" size="sm">Project cutoff:</Heading>
            <Text>{mentorApplicationEndsAt?.toLocaleString(f)}</Text>
            <Heading as="h4" size="sm">Students assigned:</Heading>
            <Text>
              {startsAt?.toLocaleString(f)}
            </Text>
            <Heading as="h4" size="sm">Students work on issues:</Heading>
            <Text>{mentoringStartsAt?.toLocaleString(f)} &mdash; {endsAt?.toLocaleString(f)}</Text>
          </Box>
        </Grid>
      </Content>
      <Content>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <Box paddingTop={6}>
            <Heading as="h3" size="lg" paddingBottom={2}>How you'll contribute:</Heading>
            <Text>
              By providing CodeDay students with a few issues to work on in your project,
              you&apos;re ensuring that they get real-world experience working on projects that
              leave an impact. Here's how it will work:
            </Text>
            <List styleType="disc" stylePos="outside" paddingLeft={4}>
              <Item mb={2}>Sign up above.</Item>
              <Item mb={2}>
                Create issues in your repository, and add "For CodeDay Labs" in the description.{' '}
                <Link as="a" href="https://codeday.notion.site/Shaping-An-Issue-2fa463fdfb1d48f9ba1d1d1ef2081d5f" target="_blank">
                  (Not sure where to start? Check out our issue guide.)
                </Link>
              </Item>
              <Item mb={2}>CodeDay will review issues and provide any questions or feedback.</Item>
              <Item mb={2}>CodeDay will match students, who will comment to claim the issue.</Item>
            </List>
            <Text>
              "good-first-issue" scoped issues will be solved within 2 months if opened from Fall-Spring. Larger issues
              will be reserved for the spring and summer.
            </Text>
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

