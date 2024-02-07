import { isValidElement, useReducer, useRef } from "react";
import { Box, Button } from '@codeday/topo/Atom';
import { useColorModeValue } from "@chakra-ui/react";

export function MultiPagePage({ title, children }) {
  return children;
}

function PageStepper({ current, count, title, ...props }) {
  return (
    <Box {...props}>
      {Array(count).fill(undefined).map((_, i) => (
        <Box display="inline-block" mr={2} key={i}>
          <Box
            rounded="full"
            bg={i === current ? 'green.500' : 'transparent'}
            borderColor={i === current ? 'green.300' : 'inherit'}
            borderWidth={1}
            display="inline-block"
            pl={2}
            pr={2}
            fontSize="sm"
            fontWeight="bold"
          >
            {i + 1}
          </Box>
          {i === current && title && (
            <Box display="inline-block" mr={4} ml={2} fontWeight="bold">
              {title}
            </Box>
          )}
        </Box>
      ))}
    </Box>
  )
}

export default function MultiPage({ children, submitButton, props }) {
  const [page, changePage] = useReducer((_prev, action) => {
    return (_prev + (action === 'next' ? 1 : -1)) % children.length;
  }, 0);
  const ref = useRef();
  const bg = useColorModeValue('gray.50', 'gray.900');

  const firstPage = page === 0;
  const lastPage = page === children.length - 1;

  const currentChild = children[page];
  const title = isValidElement(currentChild) && currentChild.props.title || null;

  return (
    <Box ref={ref} borderWidth={1} rounded="sm" {...props}>
      <PageStepper
        bg={bg}
        title={title}
        count={children.length}
        current={page}
        mb={4}
        p={4}
        pl={6}
        pr={6}
      />
      <Box p={4} pl={6} pr={6}>
        {currentChild}
      </Box>
      <Box p={4} pl={6} pr={6} mt={4} borderTopWidth={1}>
        {!firstPage && (
          <Box float="left">
            <Button
              onClick={() => {
                changePage('previous');
                ref?.current?.scrollIntoView?.(true, { behavior: 'smooth' });
              }}
            >
              Back
            </Button>
          </Box>
        )}
        <Box float="right" textAlign="right">
          {lastPage
            ? submitButton
            : (
              <Button
                onClick={() => {
                  changePage('next');
                  ref?.current?.scrollIntoView?.(true, { behavior: 'smooth' });
                }}
              >
                Next
              </Button>
            )
          }
        </Box>
        <Box style={{ clear: 'both' }} />
      </Box>
    </Box>
  );
}