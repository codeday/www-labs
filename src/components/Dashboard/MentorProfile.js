import Box from '@codeday/topo/Atom/Box';
import { Heading } from '@codeday/topo/Atom/Text';

export default function MentorProfile({ mentor, ...rest }) {
  if (!mentor) return <></>;
  return (
    <Box {...rest}>
      <Heading as="h2">{mentor.givenName} {mentor.surname}</Heading>
    </Box>
  );
}
