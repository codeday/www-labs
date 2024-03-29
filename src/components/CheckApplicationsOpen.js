import { DateTime } from 'luxon';
import { Box, Text } from '@codeday/topo/Atom';
import { useProgramDates } from '../providers';

export default function CheckApplicationsOpen({ children, skip, ...props }) {
  const { registrationsOpenAt, registrationsCloseAt } = useProgramDates();
  const now = DateTime.local();

  const f = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  };

  if ((registrationsOpenAt < now && registrationsCloseAt > now) || skip) return children || <></>;

  return (
    <Box bg="blue.50" borderColor="blue.200" borderWidth={2} borderRadius={2} p={4} color="blue.800">
      <Text mb={0}>
        CodeDay Labs applications are are accepted starting{' '}
        {registrationsOpenAt.toLocaleString(f)}, and due {registrationsCloseAt.toLocaleString(f)}.
      </Text>
    </Box>
  )
}
