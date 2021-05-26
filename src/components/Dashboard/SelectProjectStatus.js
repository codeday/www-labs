import { Select } from '@codeday/topo/Atom/Input/Select';
import Box from '@codeday/topo/Atom/Box';

const options = {
  DRAFT: 'Draft',
  PROPOSED: 'Proposed',
  ACCEPTED: 'Accepted',
  MATCHED: 'Matched',
};

export default function SelectProjectStatus({ status, onChange, ...props }) {
  if (status === 'MATCHED') return <>MATCHED</>;
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
