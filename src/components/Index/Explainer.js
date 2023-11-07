import { Content } from '@codeday/topo/Molecule';
import { Box, Grid, Text, Heading, Image } from '@codeday/topo/Atom';
import ProjectFader from '../ProjectFader'
import Highlight from '../Highlight';

export default function Explainer() {

  return (
    <Content>
      <Heading as="h2" fontSize="5xl" mb={8} textAlign="center">
        Dream of working at a top tech company? Join us!
      </Heading>

      <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={8} mb={16} alignItems="center">
        <Box order={{ base: -1, md: 'unset' }}>
          <Image src="/explainer-1.png" maxWidth={64} alt="" />
        </Box>
        <Box>
          <Heading as="h3" fontSize="2xl" mb={4}>Work with your mentor &amp; other students.</Heading>
          <Text fontSize="lg">
            Tell us what you love in technology, and where you want your career to take you. We&apos;ll match you
            with the perfect <Highlight>industry mentor</Highlight> and up to three other students.
          </Text>
        </Box>
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={8} mb={16} alignItems="center">
        <Box>
          <Heading as="h3" fontSize="2xl" mb={4}>Create or contribute to real-world, open-source projects.</Heading>
          <Text fontSize="lg">
            Learn to ship <Highlight>real software</Highlight> that helps <Highlight>real people</Highlight> using
            the <Highlight>latest industry tools</Highlight>. (Ever wondered what “Kubernetes” is? Or how to set up a
            GraphQL backend in Typescript?)
          </Text>
        </Box>
        <Box order={{ base: -1, md: 'unset' }}>
          <ProjectFader maxWidth={64} duration="10000" />
        </Box>
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={8} mb={16} alignItems="center">
        <Box order={{ base: -1, md: 'unset' }}>
          <Image src="/explainer-3.png" maxWidth={64} alt="" />
        </Box>
        <Box>
          <Heading as="h3" fontSize="2xl" mb={4}>Daily tech talks, career panels, and more.</Heading>
          <Text fontSize="lg" mb={2}>
              What do recruiters look for when you meet them? How does Microsoft deploy machine learning modules?
              How do real engineers make progress on a difficult problem?
          </Text>
          <Text fontSize="lg">
            CodeDay Labs has daily opportunities to <Highlight>learn from leaders</Highlight> and{' '}
            <Highlight>build a professional network.</Highlight>
          </Text>
        </Box>
      </Grid>

      <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={8} mb={16} alignItems="center">
        <Box>
          <Heading as="h3" fontSize="2xl" mb={4}>Get ready to land your dream job or internship next year.</Heading>
          <Text fontSize="lg" mb={2}>
            Learn the skills you need to succeed in <Highlight>technical interviews</Highlight> and{' '}
             <Highlight>strengthen your resume</Highlight> by shipping code in the OSS projects tech companies
             really use.
          </Text>
          <Text fontSize="lg">
          </Text>
        </Box>
        <Box order={{ base: -1, md: 'unset' }}>
          <Image src="/explainer-4.png" maxWidth={64} alt="" rounded="md" />
        </Box>
      </Grid>
    </Content>
  )
}
