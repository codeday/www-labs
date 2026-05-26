import { Box, Button, Heading } from '@codeday/topo/Atom';
import { useColorModeValue } from '@chakra-ui/react';

const sectionNames = {
  a: 'Admin',
  mm: 'Staff',
  r: 'Reviewer',
  m: 'Mentor',
  s: 'Student',
  osm: 'Open-Source Manager',
};

function tokenIsVisible([tokenType, token]) {
  return !tokenType.startsWith('_') && !!token;
}

export default function EventCard({ title, tokens }) {
  const headerBg = useColorModeValue('gray.200', 'gray.900');
  const headerFg = useColorModeValue('gray.900', 'white');

  return (
    <Box rounded="sm" borderWidth={1}>
      <Heading
        p={2}
        as="h3"
        fontSize="lg"
        backgroundColor={headerBg}
        color={headerFg}
        roundedTop="sm"
      >
        {title}
      </Heading>
      <Box p={2}>
        {Object.entries(tokens)
          .filter(tokenIsVisible)
          .map(([k, token]) => (
            <Button
              key={k}
              mr={2}
              as="a"
              size="sm"
              href={`/dash/${k}/${token}`}
            >
              {sectionNames[k]}
            </Button>
          ))}
        {tokens.mm && (
          <Button
            colorScheme="green"
            mr={2}
            as="a"
            size="sm"
            href={`/dash/mm/${tokens.mm}/note`}
            color="green.900"
          >
            Add Student Note
          </Button>
        )}
      </Box>
    </Box>
  );
}
