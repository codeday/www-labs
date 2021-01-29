import { signIn, useSession } from 'next-auth/client'
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Spinner from '@codeday/topo/Atom/Spinner';
import Text from '@codeday/topo/Atom/Text';

export default function CheckLoggedIn({ children, ...props }) {
  const [ session, loading ] = useSession();

  if (loading) return (
    <Box textAlign="center" maxWidth="md" margin="0 auto" {...props}>
      <Spinner />
      <Text>Checking if you're logged into a CodeDay account...</Text>
    </Box>
  );

  if (!session) return (
    <Box textAlign="center" maxWidth="md" margin="0 auto" {...props}>
      <Button onClick={() => signIn('auth0')} variantColor="green" mb={2}>Sign In</Button>
      <Text>
        You'll need to create or log into a CodeDay account to continue. You'll use this to access your Labs dashboard
        if your application is accepted.
      </Text>
    </Box>
  );

  return children(session) || <></>;
}
