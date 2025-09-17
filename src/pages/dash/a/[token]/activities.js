import { useEffect, useState } from 'react';
import {
  GetActivitiesQuery,
  GetActivitySchemaQuery,
  RunActivityMutation,
} from './activities.gql';
import { useRouter } from 'next/router';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../../../dashboardFetch';
import Page from '../../../../components/Page';
import { Content } from '@codeday/topo/Molecule';
import { Button, Heading, Select } from '@chakra-ui/react';
import Form from '@rjsf/chakra-ui';
import { Text } from '@codeday/topo/Atom';

export default function AdminActivities({ activities }) {
  const { query } = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [functionName, setFunctionName] = useState('');
  const [schema, setSchema] = useState({});
  const [args, setArgs] = useState({});
  const [errors, setErrors] = useState([]);
  const { success, error } = useToasts();
  const fetch = useFetcher();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setSchema({});
    setArgs({});
    if (!functionName) return;
    setIsLoading(true);
    (async () => {
      const res = await fetch(GetActivitySchemaQuery, { functionName });
      setSchema(res.labs.activitySchema);
      setIsLoading(false);
    })();
  }, [typeof window, functionName]);

  return (
    <Page title="Activities">
      <Content mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mb={8} mt={4}>Run Activity</Heading>
        <Text mb={2}>Activity</Text>
        <Select
          mb={6}
          onChange={e => setFunctionName(e.target.value)}
          value={functionName}
        >
          <option></option>
          {activities.map(a => <option value={a} key={a}>{a}</option>)}
        </Select>

        <Form
          schema={schema || {}}
          uiSchema={{}}
          onChange={(e) => { setArgs(e.formData); setErrors(e.errors) }}
          formData={args || {}}
          disabled={isLoading}
          children={true}
          showErrorList={false}
          liveValidate
        />

        <Button
          isLoading={isLoading}
          disabled={isLoading || (errors && errors.length > 0) || !functionName}
          colorScheme="green"
          onClick={async () => {
            setIsLoading(true);
            try {
              const res = await fetch(RunActivityMutation, { functionName, args });
              if (res.labs.runActivity) {
                success('Activity running.');
              } else {
                error('Activity failed.');
              }
            } catch (ex) {
              error(ex.toString());
            }
            setIsLoading(false);
          }}
        >
          Run {functionName}
        </Button>
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ params: { token }}) {
  const res = await apiFetch(GetActivitiesQuery, {}, { 'X-Labs-Authorization': `Bearer ${token}` });
  return {
    props: {
      activities: res.labs.activities,
    },
  };
}