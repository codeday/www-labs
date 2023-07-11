import { apiFetch } from '@codeday/topo/utils';
import { TextInput as Input, Button, Box, Heading, Text, Divider, Grid } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../components/Page';
import { useState } from 'react';
import { VerifyQuery } from './verify.gql';
import { DateTime } from 'luxon';

export default function Verify() {
  const [givenName, setGivenName] = useState();
  const [surname, setSurname] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  return (
    <Page slug="/verify" title="Verify">
      <Content mt={-8}>
        <Heading as="h2" mb={8}>Verify</Heading>
        <Grid templateColumns="1fr 1fr" gap={4}>
          <Box>
            <Text display="block" fontSize="xs" fontWeight="bold">Given Name</Text>
            <Input onChange={(e) => setGivenName(e.target.value)} value={givenName} placeholder="Given Name" />
          </Box>
          <Box>
            <Text display="block" fontSize="xs" fontWeight="bold">Surname</Text>
            <Input onChange={(e) => setSurname(e.target.value)} value={surname} placeholder="Surname" />
          </Box>
        </Grid>
        <Button
          isLoading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            try {
              const result = await apiFetch(VerifyQuery, {
                givenName, surname,
              });
              setResults(result?.labs?.employmentRecords || []);
            } catch (ex) {
              console.error(ex);
              setResults([]);
            }
            setIsLoading(false);
          }}
        >
          Search
        </Button>
        {results !== null && (
          <Box>
            <Divider mt={8} mb={8} />
            {results.length === 0 ? (
              <Text>No results found. Please email us at labs@codeday.org to verify.</Text>
            ) : results.map((r) => (
              <Box>
                <Text><strong>Title:</strong> {r.title}</Text>
                <Text><strong>Start:</strong> {DateTime.fromISO(r.start).toLocaleString(DateTime.DATE_FULL)}</Text>
                <Text><strong>End:</strong> {DateTime.fromISO(r.end).toLocaleString(DateTime.DATE_FULL)}</Text>
                <Text><strong>Supervisor:</strong> Tyler Menezes (tylermenezes@codeday.org, 888-607-7763 ext 5001)</Text>
                <Text><strong>Mentor{r.mentors.length > 0 ? 's': ''}:</strong> {r.mentors.join(', ')}</Text>
                <Text><strong>Eligible for rehire?</strong> {r.eligibleForRehire ? 'yes' : 'no'}</Text>
              </Box>
            ))}
          </Box>
        )}
      </Content>
    </Page>
  );
}

