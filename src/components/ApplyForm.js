import { Box, Button, Heading, Spinner, Text, Link } from '@codeday/topo/Atom';
import { Form } from '@rjsf/chakra-ui';
import { useRef, useState } from 'react';
import TagPicker from './Dashboard/TagPicker';
import Timestamp from './Timestamp';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import { ApplyFormQuery, ApplyMutation } from './ApplyForm.gql';
import TimezoneSelect from './TimezoneSelect';
import { useApiFetch, useClientEffect, useDateBetween, useIso } from '../utils';
import MultiPage, { MultiPagePage } from './MultiPage';

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
  const [isLoading, setIsLoading] = useState(false);
  const [basicData, setBasicData] = useState({});
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [profile, setProfile] = useState({});
  const [selectedTimezone, setSelectedTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const uploadRef = useRef();
  const [resume, setResume] = useState(null);
  
  const [basicErrors, setBasicErrors] = useState(null);
  const [profileErrors, setProfileErrors] = useState(null);

  useClientEffect(async () => {
    const result = await fetch(`/api/apply?e=${eventId}`);
    setToken(await result.text());
  }, [eventId]);

  const { labs } = useApiFetch(ApplyFormQuery, {}, token) || {};
  const { event, tags } = labs || {};

  const applicationsStartAt = useIso(event?.studentApplicationsStartAt);
  const applicationsEndAt = useIso(event?.studentApplicationsEndAt);
  const applicationsOpen = useDateBetween(applicationsStartAt, applicationsEndAt);

  if (applicationId) return (
    <Box {...props}>
      <Text><center>Thank you! Your application was received with ID {applicationId}.</center></Text>
    </Box>
  );

  if (!applicationsOpen) return (
    <Box {...props}>
      <Text>
        <center>
          Applications for this event are open from{' '}
          <Timestamp ts={applicationsStartAt} />{' to '}
          <Timestamp ts={applicationsEndAt} />
        </center>
      </Text>
    </Box>
  )

  if (!event || !tags) return <Box {...props}><Spinner /></Box>;

  const hasProfile = event.studentApplicationSchema && Object.entries(event.studentApplicationSchema).length > 0;

  const missingData = selectedInterests.length === 0
  || selectedTechnologies.length === 0
  || !basicErrors || basicErrors.length > 0
  || ((!profileErrors || profileErrors.length > 0) && hasProfile)
  || !basicData.givenName
  || !basicData.surname
  || !basicData.email
  || !basicData.minHours;

  return (
    <Box {...props}>
      <MultiPage
        submitButton={
          <>
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
                    resume,
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
            colorScheme="green"
            disabled={missingData}
            isLoading={isLoading}
          >
            Apply Now
          </Button>
          {missingData && (
            <Box color="red.500" fontSize="sm" mt={2}>
              Please fill out all required fields.
            </Box>
          )}
        </>
        }
      >
        <MultiPagePage title="Contact Information">
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

          <Heading as="h3" fontSize="md" fontWeight="normal" mt={8}>Which timezone do you plan to work from during the program?</Heading>
          <TimezoneSelect
            value={selectedTimezone}
            onChange={setSelectedTimezone}
          />
        </MultiPagePage>
        <MultiPagePage title="Profile">
          <Heading as="h3" fontSize="md" fontWeight="normal" mb={1}>Resume/CV</Heading>
          <Box mb={6}>
            <input
              ref={uploadRef}
              type="file"
              accept="application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => {
                if (e.target.files.length > 0) {
                  setResume(e.target.files[0]);
                }
              }}
              style={{ display: 'none' }}
            />
            <Button mr={2} display="inline-block" onClick={() => uploadRef.current?.click()}>
              Upload Resume
            </Button>
            {resume && (
              <Text display="inline-block" color="current.textLight">
                {resume.name}
                <Link ml={2} onClick={() => setResume(null)}>(remove)</Link>
              </Text>
            )}
          </Box>

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
        </MultiPagePage>
        <MultiPagePage title="Interests">
            <Heading as="h3" fontSize="md" fontWeight="normal">Interests</Heading>
            <TagPicker
              onlyType="INTEREST"
              display="student"
              options={tags}
              tags={selectedInterests}
              onChange={setSelectedInterests}
              disabled={isLoading}
            />

            <Heading as="h3" fontSize="md" fontWeight="normal" mt={8}>Preferred Technologies<Text display="inline" color="red.500">*</Text></Heading>
            <TagPicker
              onlyType="TECHNOLOGY"
              display="student"
              options={tags}
              tags={selectedTechnologies}
              onChange={setSelectedTechnologies}
              disabled={isLoading}
            />
        </MultiPagePage>
      </MultiPage>



    </Box>
  )
}