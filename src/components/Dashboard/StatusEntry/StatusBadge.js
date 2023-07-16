import { Box } from "@chakra-ui/react";

function cautionFloatToString(caution) {
  if (typeof caution === 'undefined' || caution === null) return null;
  if (caution >= 0.9) return 'danger';
  if (caution >= 0.5) return 'warning';
  if (caution >= 0.2) return 'caution';
  if (caution >= 0.1) return 'info';
  return 'ok';
}

export default function StatusEntryStatusBadge({ caution, ...props }) {
  const cautionString = cautionFloatToString(caution);
  const cautionStringDisplay = cautionString === 'ok' ? null : cautionString;
  const color = {
    danger: 'red',
    warning: 'yellow',
    caution: 'yellow',
    info: 'green',
    ok: 'green',
  }[cautionString] || 'gray';

  return (
    <Box
      borderColor={cautionStringDisplay ? `${color}.500` : 'transparent'}
      borderWidth={2}
      color={`${color}.500`}
      fontSize="xs"
      pl={1}
      pr={1}
      rounded="full"
      display="inline-block"
      fontWeight="bold"
      {...props}
    >
      <Box
        display="inline-block"
        rounded="full"
        w="1em"
        h="1em"
        mr={{ base: 0, md: cautionStringDisplay ? 1 : 0 }}
        bgColor={`${color}.500`}
        position="relative"
        top="0.2em"
      />
      <Box as="span" display={{ base: 'none', md: 'inline' }}>
        {cautionStringDisplay}
      </Box>
    </Box>
  )
}