import { useReducer, useState } from 'react';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { Box, Button, Heading, TextInput as Input, Textarea, Select } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { useFetcher } from '../../../../dashboardFetch';
import { Clone } from './clone.gql';
import { DateTime } from 'luxon';

export default function AdminClone() {
  const { query } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState();
  const [startsAt, setStartsAt] = useState();
  const { success, error } = useToasts();
  const fetch = useFetcher();

  return (
    <Page title="Clone">
      <Content mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mb={8} mt={4}>Clone</Heading>
        <Input
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <Input
          placeholder="Starts At (ISO Timestamp)"
          onChange={(e) => setStartsAt(e.target.value)}
          value={startsAt}
        />
        <Button
          isLoading={isLoading}
          disabled={isLoading || !name || !startsAt || !DateTime.fromISO(startsAt).isValid}
          colorScheme="red"
          onClick={async () => {
            setIsLoading(true);
            try {
              await fetch(Clone, { name, startsAt: DateTime.fromISO(startsAt).toJSDate() });
              success('Cloned');
            } catch (ex) {
              error(ex.toString());
            }
            setIsLoading(false);
          }}
        >
          Clone
        </Button>
      </Content>
    </Page>
  );
}
