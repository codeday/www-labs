import { Select, Box } from '@codeday/topo/Atom';

const options = {
  APPLIED: 'Applied',
  TRACK_INTERVIEW: 'Track Interview',
  TRACK_CHALLENGE: 'Track Challenge',
  OFFERED: 'Offered',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  CANCELED: 'Canceled',
};

export default function SelectStudentStatus({ status, onChange, ...props }) {
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
