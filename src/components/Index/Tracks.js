import { DateTime } from 'luxon';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import { useProgramDates } from '../../providers';

export default function Tracks() {
  const { registrationsOpenAt, registrationsCloseAt } = useProgramDates();
  const allowApply = registrationsOpenAt < DateTime.local() && registrationsCloseAt > DateTime.local();

  const applyButton = allowApply ? (
    <Button as="a" href="/apply" variantColor="green" size="lg">Apply</Button>
  ) : <></>;

  return (
    <Content paddingTop={12} paddingBottom={12}>
      <Heading paddingBottom={6} textAlign="center">Multiple tracks. What's your experience level?</Heading>
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr"}} gap={6}>
        <Box borderRadius="lg" borderColor="gray.200" borderWidth={1} boxShadow="sm">
            <Box backgroundColor="gray.50" padding={4}><Heading fontSize="2xl">Intermediate Track</Heading></Box>
            <Box padding={4} fontSize="lg">
              <Text>
                More guided projects for college freshmen/sophomores/juniors with technical skills, but limited
                experience working independently.
              </Text>
              <Text>
                This is the right track for you if you're a college students who has completed 101/102-level CS classes
                but not much more (and high school students with experience building projects at hackathons).
              </Text>
              <Text>
                You'll be matched with a mentor from the technology industry, like at most traditional in-person
                internships, and will build a polished app/feature.
              </Text>
              <Text color="gray.500">
                (No fee; not a paid internship.)
              </Text>
              {applyButton}
            </Box>
        </Box>

        <Box borderRadius="lg" borderColor="gray.200" borderWidth={1} boxShadow="sm">
            <Box backgroundColor="gray.50" padding={4}><Heading fontSize="2xl">Advanced Track</Heading></Box>
            <Box padding={4} fontSize="lg">
              <Text>
                For college juniors/seniors who have higher-level CS knowledge or others with significant experience
                building projects.
              </Text>
              <Text>
                This is the right track for you if you're a college student with experience beyond the 101/102-level
                CS or Engineering classes, or a student who has built projects on your own time.
              </Text>
              <Text>
                You'll be matched with a mentor from the technology industry, like at most traditional in-person
                internships, and will build a polished app/feature.
              </Text>
              <Text color="gray.500">
                (No fee; not a paid internship.)
              </Text>
              {applyButton}
            </Box>
        </Box>
      </Grid>
    </Content>
  );
}
