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
        p={8}
      >
        <Heading
          as="h2"
          fontSize="xl"
          mb={4}
          textAlign="center"
          fontFamily="Times New Roman, serif"
        >
          {student.event.name} Admission Agreement<br />{student.givenName} {student.surname}
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

        <Heading as="h5" mt={8} fontSize="lg">Availability and Time Management</Heading>
        <Text mb={2}>The length of the commitment is {student.weeks} weeks, from {starts.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} to {ends.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}. You are expected to devote at least {student.minHours} hours per week on your assigned project. This time will include mentor meetings, TA meetings, team meetings, <strong><em>and significant individual work.</em></strong></Text>
        <Text mb={2}>The timezone you will be working from between {starts.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} &mdash; {ends.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}: <Text as="span" color="red.300" fontWeight="bold">*</Text></Text>
        <Box>
          <TimezoneSelect
            value={selectedTimezone}
            onChange={setSelectedTimezone}
          />
        </Box>
        <Text mb={2} mt={4}>Your availability for meetings and individual work: <Text as="span" color="red.300" fontWeight="bold">*</Text></Text>
        <Text>Please select <b>ALL</b> times you <b>COULD</b> work on your project. (E.g., all times you do not have work or school.) We will use this availability for matching,
              so the more times you select, the more projects you will be eligible to match with. You are not required to work during all times you select, you will just need to
              put in {student.minHours || 30} hours of work during some of the available times you list.</Text>
        <TimeManagementPlan
          starts={starts.toJSDate()}
          onChange={(hours, plan) => { setTimeManagementHours(hours); setTimeManagementPlan(plan); }}
        />
        {timeManagementHours < (student.minHours || 30) && (
          <Box
            color="red.600"
          >
            You must select at least {student.minHours || 30} hours of availability (but more is better). Enter {Math.round(((student.minHours || 30 ) - timeManagementHours) * 10) / 10} additional hours to submit. All slots must be at least 90 minutes.
            </Box>
        )}

        <Heading as="h5" mt={8} fontSize="lg">Commitments and Certifications <Text as="span" color="red.300" fontWeight="bold">*</Text></Heading>
        <ConfirmAll
          fontSize="lg"
          toConfirm={[
            `I am available for the ENTIRE ${student.weeks} weeks (${starts.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} to ${ends.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}).`,
            ...(student.event.certificationStatements || []),
            `I will spend at least ${student.minHours || 30} HOURS PER WEEK on this, for each of the ${student.weeks || ''} weeks.`,
          ]}
          onUpdate={setConfirmed}
        />

        <Heading as="h5" mt={8} fontSize="lg">Signature <Text as="span" color="red.300" fontWeight="bold">*</Text></Heading>
        <Text mb={2}>
          I, <Text as="span" borderBottomWidth={1}>{student.givenName} {student.surname}</Text>, hereby indicate my commitment to participate in {student.event.name} program from {starts.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)} to {ends.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY)}. I understand that I need to meet specific requirements to participate and will work towards meeting the expectations listed in this agreement. I agree to notify the program immediately should, for any reason, I decide to withdraw my participation.
        </Text>
        <Box
          borderWidth={1}
          display="inline-block"
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
