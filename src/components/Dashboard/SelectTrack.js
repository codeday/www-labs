import { Select, Box } from '@codeday/topo/Atom';

const options = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

export default function SelectTrack({ track, allowNull, onChange, ...props }) {
  return (
    <Box display="inline-block" {...props}>
      <Select display="inline-block" onChange={onChange}>
        {allowNull && <option selected={track === null} value={null}>All Tracks</option>}
        {Object.keys(options).map((k) => (
          <option key={k} selected={track === k} value={k}>{options[k]}</option>
        ))}
      </Select>
    </Box>
  );
}
