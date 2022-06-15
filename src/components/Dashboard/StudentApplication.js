import reactnl2br from 'react-nl2br';
import { Box, Text, Heading, List, ListItem as Item } from '@codeday/topo/Atom';

function LongAnswer({ title, text }) {
  if (!text) return <></>;
  return (
    <Box mb={8}>
      <Heading
        as="h3"
        fontSize="lg"
        mb={2}
      >
        {title}
      </Heading>
      <Text pl={2} ml={2} borderLeftWidth={2}>{reactnl2br(text)}</Text>
    </Box>
  )
}

export default function StudentApplication({ student, ...props }) {
  const factors = [
    ...(
      student.profile.fteIn <= 12
        ? [`They are looking for a full-time job ${student.profile?.fteIn > 0 ? `in ~${student.profile?.fteIn}mo` : 'now'}.`]
        : []
    ),
    ...(
      student.profile?.pronouns !== 'he/him'
      || ['Black', 'Latino/a/e* or Hispanic', 'Native American'].includes(student.profile?.ethnicity)
        ? ['They are a member of an group significantly underrepresented in tech.']
        : []
    )
  ];

  return (
    <Box {...props}>
      {factors.length > 0 && (
        <Box mb={8}>
          <Heading as="h3" fontSize="lg" mb={2}>Extra factors to consider:</Heading>
          <List styleType="disc">
            {factors.map((e) => (
              <Item key={e}>{e}</Item>
            ))}
          </List>
        </Box>
      )}
      {student.profile?.haveDone && student.profile.haveDone.length > 0 && (
        <Box mb={8}>
          <Heading as="h3" fontSize="lg" mb={2}>Things they've done:</Heading>
          <List styleType="disc">
            {student.profile?.haveDone.map((e) => (
              <Item key={e}>{e}</Item>
            ))}
          </List>
        </Box>
      )}
      <LongAnswer
        title={`A past project they're proud of:`}
        text={student.profile?.pastProject}
      />
      <LongAnswer
        title={`If accepted, they look forward to:`}
        text={student.profile?.lookForward}
      />
      <LongAnswer
        title={`Anything else?`}
        text={student.profile?.anythingElse}
      />
    </Box>
  )
}
