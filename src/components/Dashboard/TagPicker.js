import Box, { Grid } from '@codeday/topo/Atom/Box';
import { default as Checkbox } from '@codeday/topo/Atom/Input/Checkbox';

export default function TagPicker({ onlyType, display, options, tags, onChange, ...props }) {
  const ids = tags.map(({ id }) => id);
  return (
    <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} {...props}>
      {options
        .filter(({ type }) => !onlyType || type === onlyType)
        .map(({ id, studentDisplayName, mentorDisplayName }) => (
          <Box>
            <Checkbox
              isChecked={ids.includes(id)}
              onChange={() => onChange(!ids.includes(id)
                ? [...new Set([...tags, { id }])]
                : tags.filter((t) => t.id !== id)
              )}
            >
              {display === 'mentor' ? mentorDisplayName : studentDisplayName}
            </Checkbox>
          </Box>
        ))
      }
    </Grid>
  );
}
