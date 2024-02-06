import { Grid, Box, Heading, Text, Link } from '@codeday/topo/Atom';

function TrackBadge({ track }) {
  return (
    <Box
      color="white"
      bg={{'BEGINNER': 'green.700', 'INTERMEDIATE': 'orange.700', 'ADVANCED': 'pink.700'}[track] || 'gray.100'}
      p={1}
      rounded="sm"
      d="inline-block"
    >
      {track.toLowerCase()}
    </Box>
  )
}

export default function StudentHeader({ student, anonymous, ...props }) {
  const links = {
    github: student.profile?.github,
    linkedin: student.profile?.linkedin,
    resume: student.resumeUrl,
  };

  return (
    <Grid templateColumns="1fr 1fr" mb={8} {...props}>
      <Box>
        {anonymous ? (
          <Heading as="h2" fontSize="4xl" mb={0}>{student.givenName[0]}.{student.surname[0]}.</Heading>
        ) : (
          <Heading as="h2" fontSize="4xl" mb={0}>
            {student.givenName} {student.surname}
            <Text as="span" fontSize="md" ml={2}>({student.profile?.pronouns})</Text>
          </Heading>
        )}
        <Text fontSize="lg" bold mb={0}>
          {[
            student.profile?.yearsToGraduation && `${student.profile.yearsToGraduation} years to graduation`,
            student.partnerCode && `partner ${student.partnerCode}`,
            student.timezone,
          ].filter(Boolean).join(', ')}
        </Text>
        {!anonymous && (
          <Text fontSize="md">Ethnicity: {student.profile?.ethnicities ? student.profile.ethnicities.join('/') : student.profile?.ethnicity}</Text>
        )}
        <Text fontSize="md" bold color="blue.800" mb={0}>
          {Object.keys(links).filter((k) => links[k]).map((k) => (
            <Link key={k} as="a" href={links[k]} target="_blank" mr={3}>{k}</Link>
          ))}
        </Text>
      </Box>
      <Box fontSize="sm" textAlign="right">
        <Text mb={0}>
          <Text as="span" bold>id: </Text><Text as="span" fontFamily="mono">{student.id}</Text>
        </Text>
        <Text mb={0}>
          <Text as="span" bold>application track: </Text><TrackBadge track={student.track} />
        </Text>
      </Box>
    </Grid>
  );
}
