import { Box, Button, HStack, TextInput } from '@codeday/topo/Atom';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import { RequestLoginLinkMutation } from './RequestLoginLink.gql';
import { useState } from 'react';

export default function RequestLoginLink(props) {
  const { success, error } = useToasts();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box {...props}>
      <HStack>
        <TextInput
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          placeholder="Email"
        />
        <Button
          isLoading={isLoading}
          disabled={!(email && email.includes('@') && email.includes('.'))}
          onClick={async () => {
            setIsLoading(true);
            try {
              await apiFetch(
                RequestLoginLinkMutation,
                { email },
              );
              setEmail('');
              success(`Check your email for your login link.`);
            } catch (ex) {
              console.error(ex);
              error(`We weren't able to send your login link. Please email us at labs@codeday.org for help.`);
            }
            setIsLoading(false);
          }}
        >
          Request
        </Button>
      </HStack>
    </Box>
  )
}