import { Box, Button, Heading, Text } from '@codeday/topo/Atom';
import { useColorModeValue } from '@codeday/topo/Theme';
import SelectTrack from './SelectTrack';

const TRACKS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];
const RATINGS = [1, 2, 3, 4, 5];

export function ReviewTrackFilter({ track, onTrackChange }) {
  const bg = useColorModeValue('purple.50', 'purple.900');
  const borderColor = useColorModeValue('purple.900', 'purple.600');
  return (
    <Box
      p={4}
      mb={8}
      bg={bg}
      borderColor={borderColor}
      borderWidth={1}
      rounded="sm"
      display="inline-block"
    >
      <Heading as="h4" fontSize="md">Show me...</Heading>
      <SelectTrack track={track} allowNull onChange={(e) => onTrackChange(e.target.value)} />
    </Box>
  );
}

export default function RatingControls({
  student,
  track,
  onTrackChange,
  recommendedTrack,
  onRecommendedTrackChange,
  rating,
  onRatingChange,
  onSkip,
  onSubmit,
}) {
  return (
    <Box>
      <ReviewTrackFilter track={track} onTrackChange={onTrackChange} />

      <Heading as="h4" fontSize="md">Which track is best?</Heading>
      <Text fontSize="sm" mb={0}>(* = their selection)</Text>
      <Box>
        {TRACKS.map((t) => (
          <Button
            key={t}
            colorScheme={recommendedTrack === t ? 'purple' : undefined}
            onClick={() => onRecommendedTrackChange(t)}
            size="sm"
            mr={1}
          >
            {t[0]}{t.slice(1, 3).toLowerCase()}{student.track === t && '*'}
          </Button>
        ))}
      </Box>

      <Heading as="h4" fontSize="md" mt={8}>Rate this application:</Heading>
      <Box>
        {RATINGS.map((r) => (
          <Button
            key={r}
            colorScheme={rating === r ? 'purple' : undefined}
            onClick={() => onRatingChange(r)}
            size="sm"
            mr={1}
          >
            {r}
          </Button>
        ))}
      </Box>

      <Box mt={8}>
        <Button onClick={onSkip} mr={2}>Skip</Button>
        <Button
          colorScheme="green"
          disabled={!rating || !recommendedTrack}
          onClick={onSubmit}
        >
          Submit
        </Button>
      </Box>
    </Box>
  );
}
