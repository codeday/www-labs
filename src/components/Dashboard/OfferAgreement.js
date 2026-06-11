import { DateTime } from "luxon";
import SignatureCanvas from "react-signature-canvas";
import { Box, Button, Heading, Text } from "@codeday/topo/Atom";
import { Content } from "@codeday/topo/Molecule";
import ConfirmAll from "../ConfirmAll";
import TimeManagementPlan from "../TimeManagementPlan";
import TimezoneSelect from "../TimezoneSelect";
import OfferContractSection from "./OfferContractSection";

export default function OfferAgreement({ student, form }) {
  const starts = DateTime.fromISO(student.event?.startsAt);
  const ends = starts.plus({ weeks: student.weeks || 6 }).minus({ days: 3 });
  const minHours = student.minHours || 30;
  const startsLabel = starts.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
  const endsLabel = ends.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);

  return (
    <Content
      display={{ base: "none", sm: "block" }}
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
        {student.event.name} Admission Agreement
        <br />
        {student.givenName} {student.surname}
      </Heading>

      <OfferContractSection
        schema={student.event.contractSchema}
        uiSchema={student.event.contractUi}
        formData={form.contracts.event.data}
        onDataChange={(data) => form.setContractData("event", data)}
        onErrorsChange={(errors) => form.setContractErrors("event", errors)}
      />

      {student.partner ? (
        <OfferContractSection
          schema={student.partner?.contractSchema}
          uiSchema={student.partner?.contractUi}
          formData={form.contracts.partner.data}
          onDataChange={(data) => form.setContractData("partner", data)}
          onErrorsChange={(errors) => form.setContractErrors("partner", errors)}
        />
      ) : (
        <OfferContractSection
          schema={student.event.contractSchemaNoPartner}
          uiSchema={student.event.contractUiNoPartner}
          formData={form.contracts.partner.data}
          onDataChange={(data) => form.setContractData("partner", data)}
          onErrorsChange={(errors) => form.setContractErrors("partner", errors)}
        />
      )}

      <Heading as="h5" mt={8} fontSize="lg">
        Availability and Time Management
      </Heading>
      <Text mb={2}>
        The length of the commitment is {student.weeks} weeks, from{" "}
        {startsLabel} to {endsLabel}. You are expected to devote at least{" "}
        {student.minHours} hours per week on your assigned project. This time
        will include mentor meetings, TA meetings, team meetings,{" "}
        <strong>
          <em>and significant individual work.</em>
        </strong>
      </Text>
      <Text mb={2}>
        The timezone you will be working from between {startsLabel} &mdash;{" "}
        {endsLabel}:{" "}
        <Text as="span" color="red.300" fontWeight="bold">
          *
        </Text>
      </Text>
      <Box>
        <TimezoneSelect
          value={form.selectedTimezone}
          onChange={form.setSelectedTimezone}
        />
      </Box>
      <Text mb={2} mt={4}>
        Your availability for meetings and individual work:{" "}
        <Text as="span" color="red.300" fontWeight="bold">
          *
        </Text>
      </Text>
      <Text>
        Please select <b>ALL</b> times you <b>COULD</b> work on your project.
        (E.g., all times you do not have work or school.) We will use this
        availability for matching, so the more times you select, the more
        projects you will be eligible to match with. You are not required to
        work during all times you select, you will just need to put in{" "}
        {minHours} hours of work during some of the available times you list.
      </Text>
      <TimeManagementPlan
        starts={starts.toJSDate()}
        onChange={form.setTimeManagement}
      />
      {form.timeManagementHours < minHours && (
        <Box color="red.600">
          You must select at least {minHours} hours of availability (but more is
          better). Enter{" "}
          {Math.round((minHours - form.timeManagementHours) * 10) / 10}{" "}
          additional hours to submit. All slots must be at least 90 minutes.
        </Box>
      )}

      <Heading as="h5" mt={8} fontSize="lg">
        Commitments and Certifications{" "}
        <Text as="span" color="red.300" fontWeight="bold">
          *
        </Text>
      </Heading>
      <ConfirmAll
        fontSize="lg"
        toConfirm={[
          `I am available for the ENTIRE ${student.weeks} weeks (${startsLabel} to ${endsLabel}).`,
          ...(student.event.certificationStatements || []),
          `I will spend at least ${minHours} HOURS PER WEEK on this, for each of the ${student.weeks || ""} weeks.`,
        ]}
        onUpdate={form.setConfirmed}
      />

      <Heading as="h5" mt={8} fontSize="lg">
        Signature{" "}
        <Text as="span" color="red.300" fontWeight="bold">
          *
        </Text>
      </Heading>
      <Text mb={2}>
        I,{" "}
        <Text as="span" borderBottomWidth={1}>
          {student.givenName} {student.surname}
        </Text>
        , hereby indicate my commitment to participate in {student.event.name}{" "}
        program from {startsLabel} to {endsLabel}. I understand that I need to
        meet specific requirements to participate and will work towards meeting
        the expectations listed in this agreement. I agree to notify the program
        immediately should, for any reason, I decide to withdraw my
        participation.
      </Text>
      <Box borderWidth={1} display="inline-block">
        <SignatureCanvas
          penColor="blue"
          canvasProps={{ width: 350, height: 120 }}
          onEnd={() => form.setIsSigned(true)}
        />
        <Box
          borderBottomWidth={1}
          borderColor="current.textLight"
          mb={6}
          mt={-6}
          ml={2}
          mr={2}
        />
      </Box>
      <Text fontSize="sm" fontFamily="Times New Roman, serif">
        {student.givenName} {student.surname}
      </Text>

      <Box mt={4}>
        <Button
          colorScheme="green"
          isLoading={form.isLoading}
          disabled={!form.canSubmit(student)}
          mb={2}
          onClick={form.submit}
        >
          I accept!
        </Button>
      </Box>
    </Content>
  );
}
