import { Box, HStack } from "@codeday/topo/Atom";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Tooltip,
  useDisclosure,
} from '@chakra-ui/react'
import { DateTime } from "luxon";
import { useState } from "react";
import StandupReview from "./StandupReview";

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

function StandupRating({ rating: _rating, token, allowChanges, ...props }) {
  const [rating, setRating] = useState(_rating.rating);
  const [humanRated, setHumanRated] = useState(_rating.humanRated);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const ratingStr = typeof rating === 'number'
    ? rating.toString()
    : ' ';

  const {text, color} = RATINGS[ratingStr];

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Standup Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <StandupReview
              id={_rating.id}
              rating={rating}
              humanRated={humanRated}
              isOpen={isOpen}
              onRated={(r) => {
                setRating(r);
                setHumanRated(true);
              }}
              token={token}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
      <Tooltip
        label={`(${humanRated ? 'human' : 'ai'} rated) ${DateTime.fromISO(_rating.dueAt).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}: ${text}`}
      >
        <Box
          onClick={_rating.id && onOpen}
          cursor="pointer"
          alt={text}
          bgColor={`${color}.400`}
          color={`${color}.900`}
          borderWidth={2}
          borderColor={humanRated ? `purple.500` : `${color}.400`}
          rounded="full"
          w={5}
          h={5}
          fontSize="xs"
          textAlign="center"
          pl={1}
          pr={1}
          disabled={!allowChanges}
          {...props}
        >
          {ratingStr}
        </Box>
      </Tooltip>
    </>
  )
}

export default function StandupRatings({ ratings, token, allowChanges, ...props }) {
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
      {ratings.slice(-25).map(r => <StandupRating allowChanges={allowChanges} key={r.dueAt} rating={r} token={token} />)}
    </HStack>
  )
}