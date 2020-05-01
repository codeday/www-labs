import Box, { Grid, Content } from '@codeday/topo/Box';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Image, { Slideshow } from '@codeday/topo/Image';
import Button from '@codeday/topo/Button';

export default () => (
  <Content paddingTop={12} paddingBottom={12}>
    <Heading paddingBottom={6} textAlign="center">Two tracks. What's your experience level?</Heading>
    <Grid templateColumns={{ base: "1fr", md: "1fr 1fr"}} gap={6}>
      <Box borderRadius="lg" borderColor="gray.200" borderWidth={1} boxShadow="sm">
          <Box backgroundColor="gray.50" padding={4}><Heading fontSize="2xl">Beginner Track</Heading></Box>
          <Box padding={4} fontSize="lg">
            <Text>
              A guided experience which is best for people with some CS knowledge, but who don't have prior
              experience working on complex projects.
            </Text>
            <Text>
              This is probably the right track for you if you're a high school student who's taken AP CS A, or a
              college student with 101-level experience.
            </Text>
            <Text>
              You'll work with a seasoned member of CodeDay staff who will guide you through your first experience
              building something with real-world implications.
            </Text>
            <Text color="gray.500">
              (Not a paid internship.)
            </Text>
            <Button as="a" href="/apply" variantColor="green" size="lg">Apply for the Beginner Track</Button>
          </Box>
      </Box>

      <Box borderRadius="lg" borderColor="gray.200" borderWidth={1} boxShadow="sm">
          <Box backgroundColor="gray.50" padding={4}><Heading fontSize="2xl">Advanced Track</Heading></Box>
          <Box padding={4} fontSize="lg">
            <Text>
              This track is the most similar to a traditional in-person internship, for those students who have
              higher-level CS experience or significant prior experience.
            </Text>
            <Text>
              This is the right track for you if you're a college student with experience beyond the 101/102-level
              CS classes, or a student who has built projects on your own time.
            </Text>
            <Text>
              You'll be matched with a mentor from the technology industry, like at most traditional in-person
              internships, and will build a polished app/feature.
            </Text>
            <Text color="gray.500">
              (May receive a stipend if selected by our sponsors.)
            </Text>
            <Button as="a" href="/apply" variantColor="green" size="lg">Apply for the Advanced Track</Button>
          </Box>
      </Box>
    </Grid>
  </Content>
)
