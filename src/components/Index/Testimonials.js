import { Box, Grid, Text, Heading, Image } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Highlight from '../Highlight';
import { useQuery, useSlideshow } from '../../providers';

const SIZE = 'xs';

export default function Testimonials(props) {
  const testimonials = useQuery('cms.testimonials.items', []);
  const i = useSlideshow(testimonials.length, 6000);

  if (testimonials.length === 0) return <></>;

  return (
    <Content {...props}>
      <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} alignItems="center" gap={8}>
        <Box textAlign="center">
          <Heading as="h3">
            We've helped <Highlight>thousands of students</Highlight> get their start in technology since 2009.
          </Heading>
        </Box>

        <Box position="relative" height={SIZE} ml={-4}>
          {testimonials.map((testimonial, j) => (
            <Grid
              position="absolute"
              top={0}
              templateColumns="1px 100%"
              alignItems="center"
              opacity={i === j ? 1 : 0}
              transition="all 0.5s ease-in-out"
            >
              <Box borderRightWidth={2} height={SIZE} />
              <Box pl={8}>
                <Text>{testimonial.quote}</Text>
                <Text mb={0} bold>
                  <Image src={testimonial.image.url} display="inline-block" mr={4} alt="" rounded="full" height={8} />
                  {testimonial.firstName} {testimonial.lastName}, Labs {testimonial.experience}-Track
                </Text>
              </Box>
            </Grid>
          ))}
        </Box>
      </Grid>
    </Content>
  )
}
