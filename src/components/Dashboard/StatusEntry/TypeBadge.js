import { Box } from "@chakra-ui/react";

export default function StatusEntryTypeBadge({ type, ...props }) {
  const badgeDisplay = {
    mentor: {
      text: 'mentor',
      color: 'purple.50',
      bgColor: 'purple.800',
    },
    student: {
      text: 'student',
      color: 'purple.50',
      bgColor: 'purple.800',
    },
    peer: {
      text: 'peer',
      color: 'purple.900',
      bgColor: 'purple.300',
    },
    self: {
      text: 'self',
      color: 'black',
      bgColor: 'gray.500',
    },
    meta: {
      text: 'info',
      color: 'gray.500',
      borderColor: 'gray.500',
      bgColor: undefined,
    },
    staff: {
      text: 'staff',
      color: 'cyan.50',
      bgColor: 'cyan.600'
    },
  }[type]
    || {
      text: type.toLowerCase(),
      color: 'gray.50',
      bgColor: 'gray.500'
    };
  
  return (
    <Box
      display="inline-block"
      color={badgeDisplay.color}
      bgColor={badgeDisplay.bgColor}
      borderColor={badgeDisplay.borderColor || badgeDisplay.bgColor}
      borderWidth={1}
      fontSize="xs"
      pl={1}
      pr={1}
      rounded="sm"
      fontWeight="bold"
      {...props}
    >
      {badgeDisplay.text}
    </Box>
  );
}