import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Button from '@codeday/topo/Atom/Button';
import Divider from '@codeday/topo/Atom/Divider';
import Deck from '@codeday/topo/Molecule/Deck';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import List, { Item } from '@codeday/topo/Atom/List';
import Page from '../components/Page';
import { SchoolsQuery } from './schools.gql';
import { useProgramDates } from '../providers';

export default function Edu() {
  const { startsAt, endsAt } = useProgramDates();
  const weeks = Math.round(endsAt.diff(startsAt, 'weeks').weeks);

  return (
    <Page slug="/schools" title="Open Source Internships for Colleges and High Schools">
      <Content mt={-8}>
        <Heading as="h2" mb={8}>Open-Source Internships for Colleges and High Schools</Heading>
        <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={8}>
          <Box>
            <Text>
              CodeDay Labs is an internship-style program where students work on open-source software under the guidance
              of an industry mentor. Students learn to connect in-class learning to software industry practices, and
              build their professional network.
            </Text>
            <Text>
              The CodeDay Labs program has existed in its current form since 2017, and since then, thousands of students
              have gone on to secure leading tech internships and full-time careers after participating. (Results were
              recently shared at SIGCSE TS 2021.)
            </Text>
            <Text>
              For more info, email us at <Link href="mailto:labs@codeday.org">labs@codeday.org</Link> or call 888-607-7763.
              Deadlines vary from March - May depending on number of students.
            </Text>
            <Box mt={8}>
              <Button as="a" href="mailto:labs@codeday.org" variantColor="green" mb={2}>Email Us</Button><br />
              <Link href="https://showcase.codeday.org/projects/labs/1" target="_blank">Past Project Examples</Link><br />
              <Link href="/deck-schools.pdf">Download Slide Deck</Link>
            </Box>
          </Box>
          <Box>
            <Heading as="h3" fontSize="md" mb={4}>Overview</Heading>
            <List styleType="disc" stylePos="outside" paddingLeft={4}>
              <Item>
                {weeks}-12 week internship-style program starting{' '}
                {startsAt.toLocaleString({ day: 'numeric', month: 'numeric'})}.
              </Item>
              <Item>Teams are 3 students + 1 experienced SWE from a leading tech company.</Item>
              <Item>$450-600/student for a guaranteed admission slot.</Item>
            </List>
          </Box>
        </Grid>
      </Content>
      <Content>
        <Divider />
        <Heading as="h3" mt={4} mb={2} fontSize="lg">Full Details &mdash; Slide Deck</Heading>
      </Content>
      <Content wide>
        <Deck allowDownload src="/deck-schools.pdf" />
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  const data = await apiFetch(print(SchoolsQuery));

  return {
    props: {
      query: data || {},
      random: Math.random(),
    },
    revalidate: 240,
  };
}

