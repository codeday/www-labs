import { Select } from '@codeday/topo/Atom/Input/Select';
import Box from '@codeday/topo/Atom/Box';

const options = {
  APPLIED: 'Applied',
  SCHEDULED: 'Scheduled',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  CANCELED: 'Canceled',
};

export default function SelectMentorStatus({ status, onChange, ...props }) {
  return (
    <Box d="inline-block" {...props}>
      <Select d="inline-block" onChange={onChange}>
        {Object.keys(options).map((k) => (
          <option selected={status === k} value={k}>{options[k]}</option>
        ))}
      </Select>
    </Box>
  );
}
