import { Box, Button, Spinner } from "@codeday/topo/Atom";
import { apiFetch, useToasts } from "@codeday/topo/utils";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { GetStandupTextQuery, RateStandupMutation } from './StandupReview.gql';

const DESCRIPTIONS = {
  1: 'Vague',
  2: 'Low Workload',
  3: 'Good',
};

export default function StandupReview({
  id,
  rating: _rating,
  humanRated: _humanRated,
  onRated,
  isOpen,
  token,
  ...props
}) {
  const { success, error } = useToasts();
  const [text, setText] = useState();
  const [humanRated, setHumanRated] = useState(_humanRated);
  const [rating, setRating] = useState(_rating);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    if (typeof window === 'undefined' || !isOpen || text) return;
    const result = await apiFetch(
      GetStandupTextQuery,
      { id },
      { 'X-Labs-Authorization': `Bearer ${token}` },
    );
    setText(result.labs.getStandup);
  }, [typeof window, text, isOpen]);

  return (
    <Box {...props}>
      <Box ml={4} pl={4} borderLeftWidth={2}>
        {!text ? <Spinner /> : (
          <ReactMarkdown className="markdown">{text.replace(/\n/g, `  \n`)}</ReactMarkdown>
        )}
      </Box>
      <Box>
        {isLoading ? <Spinner /> : (
          [1,2,3].map(r => (
            <Button
              mr={2}
              colorScheme={rating === r ? 'green' : 'gray'}
              onClick={async () => {
                setIsLoading(true);
                try {
                  await apiFetch(
                    RateStandupMutation,
                    { id, rating: r },
                    { 'X-Labs-Authorization': `Bearer ${token}` },
                  );
                  success('Rating sent.');
                  setRating(r);
                  setHumanRated(true);
                  onRated && onRated(r);
                } catch (ex) {
                  console.error(ex);
                  error('Rating could not be sent.');
                }
                setIsLoading(false);
              }}
            >
              {r} - {DESCRIPTIONS[r]}
            </Button>
          ))
        )}
      </Box>
    </Box>
  )
}