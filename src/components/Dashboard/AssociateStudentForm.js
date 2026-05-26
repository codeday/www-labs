import { useState } from 'react';
import { Box, Button, Heading, Text, TextInput as Input } from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import { AssociatePartnerCodeMutation } from '../../pages/dash/p/[token]/index.gql';

export default function AssociateStudentForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const fetch = useFetcher();
  const { success, error } = useToasts();

  const onAssociate = async () => {
    try {
      const result = await fetch(AssociatePartnerCodeMutation, {
        where: {
          username: username || undefined,
          email: email || undefined,
        },
      });
      if (result.labs.associatePartnerCode.id) {
        success(`Associated ${result.labs.associatePartnerCode.givenName} ${result.labs.associatePartnerCode.surname}.`);
        setEmail('');
        setUsername('');
      } else throw new Error();
    } catch (ex) {
      console.error(ex);
      error('Student not found.');
    }
  };

  return (
    <Box mt={8}>
      <Heading as="h4" fontSize="md">Associate Student</Heading>
      <Text fontSize="sm" fontWeight="bold">Email</Text>
      <Input onChange={(e) => setEmail(e.target.value)} value={email} />
      <Text fontSize="sm" fontWeight="bold">or CodeDay Username</Text>
      <Input onChange={(e) => setUsername(e.target.value)} value={username} />
      <Button onClick={onAssociate}>Associate</Button>
    </Box>
  );
}
