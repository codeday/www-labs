import { useColorMode } from '@chakra-ui/react';
import { Box, Grid, Text, Link, Heading, Image } from '@codeday/topo/Atom';

export default function MentorManagerDetails({ mentor, ...props }) {
  const { colorMode } = useColorMode();
  const dark = colorMode === 'dark';
  const bg = dark ? 900 : 50;
  const borderColor = dark ? 600 : 700;
  const color = dark ? 50 : 900;

  return (
    <Box p={4} borderWidth={1} bg={`blue.${bg}`} borderColor={`blue.${borderColor}`} color={`blue.${color}`} rounded="sm" {...props}>
      <Heading as="h3" fontSize="md" mb={4}>Your CodeDay Team Contact</Heading>
      {mentor.manager ? (
        <Grid templateColumns="64px 1fr" gap={4}>
          <Image src={mentor.manager.picture} alt="" width="100%" />
          <Box>
            <Text mb={0}>{mentor.manager.name}</Text>
            <Text mb={0} color="blue.700" fontSize="sm">{mentor.manager.pronoun || 'they/them'}</Text>
            <Link as="a" href={`mailto:${mentor.manager.username}@codeday.org`}>
              {mentor.manager.username}@codeday.org
            </Link>
          </Box>
        </Grid>
      ) : (
        <>
          <Link as="a" href="mailto:labs@codeday.org">labs@codeday.org</Link>
          <Text>
            (We'll assign you a team contact {mentor.status === 'APPLIED' ? 'after your onboarding call' : 'soon'}.)
          </Text>
        </>
      )}
    </Box>
  );
}
