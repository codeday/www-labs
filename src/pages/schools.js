import { print } from 'graphql';
import { apiFetch, useDisclosure } from '@codeday/topo/utils';
import { Box, Grid, Button, Divider, Text, Heading, Link, List, ListItem as Item } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../components/Page';
import { SchoolsQuery } from './schools.gql';
import { useProgramDates, useQuery } from '../providers';

export default function Edu() {
  const { startsAt, endsAt } = useProgramDates();
  const weeks = Math.round(endsAt.diff(startsAt, 'weeks').weeks);
  const repositories = useQuery('labs.repositories', []);

  return (
    <Page slug="/schools" title="Open Source Internships for Colleges and High Schools">
      <Content mt={-8}>
        <Heading as="h2" mb={8}>Open-Source Internships for Colleges and High Schools</Heading>
        <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={8}>
          <Box>
            <Text mb={2}>
              CodeDay's Labs program offers an internship-style program where students work on open-source software
              under the guidance of an industry mentor. Students learn to connect in-class learning to software industry
              practices, and build their professional network.
            </Text>
            <Text mb={2}>
              The CodeDay Labs program has existed in its current form since 2017, and since then, thousands of students
              have gone on to secure leading tech internships and full-time careers after participating. (Results were
              recently shared at SIGCSE TS 2021 and ITiCSE 2022.)
            </Text>
            <Text mb={2}>
              For more info, email us at <Link href="mailto:labs@codeday.org">labs@codeday.org</Link> or call 888-607-7763.
              Availability varies depending on number of students.
            </Text>
            <Box mt={8}>
              <Button as="a" mr={2} mb={2} href="/deck-schools.pdf" colorScheme="green">Full Details &mdash; Slide Deck</Button>
              <Button as="a" href="mailto:labs@codeday.org" mb={2}>Email Us</Button><br />
              <Link href="https://showcase.codeday.org/projects/labs/1" target="_blank">Past Project Examples</Link><br />
            </Box>
          </Box>
          <Box>
            <Heading as="h3" fontSize="md" mb={4}>Overview</Heading>
            <List styleType="disc" stylePos="outside" paddingLeft={4}>
              <Item>3-12 week internship-style program, year-round.</Item>
              <Item>$1,200-$1,600/student.</Item>
              <Item>(50% discount available for most colleges.)</Item>
              <Item>Teams of 2-4 students + 1 experienced CS mentor from a leading tech company.</Item>
              <Item>Includes onboarding week course and ongoing coding support from our TAs.</Item>
            </List>
          </Box>
        </Grid>
      </Content>
      <Content>
        <Divider />
            <Heading as="h3" fontSize="md" mb={4} mt={6}>
                Students can make a contribtion to software in use by millions of people, such as:
            </Heading>
            <Box mt={6}>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={{ base: 0, md: 4}}>
                {[0, 1, 2].map(i => (
                  <List styleType="disc" stylePos="outside" paddingLeft={4}>
                      {repositories.slice(Math.floor(i * (repositories.length/3)), Math.floor((i+1) * (repositories.length / 3))).map(r => (
                        <Item key={r.id}><Link href={r.url} target="_blank">{r.name}</Link></Item>
                      ))}
                  </List>
                ))}
              </Grid>
            </Box>
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

