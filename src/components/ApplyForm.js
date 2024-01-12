import { Box, Button, Heading, Spinner, Text } from '@codeday/topo/Atom';
import { Form } from '@rjsf/chakra-ui';
import { useEffect, useState } from 'react';
import TagPicker from './Dashboard/TagPicker';
import { api, apiFetch, useToasts } from '@codeday/topo/utils';
import { ApplyFormQuery, ApplyMutation } from './ApplyForm.gql';
import TimezoneSelect from 'react-timezone-select';

const PROFILE_INFO_SCHEMA = {
  "type": "object",
  "required": [
    "givenName",
    "surname",
    "email",
    "minHours"
  ],
  "properties": {
    "givenName": {
      "type": "string",
      "title": "First name (given name)"
    },
    "surname": {
      "type": "string",
      "title": "Last name (surname)"
    },
    "email": {
      "type": "string",
      "title": "Email"
    },
    "minHours": {
      "type": "string",
      "title": "What's the minimum number of hours you're able to work on this in a week?",
      "oneOf": [
        {
          "const": "10",
          "title": "10-20"
        },
        {
          "const": "20",
          "title": "20-30"
        },
        {
          "const": "30",
          "title": "30-40"
        }
      ]
    },
    "partnerCode": {
      "type": "string",
      "title": "Partner Code (if any)"
    }
  }
};

export default function ApplyForm({
  eventId,
  username,
  givenName,
  surname,
  email,
  track,
  partnerCode,
  ...props
}) {
  const { error } = useToasts();
  const [token, setToken] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [tags, setTags] = useState(null);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [basicData, setBasicData] = useState({});
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [profile, setProfile] = useState({});
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  
  const [basicErrors, setBasicErrors] = useState(null);
  const [profileErrors, setProfileErrors] = useState(null);

  useEffect(async () => {
    if (typeof window === 'undefined') return;
    const result = await fetch(`/api/apply?e=${eventId}`);
    setToken(await result.text());
  }, [eventId, typeof window]);

  useEffect(async () => {
    if (typeof window === 'undefined' || !token) return;
    const result = await apiFetch(
      ApplyFormQuery,
      {},
      { 'X-Labs-Authorization': `Bearer ${token}`}
    );
    setEvent(result.labs.event);
    setTags(result.labs.tags);
  }, [ token, typeof window ]);

  if (applicationId) return (
    <Box {...props}>
      <Text><center>Thank you! Your application was received with ID {applicationId}.</center></Text>
    </Box>
  );

  if (!event || !tags) return <Box {...props}><Spinner /></Box>;

  const hasProfile = event.studentApplicationSchema && Object.entries(event.studentApplicationSchema).length > 0;

  return (
    <Box {...props}>
      <Form
        schema={PROFILE_INFO_SCHEMA}
        uiSchema={{}}
        onChange={(e) => { setBasicData(e.formData); setBasicErrors(e.errors) }}
        formData={{ givenName, surname, email, partnerCode, ...basicData }}
        disabled={isLoading}
        children={true}
        showErrorList={false}
        liveValidate
      />
      {hasProfile && (
        <Form
          schema={event.studentApplicationSchema}
          uiSchema={event.studentApplicationUi || {}}
          onChange={(e) => { setProfile(e.formData); setProfileErrors(e.errors); }}
          formData={profile}
          disabled={isLoading}
          children={true}
          showErrorList={false}
          liveValidate
        />
      )}

      <Heading as="h3" fontSize="xl" mt={8}>Which timezone do you plan to work from during the program?</Heading>
      <TimezoneSelect
        value={selectedTimezone}
        onChange={setSelectedTimezone}
      />

      <Heading as="h3" fontSize="xl" mt={8}>Interests</Heading>
      <TagPicker
        onlyType="INTEREST"
        display="student"
        options={tags}
        tags={selectedInterests}
        onChange={setSelectedInterests}
        disabled={isLoading}
      />

      <Heading as="h3" fontSize="xl" mt={8}>Preferred Technologies</Heading>
      <TagPicker
        onlyType="TECHNOLOGY"
        display="student"
        options={tags}
        tags={selectedTechnologies}
        onChange={setSelectedTechnologies}
        disabled={isLoading}
      />

      <Button
        onClick={async () => {
          setIsLoading(true);
          try {
            const result = await apiFetch(
              ApplyMutation,
              { 
                ...basicData,
                minHours: Number.parseInt(basicData.minHours),
                tags: [...selectedInterests, ...selectedTechnologies].map(e => e.id),
                profile: profile,
                track,
                partnerCode: basicData.partnerCode || partnerCode || null,
                timezone: selectedTimezone?.value || Intl.DateTimeFormat().resolvedOptions().timeZone || null,
              },
              { 'X-Labs-Authorization': `Bearer ${token}` },
            );
            setApplicationId(result.labs.applyStudent.id);
          } catch (ex) {
            error('Error', ex.toString());
            console.error(ex);
          }
          setIsLoading(false);
        }}
        mt={8}
        size="lg"
        colorScheme="green"
        disabled={
          selectedInterests.length === 0
          || selectedTechnologies.length === 0
          || !basicErrors || basicErrors.length > 0
          || ((!profileErrors || profileErrors.length > 0) && hasProfile)
          || !basicData.givenName
          || !basicData.surname
          || !basicData.email
          || !basicData.minHours
        }
        isLoading={isLoading}
      >
        Apply Now
      </Button>
    </Box>
  )
}