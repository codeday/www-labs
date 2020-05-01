import Box, { Grid, Content } from '@codeday/topo/Box';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Image, { Slideshow } from '@codeday/topo/Image';
import Button from '@codeday/topo/Button';

const Feature = (props) => <Text fontWeight="700" color="green.700" as="span" {...props} />

export default () => (
  <Content>
    <Heading paddingBottom={6} fontSize="5xl" textAlign="center">
      Dream of working at a top tech company?
    </Heading>
    <Grid templateColumns={{ base: "1fr", sm: "4fr 8fr"}} gap={6}>
      <Box>
        <Image
          borderRadius="sm"
          boxShadow="sm"
          width="100%"
          src="https://img.codeday.org/600x400/z/c/zc84reqxyyqnj63hhkaucdm3df6spjnnv195zeizq9yreaqjhcmdk1ju3u94wgkuo7.jpg"
        />
      </Box>
      <Box fontSize="lg">
        <Text>
          Join us! You'll match with an industry mentor and{' '} <Feature>create a real-world project in
          four weeks.</Feature> It's like a real-world internship at a leading tech company, but 100% online.
        </Text>
        <Text>
          That means you'll get to <Feature>learn the latest industry tools.</Feature> (Ever wondered what
          &ldquo;Kubernetes&rdquo; is? Or how real companies set up a GraphQL backend?)
        </Text>
        <Text>
          (Worried an online internship might not be right for you? Don't be! <Feature>This is the fourth year we've
          done this.</Feature> You're in for an amazing summer.)
        </Text>
      </Box>
    </Grid>
  </Content>
)
