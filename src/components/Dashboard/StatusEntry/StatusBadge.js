import { Box } from '@codeday/topo/Atom';
import { cautionFloatToString, cautionStringToColor } from '../../../utils';


export default function StatusEntryStatusBadge({ caution, ...props }) {
  const cautionString = cautionFloatToString(caution);
  const cautionStringDisplay = cautionString === 'ok' ? null : cautionString;
  const color = cautionStringToColor(cautionString);

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
      opacity={cautionStringDisplay ? 1 : 0.4}
      {...props}
    >
      <Box
        display="inline-block"
        rounded="full"
        w="1em"
        h="1em"
        mr={{ base: 0, md: cautionStringDisplay ? 1 : 0 }}
        bgColor={cautionStringDisplay ? `${color}.500` : 'transparent'}
        borderColor={`${color}.500`}
        borderWidth={2}
        position="relative"
        top="0.25em"
      />
      <Box as="span" display={{ base: 'none', md: 'inline' }}>
        {cautionStringDisplay}
      </Box>
    </Box>
  )
}