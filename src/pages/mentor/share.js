import { print } from 'graphql';
import { useRouter } from 'next/router';
import { apiFetch } from '@codeday/topo/utils';
import { Box, Grid, Image, Text, Heading, Link, Button } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../components/Page';
import { useProgramDates } from '../../providers';
import { ShareQuery } from './share.gql';

const IMAGES = ['picture', 'project'];
const MESSAGES = ['mentor', 'help'];
const VARIANTS = MESSAGES.map((m) => IMAGES.map((i) => `${m}_${i}`)).reduce((accum, s) => [...accum, ...s], []);

function Copyable({ children }) {
  return (
    <Box borderLeftWidth={2} pl={4} pt={2} pb={2} mb={4}>
      {children}
    </Box>
  )
}

export default function Share() {
  const router = useRouter()
  const { applied } = router.query;
  const { mentorApplicationEndsAt, startsAt, endsAt, mentoringStartsAt } = useProgramDates();
  const weeks = Math.round(endsAt.diff(mentoringStartsAt, 'weeks').weeks);
  const f = { day: 'numeric', month: 'long' };

  return (
    <Page slug="/mentor/share" title="Spread the Word">
      {typeof applied !== 'undefined' ? (
        <Content mb={12} mt={-8}>
          <Box bg="green.50" borderWidth={1} borderColor="green.800" color="green.900" p={4}>
            <Text>
              <Text as="span" bold>Thanks for applying!</Text> We'll review your application, then reach out to set
              up a call where we can finalize details. Usually it only takes a few days before you'll
              hear from us next.
            </Text>
            <Text>
              In the meantime, would you consider sharing CodeDay Labs with you co-workers or on LinkedIn? Every year
              we have to reject thousands of qualified students simply because we don't have enough mentors.
            </Text>
          </Box>
        </Content>
      ) : (
        <Content mt={-8} mb={12}>
          <Button as="a" href="/mentor" colorScheme="green">&laquo; Back to Mentor Information</Button>
        </Content>
      )}

      <Content mt={-8} mb={12}>
        <Heading as="h2" fontSize="4xl" marginBottom={3}>Spread the Word &mdash; CodeDay Labs Blurbs</Heading>
        <Text>
          Thank you for helping us share our call-for-volunteers! You can use the blurbs below to share CodeDay Labs
          with your colleagues.
        </Text>
      </Content>

      <Content mb={8}>
        <Heading as="h3" fontSize="lg" mb={4}>Email, LinkedIn, Twitter, or Facebook (click image to download)</Heading>
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
          <Copyable>
            CodeDay Labs is looking for mentors to help students get an internship-style experience this summer
            working on real-world software projects. The aspiring software engineers are talented, but aren't recruited
            because they attend small local schools instead of the big-names.
            <br /><br />
            Make a difference in someone's career by giving them a jump start this summer. Mentoring requires a few
            hours a week in from{' '}
            {mentoringStartsAt.toLocaleString({ month: 'long', day: 'numeric' })}{' - '}
            {endsAt.toLocaleString({ month: 'long', day: 'numeric' })}.
            Apply @ <Link href="https://labs.codeday.org/mentor" color="blue.800">https://labs.codeday.org/mentor</Link>
          </Copyable>
          <Copyable>
            CodeDay Labs is a program which provides an internship-style experience working on real-world software
            projects. They're looking for tech industry mentors (SWEs or product managers).
            <br /><br />
            Last year 300 students built real-world projects with guidance from 100 mentors. 80% were from groups
            usually underrepresented in the CS industry. It's a few hours a week on your own schedule from{' '}
            {mentoringStartsAt.toLocaleString({ month: 'long', day: 'numeric' })}{' - '}
            {endsAt.toLocaleString({ month: 'long', day: 'numeric' })}.
            <br /><br />
            Make a difference in someone's career by giving them a jump start this summer. Apply @{' '}
            <Link href="https://labs.codeday.org/mentor" color="blue.800">https://labs.codeday.org/mentor</Link>
          </Copyable>
        </Grid>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap={8}>
          {VARIANTS.map((s) => (
            <a href={`/mentor/share/social_${s}.jpg`} key={s} download>
              <Image src={`/mentor/share/social_${s}.jpg`} alt={`${s.replace('_', ' ')} share picture for LinkedIn`} />
            </a>
          ))}
        </Grid>
      </Content>

      <Content mb={8}>
        <Heading as="h3" fontSize="lg" mb={4}>Instagram (click image to download)</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' }} gap={8}>
          {VARIANTS.map((s) => (
            <a href={`/mentor/share/ig_${s}.jpg`} key={s} download>
              <Image src={`/mentor/share/ig_${s}.jpg`} alt={`${s.replace('_', ' ')} share picture for instagram`} />
            </a>
          ))}
        </Grid>
      </Content>

      <Content mb={8}>
        <Heading as="h3" fontSize="lg" mb={4}>Company Newsletter</Heading>
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8} mb={4}>
          {IMAGES.map((s) => (
            <a href={`/mentor/share/newsletter_${s}.jpg`} key={s} download>
              <Image src={`/mentor/share/newsletter_${s}.jpg`} alt={`${s.replace('_', ' ')} image for company newsletter`} />
            </a>
          ))}
        </Grid>
        <Copyable>
          <strong>
            Mentor students as they build real-world software projects!{' '}
            (
              {mentoringStartsAt.toLocaleString({ month: 'long', day: 'numeric' })}{' - '}
              {endsAt.toLocaleString({ month: 'long', day: 'numeric' })}
            )
          </strong>
          <br /><br />
          CodeDay Labs is a non-profit program where mentors help CS students build a real-world software product. It
          provides a similar experience to a summer internship to students who weren't able to find one.
          <br /><br />
          Last year 300 students contributed to real-world software projects with guidance from 100 mentors. 80% were
          from groups usually underrepresented in the tech industry.
          <br /><br />
          <strong>CodeDay Labs needs mentors! (SWE or product managers)</strong> You can help these students gain
          valuable real-world work experience. The time commitment is only around 5 hours a week over the summer, and
          flexible with your schedule.
          <br /><br />
          Make a difference in someone's career by giving them a jump start this summer.
          Apply by {mentorApplicationEndsAt.toLocaleString({ month: 'numeric', day: 'numeric'})} at{' '}
          <Link href="https://labs.codeday.org/mentor" color="blue.800">https://labs.codeday.org/mentor</Link>
        </Copyable>
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  const data = await apiFetch(print(ShareQuery));

  return {
    props: {
      query: data || {},
      random: Math.random(),
    },
    revalidate: 240,
  };
}

