import useSwr from 'swr';
import fetch from 'node-fetch';
import { signIn, useSession } from 'next-auth/client'
import Box from '@codeday/topo/Atom/Box';
import Text from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Spinner from '@codeday/topo/Atom/Spinner';
import Content from '@codeday/topo/Molecule/Content';
import Page from '../../components/Page';

const sectionNames = { a: 'Admin', mm: 'Manager', r: 'Reviewer', m: 'Mentor', s: 'Student' };

export default function DashboardLogin() {
  const { loading, data, ...rest } = useSwr('/api/dashRedirect', (url) => fetch(url).then((r) => r.json()));
  if (data && Object.keys(data).length === 1) {
    const k = Object.keys(data)[0];
    window.location = `/dash/${k}/${data[k]}`;
  } else if (data) return (
    <Page slug={`/dash`} title={`Dashboard`}>
      <Box textAlign="center" maxWidth="md" margin="0 auto">
        {Object.keys(data).map((k) => (
          <Button key={k} mr={2} as="a" href={`/dash/${k}/${data[k]}`}>{sectionNames[k] || k}</Button>
        ))}
      </Box>
    </Page>
  );


  if (loading || data) return (
    <Page slug={`/dash`} title={`Dashboard`}>
      <Box textAlign="center" maxWidth="md" margin="0 auto">
        <Spinner />
      </Box>
    </Page>
  );

  return (
    <Page slug={`/dash`} title={`Dashboard`}>
      <Content>
        <Box textAlign="center" maxWidth="md" margin="0 auto">
          <Button onClick={() => signIn('auth0')} variantColor="green" mb={2}>Sign In</Button>
          <Text>
            You'll need to create or log into a CodeDay account to continue. You'll use this to access your Labs dashboard
            if your application is accepted.
          </Text>
        </Box>
      </Content>
    </Page>
  );
}
