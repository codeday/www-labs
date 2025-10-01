import { Box } from '@codeday/topo/Atom';

export default function Highlight({ children }) {
  return (
    <Box as="span" display="inline" color="green.700" fontWeight="bold">
      {children}
    </Box>
  );
}
