import { print } from 'graphql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Grid, Button, Text, Heading, Link, Spinner } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import ConfirmAll from '../../../../components/ConfirmAll';
import { useFetcher, useSwr } from '../../../../dashboardFetch';
import { OfferAcceptStatus, AcceptOffer } from './offerAccept.gql'

export default function OfferAccept() {
  const { isValidating, data } = useSwr(print(OfferAcceptStatus), {}, { revalidateOnFocus: false, revalidateOnReconnect: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);
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

  const starts = DateTime.fromISO(student.event?.startsAt);
  const ends = starts.plus({ weeks: student.weeks || 6 }).minus({ days: 3 });

  return (
    <Page title="Accept Offer">
      <Content mt={-8}>
        <Heading as="h2" fontSize="3xl" mb={4}>{student.givenName}, accept your offer?</Heading>
        <ConfirmAll
          toConfirm={[
            `I am available from ${starts.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} to ${ends.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}.`,
            `I am available for the ENTIRE ${student.weeks || 6} weeks. I'm not planning to take more than 2-3 days of vacation.`,
            `I will spend at least ${student.minHours || 30} hours on this, for each of the ${student.weeks || 6} weeks.`,
            `I am available to meet with my team members during the US workday.`,
            `I understand Labs is intended to give me an education similar to a internship, but it's not a paid internship.`,
          ]}
          onUpdate={setConfirmed}
        />
        <Box mt={4}>
          <Button
            colorScheme="green"
            isLoading={isLoading}
            disabled={isLoading || !isConfirmed}
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
