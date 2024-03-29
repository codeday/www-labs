import { print } from 'graphql';
import { useState } from 'react';
import { Box, Grid, Button, Text, Heading, Link, Spinner } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { useFetcher, useSwr } from '../../../../dashboardFetch';
import { StudentStatus, Withdraw } from './withdraw.gql'

export default function WithdrawApplication() {
  const { isValidating, data } = useSwr(print(StudentStatus));
  const [isLoading, setIsLoading] = useState(false);
  const [isWithdrawn, setIsWithdrawn] = useState(false);
  const { error } = useToasts();
  const fetch = useFetcher();

  if (isValidating || !data?.labs?.student) return (
    <Page title="Withdraw Application">
      <Content textAlign="center">
        <Spinner />
      </Content>
    </Page>
  );

  const student = data.labs.student;

  if (['CANCELED', 'REJECTED', 'ACCEPTED'].includes(student.status)) return (
    <Page title="Withdraw Application">
      <Content textAlign="center">
        <Text>Your application has been {student.status.toLowerCase()}, and can no longer be withdrawn.</Text>
      </Content>
    </Page>
  );

  if (isWithdrawn) return (
    <Page title="Withdraw Application">
      <Content textAlign="center">
        <Text>Your application has been withdrawn.</Text>
      </Content>
    </Page>
  );

  return (
    <Page title="Withdraw Application">
      <Content mt={-8} textAlign="center">
        <Heading as="h2" fontSize="3xl" mb={4}>{student.givenName}, withdraw your application?</Heading>
        <Text>You may not be able to change your mind later.</Text>
        <Box mt={4}>
          <Button
            colorScheme="red"
            isLoading={isLoading}
            disabled={isLoading}
            mb={2}
            onClick={async () => {
              setIsLoading(true);
              try {
                await fetch(Withdraw);
                setIsWithdrawn(true);
              } catch (ex) {
                error(ex.toString());
              }
              setIsLoading(false);
            }}
          >
            Yes, withdraw my application.
          </Button>
        </Box>
      </Content>
    </Page>
  );
}
