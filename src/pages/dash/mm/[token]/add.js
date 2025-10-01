import { useReducer, useState } from 'react';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { Box, Button, Heading, TextInput as Input } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { useFetcher } from '../../../../dashboardFetch';
import SelectMentorStatus from '../../../../components/Dashboard/SelectMentorStatus';
import { MentorAddMutation } from './add.gql';

export default function MentorManagerAddMentor() {
  const { query } = useRouter();
  const [mentor, setMentor] = useReducer(
    (prev, next) => Array.isArray(next) ? { ...prev, [next[0]]: next[1] } : next,
    { status: 'ACCEPTED' }
  );
  const [track, setTrack] = useState('ADVANCED');
  const [loading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const fetch = useFetcher();

  return (
    <Page title="Add Mentor">
      <Content mt={-8}>
        <Button as="a" href={`/dash/mm/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mb={8} mt={4}>Add Mentor</Heading>

        <Box mb={8}>
          <Heading as="h3" fontSize="lg">Name</Heading>
          <Box display="inline-block" mr={4}>
            <Input
              placeholder="Given (First) Name"
              value={mentor.givenName}
              onChange={(e) => setMentor(['givenName', e.target.value])}
            />
          </Box>
          <Box display="inline-block">
            <Input
              display="inline-block"
              placeholder="Family (Last) Name"
              value={mentor.surname}
              onChange={(e) => setMentor(['surname', e.target.value])}
              mr={4}
            />
          </Box>
        </Box>

        <Box mb={8}>
          <Heading as="h3" fontSize="lg" mt={4}>Email</Heading>
          <Box display="inline-block" mr={4}>
            <Input
              placeholder="Email"
              value={mentor.email}
              onChange={(e) => setMentor(['email', e.target.value])}
            />
          </Box>
        </Box>

        <Box mb={8}>
          <Heading as="h3" fontSize="lg">Status</Heading>
          <SelectMentorStatus status={mentor.status} onChange={(e) => setMentor(['status', e.target.value])} />
        </Box>

        <Button
          isLoading={loading}
          disabled={loading || !mentor.givenName || !mentor.surname || !mentor.status || !mentor.email || !track}
          onClick={async () => {
            setLoading(true);
            try {
              const mentorResp = await fetch(print(MentorAddMutation), { data: mentor });
              success('Mentor added.');
              window.location = `/dash/mm/${query.token}/${mentorResp.labs.createMentor.id}`;
            } catch (ex) {
              error(ex.toString());
            }
            setLoading(false);
          }}
        >
          Create
        </Button>
      </Content>
    </Page>
  );
}
