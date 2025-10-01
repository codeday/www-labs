import { useReducer, useState } from 'react';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { Box, Button, Heading, TextInput as Input } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { useFetcher } from '../../../../dashboardFetch';
import { MentorDeleteMutation } from './delete.gql';

export default function AdminDeletMentor() {
  const { query } = useRouter();
  const [id, setId] = useState();
  const [loading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const fetch = useFetcher();

  return (
    <Page title="Delete Mentor">
      <Content mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mb={8} mt={4}>Add Mentor</Heading>

        <Box mb={8}>
          <Heading as="h3" fontSize="lg" mt={4}>ID</Heading>
          <Box display="inline-block" mr={4}>
            <Input
              placeholder="ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
            />
          </Box>
        </Box>

        <Button
          isLoading={loading}
          disabled={loading || !id}
          onClick={async () => {
            setLoading(true);
            try {
              await fetch(print(MentorDeleteMutation), { id });
              success('Mentor deleted.');
              setId('');
            } catch (ex) {
              error(ex.toString());
            }
            setLoading(false);
          }}
        >
          Delete
        </Button>
      </Content>
    </Page>
  );
}
