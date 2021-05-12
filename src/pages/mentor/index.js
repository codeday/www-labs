import { useEffect } from 'react';
import { print } from 'graphql';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import LinkedInTag from 'react-linkedin-insight';
import { apiFetch } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Button from '@codeday/topo/Atom/Button';
import Image from '@codeday/topo/Atom/Image';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import List, { Item } from '@codeday/topo/Atom/List';
import Testimonials from '../../components/Mentor/Testimonials';
import Page from '../../components/Page';
import { useProgramDates } from '../../providers';
import { IndexQuery } from './index.gql';

const ReactPlayer = dynamic(
  () => import('react-player/lazy'),
  { ssr: false },
);

function Highlight({children}) {
  return <Text as="span" bg="yellow.200" p={1}>{children}</Text>;
}

export default function Mentor() {
  const { mentorApplicationEndsAt, startsAt, endsAt, mentoringStartsAt } = useProgramDates();
  const weeks = Math.round(endsAt.diff(mentoringStartsAt, 'weeks').weeks);
  const { query } = useRouter();
  const f = { day: 'numeric', month: 'long' };
  useEffect(() => typeof window !== 'undefined' && LinkedInTag.init('1831116', null, false), typeof window);

  return (
    <Page slug="/mentor" title="Tech Industry Mentor Volunteering">
        <Content mb={4} mt={-8}>
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
      <Content>
        <Image
          width="100%"
          maxHeight="300px"
          borderRadius="md"
          marginBottom={4}
          src="https://img.codeday.org/w=1024;h=220;fit=crop;crop=faces,edges/q/p/qp1wmuzr9knezo9vtymbcc3ytopxv3fnzr6kdzvmh34wjamjd8dstokuj1sqae749j.jpg"
        />
        <Heading as="h2" size="xl">Become a Mentor</Heading>
        <Text bold>(~5 hours a week for 5 weeks, flexible schedule)</Text>
      </Content>
      <Content>
        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr", lg: "3fr 1fr" }} gap={6}>
          <Box marginBottom={4}>
            <Text>
              Students who attend affordable local colleges rely on internships to gain real-world skills and build a
              resume, but most companies focus their internships on brand-name schools.{' '}
              <Highlight>These talented students need someone like you to give them the chance to show what they
                can do.</Highlight>
            </Text>
            <Text>
              Mentors <Highlight>guide a team of 3 students as they build an open-source project in{' '}
              {weeks} weeks.</Highlight> You propose the project, and lead the students through design,
              implementation, test, completion, and presentation of the project.
            </Text>
            <Text>
              Like a manager in a real internship, you'll be there for supervision &amp; guidance. (We have staff
              to help the students with day-to-day debugging!)
            </Text>
            <Button
              as="a"
              href={`/mentor/apply${query.r ? `?r=${query.r}` : ''}`}
              variantColor="green"
              size="lg"
            >
              Sign Up Now
            </Button>{' '}
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
            <Button as="a" href="/mentor/share" variant="ghost" variantColor="green">💌 Share With Your Company</Button>
          </Box>
          <Box backgroundColor="red.50" padding={6} marginTop="-2rem">
            <Heading as="h3" size="lg" paddingBottom={2}>Timeline</Heading>
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
        <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
          <Box>
            <Heading as="h3" fontSize="md" mb={2}>Why students think CodeDay Labs is important:</Heading>
            <ReactPlayer
              url="https://stream.mux.com/bD6wcyrGiJ01aijjv3H00Dl7PzjKFxK53v.m3u8"
              controls={true}
              config={{
                attributes: {
                  poster: "https://image.mux.com/bD6wcyrGiJ01aijjv3H00Dl7PzjKFxK53v/thumbnail.jpg?width=628&fit_mode=pad&time=7.5884"
                }
              }}
              width="100%"
            />
          </Box>
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
              Approximately <Highlight>{5 + (5 * weeks)} hours</Highlight> of mentorship over <Highlight>
              {weeks} weeks,</Highlight> with a <Highlight>flexible schedule:</Highlight>
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

