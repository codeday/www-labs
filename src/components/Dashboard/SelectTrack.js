import { Select } from '@codeday/topo/Atom/Input/Select';
import Box from '@codeday/topo/Atom/Box';

const options = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

export default function SelectTrack({ track, allowNull, onChange, ...props }) {
  return (
    <Box d="inline-block" {...props}>
      <Select d="inline-block" onChange={onChange}>
        {allowNull && <option selected={track === null} value={null}></option>}
        {Object.keys(options).map((k) => (
          <option selected={track === k} value={k}>{options[k]}</option>
        ))}
      </Select>
    </Box>
  );
}
