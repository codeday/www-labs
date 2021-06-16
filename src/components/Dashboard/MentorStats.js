import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import List, { Item } from '@codeday/topo/Atom/List';

export default function MentorStats({ mentors, ...props }) {
  const toProjects = (m) => m.reduce((accum, { projects }) => [...accum, ...projects], []);
  const toStudentCount = (p) => p.reduce((accum, { maxStudents }) => accum + maxStudents, 0);
  const readyMentors = mentors.filter(({ status }) => status === 'ACCEPTED');
  const readyProjects = toProjects(readyMentors).filter(({ status }) => ['ACCEPTED', 'MATCHED'].includes(status));

  return (
    <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} bg="gray.50" borderWidth={1} p={8} mb={8}>
      <Box>
        <Heading as="h4" fontSize="lg" textAlign="center" mb={4}>Mentors</Heading>
        <List styleType="disc">
          <Item>
            <Text mb={0} as="span" bold>Possible: </Text>
            {mentors.length}
          </Item>
          <Item>
            <Text mb={0} as="span" color="red.800" bold>Pending: </Text>
            {mentors.filter(({ status }) => status === 'APPLIED').length}
          </Item>
          <Item>
            <Text mb={0} as="span" color="purple.800" bold>Scheduled: </Text>
            {mentors.filter(({ status }) => status === 'SCHEDULED').length}
          </Item>
          <Item>
            <Text mb={0} as="span" bold>Ready: </Text>
            {readyMentors.length}
          </Item>
        </List>
      </Box>
      <Box>
        <Heading as="h4" fontSize="lg" textAlign="center" mb={4}>Projects</Heading>
        <List styleType="disc">
          <Item>
            <Text mb={0} as="span" bold>Possible: </Text>
            {toProjects(mentors).length}
          </Item>
          <Item>
            <Text mb={0} as="span" color="red.800" bold>W/ Pending Mentors: </Text>
            {toProjects(mentors.filter(({ status }) => status === 'APPLIED')).length}
          </Item>
          <Item>
            <Text mb={0} as="span" color="red.800" bold>W/ Pending Description: </Text>
            {toProjects(readyMentors).filter(({ status }) => status === 'DRAFT').length}
          </Item>
          <Item>
            <Text mb={0} as="span" color="purple.800" bold>To Review: </Text>
            {toProjects(readyMentors).filter(({ status }) => status === 'PROPOSED').length}
          </Item>
          <Item>
            <Text mb={0} as="span" bold>Ready: </Text>
            {readyProjects.length}
          </Item>
        </List>
      </Box>
      <Box>
        <Heading as="h4" fontSize="lg" textAlign="center" mb={4}>Students</Heading>
        <List styleType="disc">
          <Item>
            <Text mb={0} as="span" bold>Possible: </Text>
            {toStudentCount(toProjects(mentors))}
          </Item>
          <Item>
            <Text mb={0} as="span" color="red.800" bold>W/ Pending Mentors: </Text>
            {toStudentCount(toProjects(mentors.filter(({ status }) => status === 'APPLIED')))}
          </Item>
          <Item>
            <Text mb={0} as="span" color="red.800" bold>W/ Pending Description: </Text>
            {toStudentCount(toProjects(readyMentors).filter(({ status }) => status === 'DRAFT'))}
          </Item>
          <Item>
            <Text mb={0} as="span" color="purple.800" bold>W/ Pending Review: </Text>
            {toStudentCount(toProjects(readyMentors).filter(({ status }) => status === 'PROPOSED'))}
          </Item>
          <Item>
            <Text mb={0} as="span" bold>Ready: </Text>
            {toStudentCount(readyProjects)}{' '}
            (
              {toStudentCount(readyProjects.filter(({ track }) => track === 'BEGINNER'))}B{' / '}
              {toStudentCount(readyProjects.filter(({ track }) => track === 'INTERMEDIATE'))}I{' / '}
              {toStudentCount(readyProjects.filter(({ track }) => track === 'ADVANCED'))}A
            )
          </Item>
          <Item>
            <Text mb={0} as="span" bold>Partner Spots: </Text>
            {toStudentCount(toProjects(mentors.filter(({ maxWeeks }) => maxWeeks > 6)).filter(({ track }) => track !== 'BEGINNER'))}/
            <Text as="span" color="red.800">
              {toStudentCount(toProjects(mentors.filter(({ status, maxWeeks }) => status === 'APPLIED' && maxWeeks > 6).filter(({ track }) => track !== 'BEGINNER')))}
            </Text>/
            <Text as="span" color="red.800">
              {toStudentCount(toProjects(readyMentors.filter(({ maxWeeks }) => maxWeeks > 6)).filter(({ status, track }) => status === 'DRAFT' && track !== 'BEGINNER'))}
            </Text>/
            <Text as="span" color="purple.800">
              {toStudentCount(toProjects(readyMentors.filter(({ maxWeeks }) => maxWeeks > 6)).filter(({ status, track }) => status === 'PROPOSED' && track !== 'BEGINNER'))}
            </Text>/
            {toStudentCount(toProjects(readyMentors.filter(({ maxWeeks }) => maxWeeks > 6)).filter(({ status, track }) => !['DRAFT', 'PROPOSED'].includes(status) && track !== 'BEGINNER'))}
          </Item>
        </List>
      </Box>
    </Grid>
  );
}
