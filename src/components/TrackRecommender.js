import { useState } from 'react';
import nl2br from 'react-nl2br';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Text from '@codeday/topo/Atom/Text';

const FLOWCHART = {
  val: `Still not sure what track is right for you?\nWhat type of student are you?`,
  help: `Please choose your CURRENT status, even if you will graduate by the time Labs starts.`,
  opts: {
    'High School': { track: 'beginner' },
    'College': {
      val: `Have you taken an upper-division programming course in the past?`,
      help: `This means a class which typically requires students to be in the major to enroll.`,
      opts: {
        No: {
          val: `Have you completed a CS101/CS1/similar programming course in college?`,
          help: `Include any intro-level programming course at the college level (but not AP classes).`,
          opts: {
            No: { track: `beginner` },
            Yes: {
              val: `Have you programmed a personal project which took you over 10 hours of work before?`,
              help: `Do NOT include class projects, but DO include hackathon projects if you did technical work.`,
              opts: {
                No: { track: `beginner` },
                Yes: { track: `advanced` },
              },
            },
          },
        },
        Yes: { track: `advanced` },
      }
    }
  }
};

export default function TrackRecommender(props) {
  const [{ val, help, opts, track }, setCurrentNode] = useState(FLOWCHART);

  return (
    <Box
      textAlign="center"
      backgroundColor="blue.100"
      borderColor="blue.600"
      color="blue.900"
      borderWidth={1}
      p={4}
      rounded="sm"
      {...props}
    >
      {track ? (
        <>
          <Text fontSize="xl" bold>
            The <Text as="span" textDecoration="underline">{track} track</Text> is probably best for you.
          </Text>
          <Text>(But you're welcome to apply for a different track if you disagree!)</Text>
          <Button as="a" href={`/apply/${track}`} variantColor="blue">Apply for the {track} track</Button>
        </>
      ) : (
        <>
          <Text fontSize="xl" bold>{nl2br(val)}</Text>
          {opts && (
            <Grid
              templateColumns={`repeat(${Object.keys(opts).length}, 1fr)`}
              textAlign="center"
              alignItems="center"
              gap={8}
              mb={4}
            >
              {Object.keys(opts).map((label) => (
                <Box key={label}>
                  <Button
                    variantColor="blue"
                    onClick={() => setCurrentNode(opts[label])}
                  >
                    {label}
                  </Button>
                </Box>
              ))}
            </Grid>
          )}
          {help && <Text>{nl2br(help)}</Text>}
        </>
      )}
    </Box>
  )
}
