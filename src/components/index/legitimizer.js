import Box, { Grid, Content } from '@codeday/topo/Box';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Image, { Slideshow } from '@codeday/topo/Image';
import Button from '@codeday/topo/Button';

const Featured = (props) => <Text as="span" borderColor="green.500" borderBottomWidth={2} fontWeight="700" {...props} />

export default () => (
  <Content marginTop={12}>
    <Box paddingTop={8} borderColor="green.500" backgroundColor="green.50" color="green.900" borderWidth={1} borderRadius="lg">
      <Heading paddingBottom={3} textAlign="center">The best summer option for aspiring programmers.</Heading>
      <Box fontSize="lg" textAlign="center" paddingLeft={32} paddingRight={32}>
        <Text paddingBottom={6}>
          Worried an online tech internship isn't for you? Don't be. <Featured>More than 50,000 students</Featured>{' '}
          have attended our programs, and we've been <Featured>running this online internship since 2017.</Featured>
        </Text>
        <Button as="a" href="/apply" marginBottom={8} variantColor="gray" size="lg" disabled>Applications Closed</Button>
      </Box>
    </Box>
  </Content>
);
