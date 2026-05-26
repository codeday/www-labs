import { Box, Heading, List, Text } from '@codeday/topo/Atom';
import useDashboardColors from './useDashboardColors';

export default function ActionRequiredBox({ title = 'Due Check-Ins, Reflections, & Surveys', children, ...rest }) {
  const { bg, borderColor, color } = useDashboardColors();
  return (
    <Box
      p={4}
      pt={3}
      mb={4}
      bg={`red.${bg}`}
      borderColor={`red.${borderColor}`}
      borderWidth={4}
      color={`red.${color}`}
      rounded="sm"
      {...rest}
    >
      <Text mb={0} color="red.700" fontSize="sm">[ACTION REQUIRED]</Text>
      <Heading as="h3" fontSize="md" mb={2}>{title}</Heading>
      <List styleType="disc" pl={6}>{children}</List>
    </Box>
  );
}
