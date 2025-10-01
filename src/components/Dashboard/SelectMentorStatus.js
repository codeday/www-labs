import { Select, Box } from '@codeday/topo/Atom';

const options = {
  APPLIED: 'Applied',
  SCHEDULED: 'Scheduled',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  CANCELED: 'Canceled',
};

export default function SelectMentorStatus({ status, onChange, ...props }) {
  return (
    <Box display="inline-block" {...props}>
      <Select display="inline-block" onChange={onChange}>
        {Object.keys(options).map((k) => (
          <option selected={status === k} value={k}>{options[k]}</option>
        ))}
      </Select>
    </Box>
  );
}
