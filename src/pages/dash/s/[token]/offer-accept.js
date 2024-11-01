import { print } from 'graphql';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Button, Text, Heading, Link, Spinner, List, ListItem } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import SignatureCanvas from 'react-signature-canvas';
import TimezoneSelect from '../../../../components/TimezoneSelect';
import TimeManagementPlan from '../../../../components/TimeManagementPlan';
import Page from '../../../../components/Page';
import ConfirmAll from '../../../../components/ConfirmAll';
import { useFetcher, useSwr } from '../../../../dashboardFetch';
import { OfferAcceptStatus, AcceptOffer } from './offerAccept.gql'
import Form from '../../../../components/RsjForm';

export default function OfferAccept() {
  const { isValidating, data } = useSwr(print(OfferAcceptStatus), {}, { revalidateOnFocus: false, revalidateOnReconnect: false });
  const [isLoading, setIsLoading] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isConfirmed, setConfirmed] = useState(false);
  const [partnerContractData, setPartnerContractData] = useState({});
  const [eventContractData, setEventContractData] = useState({});
  const [partnerContractErrors, setPartnerContractErrors] = useState({});
  const [eventContractErrors, setEventContractErrors] = useState({});
  const [isSigned, setIsSigned] = useState(false);
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [timeManagementPlan, setTimeManagementPlan] = useState({});
  const [timeManagementHours, setTimeManagementHours] = useState(0);
  const { error } = useToasts();
  const fetch = useFetcher();
  const { query } = useRouter();

  const timezone = useMemo(
    () => selectedTimezone.value || selectedTimezone,
    [selectedTimezone]
  );

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
      <Content display={{ base: 'none', sm: 'block' }} textAlign="center" color="current.textLight" mb={4} mt={-8}>
        Complete the admissions agreement below to accept your offer or{' '}
        <Link as="a" href={`/dash/s/${query.token}/withdraw`} color="current.textLight">click here to withdraw your application.</Link>
      </Content>
      <Content
        display={{ base: 'none', sm: 'block' }}
        maxWidth="container.md"
        fontFamily="Times New Roman, serif"
        borderWidth={2}
        p={4}
      >
        <Heading
          as="h2"
          fontSize="xl"
          mb={4}
          textAlign="center"
          fontFamily="Times New Roman, serif"
        >
          Admissions Agreement<br />{student.givenName} {student.surname}, {student.event.name}
        </Heading>

        {student.event.contractSchema && (
          <Form
            schema={student.event.contractSchema}
            uiSchema={student.event.contractUi}
            onChange={(e) => { setEventContractData(e.formData); setEventContractErrors(e.errors); }}
            formData={eventContractData}
            children={true}
            showErrorList={false}
            liveValidate
          />
        )}

        {student.partner?.contractSchema && (
          <Form
            schema={student.partner.contractSchema}
            uiSchema={student.partner.contractUi}
            onChange={(e) => { setPartnerContractData(e.formData); setPartnerContractErrors(e.errors); }}
            formData={partnerContractData}
            children={true}
            showErrorList={false}
            liveValidate
          />
        )}

        <Heading
          as="h3"
          fontSize="md"
          mb={2}
          mt={8}
          fontFamily="Times New Roman, serif"
        >
          Timezone
        </Heading>
        <Text mb={2}>I will be working from the following timezone during {student.event.name}:</Text>
        <Box>
          <TimezoneSelect
            value={selectedTimezone}
            onChange={setSelectedTimezone}
          />
        </Box>

        <Heading
          as="h3"
          fontSize="md"
          mb={2}
          mt={8}
          fontFamily="Times New Roman, serif"
        >
          Weekly Time Management Plan
        </Heading>
        <Text mb={2}>During {student.event.name}, I plan to work on my assigned project during the times selected below.</Text>
        <Text mb={2}>I understand that I may make small deviations from this schedule, but I will do my best to follow it. If I am not regularly following this schedule, I acknowledge that I may be removed from the program.</Text>
        <TimeManagementPlan
          starts={starts.toJSDate()}
          onChange={(hours, plan) => { setTimeManagementHours(hours); setTimeManagementPlan(plan); }}
        />
        {timeManagementHours < (student.minHours || 30) && (
          <Box
            color="red.600"
          >
            You must select {(student.minHours || 30 ) - Math.round(timeManagementHours)} additional hours to submit. All slots must be at least 90 minutes.
            </Box>
        )}

        <Heading
          as="h3"
          fontSize="md"
          mb={4}
          mt={8}
          fontFamily="Times New Roman, serif"
        >
          Certifications
        </Heading>
        <ConfirmAll
          fontSize="lg"
          toConfirm={[
            `I am available for the ENTIRE ${student.weeks} weeks (${starts.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} to ${ends.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}).`,
            ...(student.event.certificationStatements || []),
            `I will spend at least ${student.minHours || 30} HOURS PER WEEK on this, for each of the ${student.weeks || ''} weeks, as described in the time management plan below.`,
          ]}
          onUpdate={setConfirmed}
        />

        <Heading
          as="h3"
          fontSize="md"
          mb={4}
          mt={8}
          fontFamily="Times New Roman, serif"
        >
          Signature
        </Heading>
        <Box
          borderWidth={1}
          d="inline-block"
        >
          <SignatureCanvas
            penColor='blue'
            canvasProps={{ width: 350, height: 120 }}
            onEnd={() => {setIsSigned(true)}}
          />
          <Box borderBottomWidth={1} borderColor="current.textLight" mb={6} mt={-6} ml={2} mr={2} />
        </Box>
        <Text
          fontSize="sm"
          fontFamily="Times New Roman, serif"
        >
          {student.givenName} {student.surname}
        </Text>

        <Box mt={4}>
          <Button
            colorScheme="green"
            isLoading={isLoading}
            disabled={
              isLoading
              || !isConfirmed
              || !isSigned
              || (timeManagementHours < (student.minHours || 30))
              || Object.keys(partnerContractErrors).length > 0
              || Object.keys(eventContractErrors).length > 0
            }
            mb={2}
            onClick={async () => {
              setIsLoading(true);
              try {
                await fetch(AcceptOffer, { timeManagementPlan, timezone, partnerContractData, eventContractData });
                setIsAccepted(true);
              } catch (ex) {
                error(ex.toString());
              }
              setIsLoading(false);
            }}
          >
            I accept!
          </Button>
        </Box>
      </Content>
    </Page>
  );
}
