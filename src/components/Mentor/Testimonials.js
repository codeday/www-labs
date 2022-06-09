import { Box, Grid, Text, Image } from '@codeday/topo/Atom';
import { useSlideshow, useQuery } from '../../providers';

const QUOTE_DURATION = 10000;

export default function Testimonials(props) {
  const testimonials = useQuery('cms.mentorTestimonials.items', []);
  const i = useSlideshow(testimonials.length, QUOTE_DURATION);

  return (
    <Box
      pl={8}
      borderLeftWidth={2}
      position="relative"
      h={{ base: 56, sm: 48, lg: 40 }}
      {...props}
    >
      {testimonials.map((t, j) => (
        <Grid
          h={{ base: 56, sm: 48, lg: 40 }}
          alignItems="center"
          position="absolute"
          top={0}
        >
          <Box
            opacity={j === i ? 1 : 0}
            transition="all 1s ease-in-out"
          >
            <Text
              fontSize="lg"
              fontStyle="italic"
              mb={1}
            >
              &ldquo;{t.quote}&rdquo;
            </Text>
            <Grid templateColumns="1fr 100%" alignItems="center" mt={4} gap={4}>
              <Box rounded="full" overflow="hidden" w={8} h={8} backgroundColor="gray.200">
                <Image src={t.image?.url} alt="" w="100%" />
              </Box>
              <Text mb={0}>
                {t.firstName} {t.lastName}<br />
                {t.title}, {t.company}<br />
                CodeDay Labs {t.experience}-Track Mentor
              </Text>
            </Grid>
          </Box>
        </Grid>
      ))}
    </Box>
  )
}
