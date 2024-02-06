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
      student.profile.yearsToGraduation <= 1
        ? [`They are looking for a full-time job ${student.profile?.yearsToGraduation > 0 ? `in ~${student.profile?.yearsToGraduation} year` : 'now'}.`]
        : []
    ),
    ...(
      (student.profile?.pronouns && student.profile.pronouns !== 'he/him')
      || ['Black', 'Latino/a/e* or Hispanic', 'Native American'].includes([...(student.profile?.ethnicities || []), ...(student.profile?.ethnicity || [])])
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
        title={`An educational achievement they're most proud of:`}
        text={student.profile?.proud}
      />
      <LongAnswer
        title={`A past coding project they've worked on:`}
        text={student.profile?.pastProject}
      />
      <LongAnswer
        title={`A time they solved a difficult problem:`}
        text={student.profile?.solveProblem}
      />
      <LongAnswer
        title={`What they hope to gain from this experience:`}
        text={student.profile?.lookForward || student.profile?.goals}
      />
      <LongAnswer
        title={`Anything else?`}
        text={student.profile?.anythingElse}
      />
    </Box>
  )
}
