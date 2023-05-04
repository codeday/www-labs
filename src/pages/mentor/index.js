import { useEffect } from 'react';
import { DateTime } from 'luxon';
import { print } from 'graphql';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import LinkedInTag from 'react-linkedin-insight';
import { apiFetch } from '@codeday/topo/utils';
import { Box, Grid, Button, Image, Text, Heading, Link, List, ListItem as Item } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Testimonials from '../../components/Mentor/Testimonials';
import Page from '../../components/Page';
import { useProgramDates } from '../../providers';
import { IndexQuery } from './index.gql';
import { useColorMode } from '@codeday/topo/Theme';

const ReactPlayer = dynamic(
  () => import('react-player/lazy'),
  { ssr: false },
);

function Highlight({children}) {
  const { colorMode } = useColorMode();
  return <Text as="span" bg={ colorMode === 'dark' ? 'yellow.800' : 'yellow.200'} p={1}>{children}</Text>;
}

export default function Mentor() {
  const { colorMode } = useColorMode();
  const { mentorApplicationFocusAt, mentorApplicationEndsAt, startsAt, endsAt, mentoringStartsAt } = useProgramDates();
  const weeks = Math.round(endsAt.diff(mentoringStartsAt, 'weeks').weeks);
  const { query } = useRouter();
  const f = { day: 'numeric', month: 'long' };
  useEffect(() => typeof window !== 'undefined' && LinkedInTag.init('1831116', null, false), typeof window);
  const qs = (new URLSearchParams(query || {})).toString() || '';

  return (
    <Page slug="/mentor" title="Tech Industry Mentor Volunteering">
        {mentorApplicationFocusAt > DateTime.local() && (
          <Content mb={12} mt={-8}>
            <Box bg="green.50" borderWidth={1} borderColor="green.800" color="green.900" p={4} rounded="sm">
              <Text mb={0}>
                <Text as="span" bold>
                  Engineering leader looking to reach CS talent from non-target schools?
                </Text>{' '}
                Help us admit more bright students, and grow your talent pipeline by sponsoring CodeDay Labs.
                Reach out at <Link href="mailto:sponsor@codeday.org">sponsor@codeday.org</Link> or{' '}
                <Link href="tel:+12062799026">206-279-9026</Link>.
              </Text>
            </Box>
          </Content>
        )}
      <Content mt={-8}>
        <Image
          width="100%"
          maxHeight="300px"
          borderRadius="md"
          marginBottom={4}
          src="https://img.codeday.org/w=1024;h=220;fit=crop;crop=faces,edges/q/p/qp1wmuzr9knezo9vtymbcc3ytopxv3fnzr6kdzvmh34wjamjd8dstokuj1sqae749j.jpg"
        />
        <Heading as="h2" size="xl">Help students break into tech as a Labs mentor!</Heading>
        <Text bold>(1-4 hours a week for 3-12 weeks, flexible schedule)</Text>
      </Content>
      <Content>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "3fr 1fr" }} gap={6}>
          <Box marginBottom={4}>
            <Text mb={2}>
              Students who attend affordable local colleges rely on internships to gain real-world skills and build a
              resume, but most companies focus their internships on brand-name schools.{' '}
              <Highlight>These talented students need someone like you to give them the chance to show what they
                can do.</Highlight>
            </Text>
            <Text mb={2}>
              Mentors <Highlight>guide a team of 3 students as they build an real-world project in{' '}
              3-{weeks} weeks.</Highlight> You propose the project, and lead the students through design,
              implementation, test, completion, and presentation of the project.
            </Text>
            <Text mb={4}>
              Like a manager in a job, you'll be there for supervision &amp; guidance. Our staff will help students with
              day-to-day debugging if they need it!
            </Text>
            <Button
              as="a"
              href={`https://www.codeday.org/volunteer/labs?return=labs&returnto=mentor%2Fshare%3Fapplied&${qs}`}
              colorScheme="green"
              size="lg"
            >
              Sign Up Now
            </Button>{' '}
            <Button
              as="a"
              href="https://www.codeday.org/help/labs/volunteer"
              target="_blank"
              variant="ghost"
              colorScheme="green"
            >
              FAQs
            </Button>
            <Button as="a" href="mailto:labs@codeday.org" variant="ghost" colorScheme="green">Email Us</Button>
            <Button as="a" href="/mentor/share" variant="ghost" colorScheme="green">💌 Share With Your Company</Button>
          </Box>
          <Box backgroundColor={ colorMode === 'dark' ? 'red.900' : 'red.50'} padding={6} marginTop="-2rem">
            <Heading as="h3" size="lg" paddingBottom={2}>Next Session</Heading>
            <Text pb={2} fontSize="sm" fontStyle="italic">We run sessions year-round. You can apply now and mentor in a future session if these dates don't work.</Text>
            <Heading as="h4" size="sm">Mentor application due:</Heading>
            <Text mb={2}>{mentorApplicationEndsAt?.toLocaleString(f)}</Text>
            <Heading as="h4" size="sm">Mentor training:</Heading>
            <Text mb={2}>~{mentorApplicationEndsAt?.plus({ days: 1 }).toLocaleString(f)}</Text>
            <Heading as="h4" size="sm">Student bootcamp:</Heading>
            <Text mb={2}>
              (No mentor commitment)<br />
              {startsAt?.toLocaleString(f)} &mdash; {startsAt?.set({ weekday: 6 }).toLocaleString(f)}
            </Text>
            <Heading as="h4" size="sm">Mentored program:</Heading>
            <Text>{mentoringStartsAt?.toLocaleString(f)} &mdash; {endsAt?.toLocaleString(f)}</Text>
          </Box>
        </Grid>
      </Content>
      <Content>
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
          <Box>
            <Heading as="h3" fontSize="md" mb={2}>What mentors think of CodeDay Labs:</Heading>
            <ReactPlayer
              url="https://stream.mux.com/zkKtHqXgY3OfmZ6tC5hmrc1ePdT02DzOx.m3u8"
              controls={true}
              config={{
                attributes: {
                  poster: "https://image.mux.com/zkKtHqXgY3OfmZ6tC5hmrc1ePdT02DzOx/thumbnail.jpg?width=628&fit_mode=pad&time=9.6564"
                }
              }}
              width="100%"
            />
          </Box>
          <Box mt={8}>
            <Testimonials />
          </Box>
        </Grid>
      </Content>
      <Content>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
          <Box paddingTop={6}>
            <Heading as="h3" size="lg" paddingBottom={2}>Mentor Time Commitment</Heading>
            <Text>
              <Highlight>1-4hr/wk</Highlight> of mentorship over <Highlight>3-
              {weeks} weeks,</Highlight> with a <Highlight>flexible schedule:</Highlight>
            </Text>
            <List styleType="disc" stylePos="outside" paddingLeft={4}>
              <Item mb={2}>
                <Text bold mb={0}>1-2 team meetings, per week:</Text>
                1-3 hours/week
              </Item>
              <Item mb={2}>
                <Text bold mb={0}>Sharing performance feedback:</Text>
                &frac14;-hour/week
              </Item>
              <Item mb={2}>
                <Text bold mb={0}>Three one-on-ones per student, total:</Text>
                &frac12;-hour &times; 3 students &times; 3 meetings = 4&frac12; hours
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

