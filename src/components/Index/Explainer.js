import Content from '@codeday/topo/Molecule/Content';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Image from '@codeday/topo/Atom/Image';
import ProjectFader from '../ProjectFader'
import Highlight from '../Highlight';

export default function Explainer() {

  return (
    <Content>
      <Heading as="h2" fontSize="5xl" mb={8} textAlign="center">
        Dream of working at a top tech company? Join us!
      </Heading>

      <Grid templateColumns="1fr 4fr" gap={8} mb={16} alignItems="center">
        <Box>
          <Image src="/explainer-1.png" alt="" />
        </Box>
        <Box>
          <Heading as="h3" fontSize="2xl" mb={4}>Work with your mentor &amp; two other students.</Heading>
          <Text fontSize="lg">
            Tell us what you love in technology, and where you want your career to take you. We&apos;ll match you
            with the perfect <Highlight>industry mentor</Highlight> and up to two other students at your skill level.
          </Text>
          <Text fontSize="lg">
            (Beginner-track attendees: we&apos;ll match you with a former intern from a tech company who has time
            to provide you with more support.)
          </Text>
        </Box>
      </Grid>

      <Grid templateColumns="3fr 1fr" gap={8} mb={16} alignItems="center">
        <Box>
          <Heading as="h3" fontSize="2xl" mb={4}>Create or contribute to real-world, open-source projects.</Heading>
          <Text fontSize="lg">
            Learn to ship <Highlight>real software</Highlight> that helps <Highlight>real people</Highlight> using
            the <Highlight>latest industry tools</Highlight>. (Ever wondered what “Kubernetes” is? Or how to set up a
            GraphQL backend in Typescript?)
          </Text>
          <Text fontSize="lg">
            It's like a real-world internship at a leading tech company, but 100% online.
          </Text>
        </Box>
        <ProjectFader duration="10000" />
      </Grid>

      <Grid templateColumns="1fr 3fr" gap={8} mb={16} alignItems="center">
        <Box>
          <Image src="/explainer-3.png" alt="" />
        </Box>
        <Box>
          <Heading as="h3" fontSize="2xl" mb={4}>Daily tech talks, career panels, and more.</Heading>
          <Text fontSize="lg">
              What do recruiters look for when you meet them? How does Microsoft deploy machine learning modules?
              What does a day-in-the-life look like for a technical artist?
          </Text>
          <Text fontSize="lg">
            CodeDay Labs has daily opportunities to <Highlight>learn from leaders</Highlight> and{' '}
            <Highlight>build a professional network.</Highlight>
          </Text>
        </Box>
      </Grid>

      <Grid templateColumns="3fr 1fr" gap={8} mb={16} alignItems="center">
        <Box>
          <Heading as="h3" fontSize="2xl" mb={4}>Get ready to land your dream job or internship next year.</Heading>
          <Text fontSize="lg">
            Our students have daily opportunities to do <Highlight>practice interviews</Highlight> and get{' '}
            <Highlight>resume feedback</Highlight> from tech hiring managers and recruiters.
          </Text>
          <Text fontSize="lg">
          </Text>
        </Box>
        <Box>
          <Image src="/explainer-4.png" alt="" rounded="md" />
        </Box>
      </Grid>
    </Content>
  )
}
