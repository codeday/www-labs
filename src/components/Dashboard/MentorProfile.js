import { useState, useReducer, useEffect } from 'react';
import { print } from 'graphql';
import { useSession } from 'next-auth/client'
import { useTimezoneSelect } from 'react-timezone-select'
import {
  Box,
  Grid,
  Button,
  TextInput as Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Select,
} from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import SelectMentorStatus from './SelectMentorStatus';
import { EditMentor, EditMentorLimited } from './MentorProfile.gql';

function isSuccess (fn) {
  try { fn(); return true; }
  catch (ex) { return false; }
}

export default function MentorProfile({
  mentor: originalMentor,
  priorParticipation,
  limited,
  ...rest
}) {
  const [mentor, setMentor] = useReducer(
    (prev, next) => Array.isArray(next) ? { ...prev, [next[0]]: next[1] } : next,
    originalMentor
  );
  const [ session ] = useSession();
  const [loading, setLoading] = useState(false);
  const fetch = useFetcher();
  const { success, error } = useToasts();
  const [timezone, setTimezone] = useState(originalMentor.timezone);
  const { options: timezoneOptions, parseTimezone } = useTimezoneSelect({});

  useEffect(
    () => setMentor(['timezone', timezone?.value || timezone || null]),
    [timezone]
  );

  const { phone, bio, company, linkedIn, role, whyVolunteer, pronouns, ...remainingProfile } = mentor.profile;
  const [specialProfile, setSpecialProfile] = useReducer(
    (prev, next) => Array.isArray(next) ? { ...prev, [next[0]]: next[1] } : next,
    { phone, bio, company, linkedIn, role, whyVolunteer, pronouns }
  );

  const [profileText, setProfileText] = useState(JSON.stringify(remainingProfile, null, 4));
  useEffect(() => setProfileText(JSON.stringify(remainingProfile, null, 4)), [JSON.stringify(remainingProfile)]);
  const profileTextValid = isSuccess(() => JSON.parse(profileText));

  if (!mentor) return <></>;
  return (
    <Box {...rest}>
      <Box mb={8}>
        <Heading as="h3" fontSize="lg" mt={4}>Name</Heading>
        <Box display="inline-block" mr={4}>
          <Input
            placeholder="Given (First) Name"
            value={mentor.givenName}
            onChange={(e) => setMentor(['givenName', e.target.value])}
          />
        </Box>
        <Box display="inline-block">
          <Input
            display="inline-block"
            placeholder="Family (Last) Name"
            value={mentor.surname}
            onChange={(e) => setMentor(['surname', e.target.value])}
            mr={4}
          />
        </Box>
      </Box>

      <Box mb={8}>
        <Heading as="h3" fontSize="lg">Pronouns</Heading>
        <Box display="inline-block" mr={4}>
          <Input
            placeholder="i.e. they/them"
            value={specialProfile.pronouns}
            onChange={(e) => setSpecialProfile(['pronouns', e.target.value])}
          />
        </Box>
      </Box>

      <Box mb={8}>
        <Heading as="h3" fontSize="lg">Timezone</Heading>
        <Box display="inline-block" mr={4}>
          <Select
            defaultValue={timezone}
            onChange={e => setTimezone(parseTimezone(e.currentTarget.value))}
          >
            <option></option>
            {timezoneOptions.map(option => (
              <option value={option.value}>{option.label}</option>
            ))}
          </Select>
        </Box>
      </Box>

      <Box mb={8}>
        <Heading as="h3" fontSize="lg">Job</Heading>
        <Box display="inline-block" mr={1}>
          <Input
            placeholder="Role"
            value={specialProfile.role}
            onChange={(e) => setSpecialProfile(['role', e.target.value])}
          />
        </Box>
        at
        <Box display="inline-block" ml={1}>
          <Input
            placeholder="Company"
            value={specialProfile.company}
            onChange={(e) => setSpecialProfile(['company', e.target.value])}
          />
        </Box>
      </Box>

      {!limited && (
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 2fr) 1fr' }} gap={8} mb={8}>
          <Box>
            <Heading as="h3" fontSize="lg" mt={4}>Mentor Manager</Heading>
            <Box display="inline-block">
              <Input
                placeholder="Manager Username"
                value={mentor.managerUsername}
                borderTopRightRadius={0}
                borderBottomRightRadius={0}
                onChange={(e) => setMentor(['managerUsername', e.target.value])}
              />
            </Box>
            <Button
              display="inline-block"
              borderTopLeftRadius={0}
              borderBottomLeftRadius={0}
              onClick={() => setMentor(['managerUsername', session?.user?.nickname])}
            >
              &lt; Me
            </Button>
          </Box>

          <Box>
            <Heading as="h3" fontSize="lg" mt={4}>Max Weeks of Mentorship</Heading>
            <Box display="inline-block" mr={4}>
              <NumberInput
                defaultValue={mentor.maxWeeks - 1}
                onChange={(e) => setMentor(['maxWeeks', Number.parseInt(e) + 1])}
                min={4}
                max={11}
                precision={0}
                stepSize={1}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Box>
          </Box>

          <Box>
            <Heading as="h3" fontSize="lg" mt={4}>Status</Heading>
            <SelectMentorStatus status={mentor.status} onChange={(e) => setMentor(['status', e.target.value])} />
          </Box>
        </Grid>
      )}


      <Box mb={8}>
        <Heading as="h3" fontSize="lg" mt={4}>Email</Heading>
        <Box display="inline-block" mr={4}>
          <Input
            placeholder="Email"
            value={mentor.email}
            onChange={(e) => setMentor(['email', e.target.value])}
          />
        </Box>
      </Box>

      <Box mb={8}>
        <Heading as="h3" fontSize="lg" mt={4}>Phone</Heading>
        <Box display="inline-block" mr={4}>
          <Input
            placeholder="Phone"
            value={specialProfile.phone}
            onChange={(e) => setSpecialProfile(['phone', e.target.value])}
          />
        </Box>
      </Box>

      <Box mb={8}>
        <Heading as="h3" fontSize="lg" mt={4}>LinkedIn</Heading>
        <Box display="inline-block" mr={4}>
          <Input
            placeholder="URL"
            value={specialProfile.linkedIn}
            onChange={(e) => setSpecialProfile(['linkedIn', e.target.value])}
          />
        </Box>
      </Box>

      <Box mb={8}>
        <Heading as="h3" fontSize="lg" mt={4}>Bio</Heading>
        <Textarea
          value={specialProfile.bio}
          height={32}
          onChange={(e) => setSpecialProfile(['bio', e.target.value])}
        />
      </Box>

      <Box mb={8}>
        <Heading as="h3" fontSize="lg" mt={4}>Why You&apos;re Volunteering</Heading>
        <Textarea
          value={specialProfile.whyVolunteer}
          height={24}
          onChange={(e) => setSpecialProfile(['whyVolunteer', e.target.value])}
        />
      </Box>

      <Box mb={8}>
        <Heading as="h3" fontSize="lg" mt={4}>Project Preferences</Heading>
        <Textarea
          value={mentor.projectPreferences}
          height={32}
          onChange={(e) => setMentor(['projectPreferences', e.target.value])}
        />
      </Box>

      {!limited && (
        <Box>
          <Heading as="h3" fontSize="lg" mt={4}>Additional Profile Data (JSON)</Heading>
          <Textarea
            value={profileText}
            height="sm"
            onChange={(e) => setProfileText(e.target.value)}
            {...(profileTextValid ? {} : { borderColor: 'red.600' })}
          />
        </Box>
      )}

      <Button
        colorScheme="green"
        mt={4}
        isLoading={loading}
        disabled={loading || !profileTextValid}
        onClick={async () => {
          setLoading(true);

          try {
            const result = await fetch(
              print(limited ? EditMentorLimited : EditMentor),
              {
                id: mentor.id,
                givenName: mentor.givenName,
                surname: mentor.surname,
                email: mentor.email,
                profile: {...(JSON.parse(profileText) || {}), ...specialProfile},
                status: mentor.status,
                managerUsername: mentor.managerUsername || '',
                maxWeeks: mentor.maxWeeks,
                timezone: mentor.timezone,
                projectPreferences: mentor.projectPreferences,
              }
            );
            setMentor(result.labs.editMentor);
            success('Mentor profile updated.');
          } catch (err) {
            error(err.message);
          }

          setLoading(false);
        }}
      >
        Save Mentor Profile
      </Button>
      {priorParticipation && (
        <Button
          ml={4}
          mt={4}
          onClick={() => {
            const {
              status: _,
              id: __,
              maxWeeks: ___,
              username: ____,
              email: _____,
              givenName: ______,
              surname: _______,
              managerUsername: ________,
              profile: priorProfile,
              ...priorParticipationImport
            } = (priorParticipation || {});
            setMentor({
              ...mentor,
              ...priorParticipationImport,
            });
            setSpecialProfile({
              ...specialProfile,
              ...priorProfile,
            });
            success('Imported! Next, verify and save.');
          }}
        >
          Copy From Prior
        </Button>
      )}
    </Box>
  );
}
