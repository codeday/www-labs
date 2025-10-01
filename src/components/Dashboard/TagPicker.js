import { Box, Grid, Checkbox } from '@codeday/topo/Atom';

export default function TagPicker({ onlyType, display, options, tags, onChange, disabled, ...props }) {
  const ids = tags.map(({ id }) => id);
  return (
    <Grid templateColumns={{ base: '1fr', lg: 'repeat(2, 1fr)' }} {...props}>
      {options
        .filter(({ type }) => !onlyType || type === onlyType)
        .map(({ id, studentDisplayName, mentorDisplayName }) => (
          <Box>
            {disabled ? (
              <>
                <Box display="inline-block" w={6}>
                  {ids.includes(id) ? '✓' : ' '}
                </Box>
                {display === 'mentor' ? mentorDisplayName : studentDisplayName}
              </>
            ) : (
                <Checkbox
                  isChecked={ids.includes(id)}
                  onChange={() => onChange(!ids.includes(id)
                    ? [...new Set([...tags, { id }])]
                    : tags.filter((t) => t.id !== id)
                  )}
                >
                  {display === 'mentor' ? mentorDisplayName : studentDisplayName}
                </Checkbox>
            )}
          </Box>
        ))
      }
    </Grid>
  );
}
