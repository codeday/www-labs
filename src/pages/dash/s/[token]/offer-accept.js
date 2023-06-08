import { print } from 'graphql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Grid, Button, Text, Heading, Link, Spinner, List, ListItem } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import SignatureCanvas from 'react-signature-canvas';
import TimeManagementPlan from '../../../../components/TimeManagementPlan';
import Page from '../../../../components/Page';
import ConfirmAll from '../../../../components/ConfirmAll';
import { useFetcher, useSwr } from '../../../../dashboardFetch';
import { OfferAcceptStatus, AcceptOffer } from './offerAccept.gql'

export default function OfferAccept() {
  const { isValidating, data } = useSwr(print(OfferAcceptStatus), {}, { revalidateOnFocus: false, revalidateOnReconnect: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [timeManagementPlan, setTimeManagementPlan] = useState({});
  const [timeManagementHours, setTimeManagementHours] = useState(0);
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
      <Content display={{ base: 'block', sm: 'none' }}>
        <Text>Please visit this page on a desktop web browser.</Text>
      </Content>
      <Content mt={-8} display={{ base: 'none', sm: 'block' }}>
        <Heading as="h2" fontSize="3xl" mb={4}>Agreement for {student.givenName} {student.surname}</Heading>
        <ConfirmAll
          fontSize="lg"
          toConfirm={[
            `I am available from ${starts.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} to ${ends.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}.`,
            `I am available for the ENTIRE ${student.weeks || 6} weeks. I'm not planning to take more than 2-3 days of vacation.`,
            `I understand Labs is intended to give me an education similar to a internship, but it's not a paid internship.`,
            `I will spend at least ${student.minHours || 30} HOURS PER WEEK on this, for each of the ${student.weeks || ''} weeks, as described in the time management plan below.`,
          ]}
          onUpdate={setConfirmed}
        />

        <Heading as="h3" fontSize="md" mb={4} mt={8}>Signature:</Heading>
        <Box
          borderWidth={1}
          d="inline-block"
        >
          <SignatureCanvas
            penColor='blue'
            canvasProps={{ width: 500, height: 200 }}
            onEnd={() => {setIsSigned(true)}}
          />
        </Box>

        <Heading as="h3" fontSize="md" mb={2} mt={8}>Time Management Plan:</Heading>
        <List ml={8} styleType="disc" mb={8}>
          <ListItem>You don't need to follow this exact schedule every week, but do your best to provide general availability.</ListItem>
          <ListItem>We will use the availability you provide as part of our matching process.</ListItem>
          <ListItem>You cannot create slots less than 90 minutes. We find that students who split their time up in small chunks are not successful.</ListItem>
          <ListItem><strong>You have accounted for {Math.round(timeManagementHours)} of your {student.minHours || 30} hours.</strong></ListItem>
        </List>
        <TimeManagementPlan
          starts={starts.toJSDate()}
          onChange={(hours, plan) => { setTimeManagementHours(hours); setTimeManagementPlan(plan); }}
        />

        <Box mt={4}>
          <Button
            colorScheme="green"
            isLoading={isLoading}
            disabled={isLoading || !isConfirmed || !isSigned || (timeManagementHours < (student.minHours || 30))}
            mb={2}
            onClick={async () => {
              setIsLoading(true);
              try {
                await fetch(AcceptOffer, { timeManagementPlan });
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
