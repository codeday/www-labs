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
  const { mentorApplicationEndsAt, startsAt, endsAt, mentoringStartsAt } = useProgramDates();
  const weeks = Math.round(endsAt.diff(mentoringStartsAt, 'weeks').weeks);
  const f = { day: 'numeric', month: 'long' };

  return (
    <Page slug="/mentor/share" title="Spread the Word">
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl" marginBottom={3}>Spread the Word</Heading>
      </Content>

      <Content mb={8}>
        <Heading as="h3" fontSize="lg" mb={4}>LinkedIn, Twitter, or Facebook (click image to download)</Heading>
        <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} gap={8}>
          <Copyable>
            CodeDay Labs is looking for mentors to help students get an internship-style experience this summer
            working on open source software. The aspiring software engineers are talented, but aren't recruited because
            they attend small local schools instead of the big-names.
            <br /><br />
            Mentoring requires a few hours a week in from{' '}
            {mentoringStartsAt.toLocaleString({ month: 'long', day: 'numeric' })}{' - '}
            {endsAt.toLocaleString({ month: 'long', day: 'numeric' })}.
            Apply @ https://labs.codeday.org/mentor
          </Copyable>
          <Copyable>
            CodeDay Labs is a program which provides an internship-style experience working on open-source projects.
            They're looking for tech industry mentors (SWEs or product managers).
            <br /><br />
            Last year 300 students contributed to open source with guidance from 100 mentors. 80% were from groups
            usually underrepresented in the CS industry. It's a few hours a week on your own schedule from{' '}
            {mentoringStartsAt.toLocaleString({ month: 'long', day: 'numeric' })}{' - '}
            {endsAt.toLocaleString({ month: 'long', day: 'numeric' })}.
            <br /><br />
            Apply @ https://labs.codeday.org/mentor
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
            Mentor students as they contribute to open source software!{' '}
            (
              {mentoringStartsAt.toLocaleString({ month: 'long', day: 'numeric' })}{' - '}
              {endsAt.toLocaleString({ month: 'long', day: 'numeric' })}
            )
          </strong>
          <br /><br />
          CodeDay Labs is a non-profit program where mentors help CS students make contributions to an OSS project. It
          provides a similar experience to a summer internship to students who weren't able to find one.
          <br /><br />
          Last year 300 students contributed to open source with guidance from 100 mentors. 80% were from groups
          usually underrepresented in the tech industry.
          <br /><br />
          <strong>CodeDay Labs needs mentors! (SWE or product managers)</strong> You can help these students gain
          valuable real-world work experience. The time commitment is only around 5 hours a week over the summer, and
          flexible with your schedule.
          <br /><br />
          Apply by {mentorApplicationEndsAt.toLocaleString({ month: 'numeric', day: 'numeric'})} at{' '}
          <Link href="https://labs.codeday.org/mentor">https://labs.codeday.org/mentor</Link>
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

