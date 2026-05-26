import { Box, Heading } from '@codeday/topo/Atom';
import useDashboardColors from './useDashboardColors';

export default function DashboardInfoBox({ title, children, ...rest }) {
  const { bg, borderColor, color } = useDashboardColors();
  return (
    <Box
      p={4}
      mb={4}
      bg={`blue.${bg}`}
      borderColor={`blue.${borderColor}`}
      borderWidth={1}
      color={`blue.${color}`}
      rounded="sm"
      {...rest}
    >
      {title && <Heading as="h3" fontSize="md" mb={2}>{title}</Heading>}
      {children}
    </Box>
  );
}
