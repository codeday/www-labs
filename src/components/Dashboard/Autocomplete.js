import { useEffect, useMemo, useReducer, useState } from 'react';
import { Checkbox } from '@chakra-ui/react';
import { Heading, Grid, Box, TextInput, List, ListItem, Text, Spinner } from '@codeday/topo/Atom';
import { apiFetch } from '@codeday/topo/utils';
import UiX from '@codeday/topocons/Icon/UiX';
import { AutocompleteQuery } from './Autocomplete.gql';

function AutocompleteResultName({ result, ...props }) {
  const typeName = result.type[0] + result.type.slice(1).toLowerCase();
  const color = {
    'STUDENT': 'green',
    'MENTOR': 'purple',
    'PROJECT': 'blue',
  }[result.type];
  return (
    <Box display="inline-block" {...props}>
      <Box
        display="inline-block"
        rounded="sm"
        bgColor={`${color}.500`}
        color={`${color}.50`}
        fontSize="0.7em"
        mr={1}
        pl={1}
        pr={1}
        >
          {typeName}
        </Box>
      {result.name}
    </Box>
  )
}

export default function Autocomplete({
  token,
  students,
  mentors,
  projects,
  status,
  max,
  onChange,
  ...props
}) {
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, updateSelected] = useReducer((prev, [action, el]) => {
    if (action === 'add' && max && prev.length === max) return prev;
    if (action === 'add') return [...prev, el];
    if (action === 'remove') return prev.filter(e => e.id !== el);
  }, []);

  useEffect(() => {
    if (q.length < 3) {
      setResults([]);
      return () => {};
    }
    setLoading(true);
    const makeRequest = setTimeout(async () => {
      const result = await apiFetch(
        AutocompleteQuery,
        { q, students, mentors, status: status || ['ACCEPTED'], projects },
        { 'X-Labs-Authorization': `Bearer ${token}` },
      );
      setLoading(false);
      setResults(result.labs.autocomplete);
    }, 500);
    return () => clearTimeout(makeRequest);
  }, [q]);

  useEffect(() => onChange && onChange(selected), [selected, onChange]);

  const searchFor = useMemo(() => (
    [
      ['students', students],
      ['mentors', mentors],
      ['projects', projects],
    ]
    .filter(([,v]) => v)
    .map(([k]) => k).join('/')
  ), [students, mentors, projects]);

  const selectedIds = useMemo(() => selected.map(s => s.id), [selected]);

  return (
    <Box {...props}>
      <TextInput
        placeholder={`Search for ${searchFor}`}
        onChange={(e) => setQ(e.target.value)}
        value={q}
        borderBottomRadius={0}
      />
      <Grid
        pt={4}
        borderLeftWidth={1}
        borderRightWidth={1}
        borderBottomWidth={1}
        rounded="sm"
        templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)'}}
        gap={4}
        p={4}
      >
        <Box>
          <Heading as="h4" fontSize="sm">Search Results:</Heading>
          {loading
            ? <Spinner /> 
            : (results.length === 0
              ? <Text color="gray.500">No results.</Text>
              : (
                <>
                  {results.map(r => (
                    <Checkbox
                      key={r.id}
                      value={r.id}
                      onChange={(e) => {
                        if (e.target.checked) updateSelected(['add', results.filter(e => r.id === e.id)[0]])
                        else updateSelected(['remove', r.id]);
                      }}
                      isChecked={selectedIds.includes(r.id)}
                    >
                      <AutocompleteResultName result={r} />
                    </Checkbox>
                  ))}
                </>
              )
            )
          }
        </Box>
        <Box>
          <Heading as="h4" fontSize="sm">Selected:</Heading>
          <List>
            {selected.length === 0 && (
              <Text color="gray.500">None selected.</Text>
            )}
            {selected.map(s => (
              <ListItem key={s.id}>
                <Box
                  display="inline-block"
                  cursor="pointer"
                  onClick={() => updateSelected(['remove', s.id])}
                  mr={2}
                  color="gray.500"
                >
                  <UiX />
                </Box>
                  <AutocompleteResultName result={s} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Grid>
    </Box>
  );
}