import { DateTime } from 'luxon';
import { Box, Grid, Text, Heading, Button } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useProgramDates } from '../../providers';

export default function Tracks() {
  const { registrationsOpenAt, registrationsCloseAt } = useProgramDates();
  const allowApply = registrationsOpenAt < DateTime.local() && registrationsCloseAt > DateTime.local();

  const applyButton = allowApply ? (
    <Button as="a" href="/apply" colorScheme="green" size="lg">Apply</Button>
  ) : <></>;

  return (
    <Content paddingTop={12} paddingBottom={12}>
      <Heading paddingBottom={6} textAlign="center">Multiple tracks. What's your experience level?</Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)"}} gap={6}>
        <Box borderRadius="lg" borderColor="gray.200" borderWidth={1} boxShadow="sm">
            <Box backgroundColor="gray.50" padding={4} color="black"><Heading fontSize="2xl">Init</Heading></Box>
            <Box padding={4} fontSize="lg">
              <Text mb={4}>
                A great first-step for students who have not coded beyond college assignments.
              </Text>
              <Text mb={4}>
                This is the right track for you if you're a college student who has completed some CS classes
                but hasn't built anything independently and without step-by-step guidance.
              </Text>
              <Text mb={4}>
                You'll be matched with a mentor from the technology industry, like at most traditional
                internships, and will make a tiny first contribution to OSS.
              </Text>
              <Text color="gray.500">
                (By invitation only.)
              </Text>
            </Box>
        </Box>

        <Box borderRadius="lg" borderColor="gray.200" borderWidth={1} boxShadow="sm">
            <Box backgroundColor="gray.50" padding={4} color="black"><Heading fontSize="2xl">Intermediate Track</Heading></Box>
            <Box padding={4} fontSize="lg">
              <Text mb={4}>
                More guided projects for college freshmen/sophomores/juniors to help develop engineering mindset.
              </Text>
              <Text mb={4}>
                This is the right track for you if you're a college student who has completed 101/102-level CS classes
                but not much more (or a high school student who's participated in hackathons).
              </Text>
              <Text mb={4}>
                You'll be matched with a mentor from the technology industry, like at most traditional
                internships, and will build a polished app/feature.
              </Text>
              <Text color="gray.500">
                (No fee. Not a paid internship.)
              </Text>
              {applyButton}
            </Box>
        </Box>

        <Box borderRadius="lg" borderColor="gray.200" borderWidth={1} boxShadow="sm">
            <Box backgroundColor="gray.50" padding={4} color="black"><Heading fontSize="2xl">Advanced Track</Heading></Box>
            <Box padding={4} fontSize="lg">
              <Text mb={4}>
                For college juniors/seniors with more CS knowledge, but without the time for a full-time internship.
              </Text>
              <Text mb={4}>
                This is the right track for you if you're a college student with experience beyond the 101/102-level
                CS classes, or a student who has built projects on your own time (e.g. hackathons).
              </Text>
              <Text mb={4}>
                You'll be matched with a mentor from the technology industry, like at most traditional
                internships, and will build a polished app/feature.
              </Text>
              <Text color="gray.500">
                (No fee. Not a paid internship.)
              </Text>
              {applyButton}
            </Box>
        </Box>
      </Grid>
    </Content>
  );
}
