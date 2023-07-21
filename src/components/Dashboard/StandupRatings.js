import { Box, HStack } from "@codeday/topo/Atom";
import { Tooltip } from '@chakra-ui/react'
import { DateTime } from "luxon";

const RATINGS = {
  ' ': {
    color: 'gray',
    text: 'A standup was submitted, but we have not applied a rating yet.',
  },
  '0': {
    color: 'red',
    text: 'No standup was submitted.',
  },
  '1': {
    color: 'yellow',
    text: 'The standup was too vague to interpret.',
  },
  '2': {
    color: 'teal',
    text: `It's not obvious that the standup represents enough work.`,
  },
  '3': {
    color: 'green',
    text: 'The standup was specific and represents significant work.',
  },
};

function StandupRating({ rating, ...props }) {
  const ratingStr = typeof rating.rating === 'number'
    ? rating.rating.toString()
    : ' ';
  const {text, color} = RATINGS[ratingStr];
  return (
    <Tooltip label={`${DateTime.fromISO(rating.dueAt).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}: ${text}`}>
      <Box
        cursor="pointer"
        alt={text}
        bgColor={`${color}.400`}
        color={`${color}.900`}
        rounded="full"
        w={4}
        h={4}
        fontSize="xs"
        textAlign="center"
        pl={1}
        pr={1}
        {...props}
      >
        {ratingStr}
      </Box>
    </Tooltip>
  )
}

export default function StandupRatings({ ratings, ...props }) {
  return (
    <HStack {...props}>
      <Tooltip label="Standups are scored by AI, which may make mistakes, and poor scores may be representative of poor writing rather than a lack of work. We recommend reaching out only after several bad scores.">
        <Box
          cursor="pointer"
          fontSize="xs"
          borderBottomStyle="dashed"
          borderBottomWidth={1}
        >
          Standups:
        </Box>
      </Tooltip>
      {ratings.map(r => <StandupRating key={r.dueAt} rating={r} />)}
    </HStack>
  )
}