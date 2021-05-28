import { print } from 'graphql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Spinner from '@codeday/topo/Atom/Spinner';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { useFetcher, useSwr } from '../../../../dashboardFetch';
import { OfferAcceptStatus, AcceptOffer } from './offerAccept.gql'

export default function OfferAccept() {
  const { isValidating, data } = useSwr(print(OfferAcceptStatus));
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const { error } = useToasts();
  const fetch = useFetcher();
  const { query } = useRouter();

  if (isValidating || !data?.labs?.student) return (
    <Page title="Accept Offer">
      <Content textAlign="center">
        <Spinner />
      </Content>
    </Page>
  );

  const student = data.labs.student;

  if (!student.hasValidAdmissionOffer || isAccepted) return (
    <Page title="Accept Offer">
      <Content textAlign="center">
        <Text>
          {data.labs.student.status === 'ACCEPTED' || isAccepted
            ? 'You have accepted your offer.'
            : 'You have no offer to accept.'
          }
        </Text>
      </Content>
    </Page>
  );

  return (
    <Page title="Accept Offer">
      <Content mt={-8} textAlign="center">
        <Heading as="h2" fontSize="3xl" mb={4}>{student.givenName}, accept your offer?</Heading>
        <Text>Commit to spending at least {student.minHours} hours per week over this {student.weeks}-week program?</Text>
        <Box mt={4}>
          <Button
            variantColor="green"
            isLoading={isLoading}
            disabled={isLoading}
            mb={2}
            onClick={async () => {
              setIsLoading(true);
              try {
                await fetch(AcceptOffer);
                setIsAccepted(true);
              } catch (ex) {
                error(ex.toString());
              }
              setIsLoading(false);
            }}
          >
            I accept!
          </Button>
          <Text color="current.textLight">
            or{' '}
            <Link as="a" href={`/dash/s/${query.token}/withdraw`} color="current.textLight">withdraw application</Link>
          </Text>
        </Box>
      </Content>
    </Page>
  );
}
