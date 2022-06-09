import { useState, useReducer, useEffect } from 'react';
import { print } from 'graphql';
import { useSession } from 'next-auth/client'
import {
  Box,
  Grid,
  Button,
  TextInput as Input,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
} from '@codeday/topo/Atom';
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import SelectMentorStatus from './SelectMentorStatus';
import { EditMentor } from './MentorProfile.gql';

function isSuccess (fn) {
  try { fn(); return true; }
  catch (ex) { return false; }
}

export default function MentorProfile({ mentor: originalMentor, ...rest }) {
  const [mentor, setMentor] = useReducer(
    (prev, next) => Array.isArray(next) ? { ...prev, [next[0]]: next[1] } : next,
    originalMentor
  );
  const [ session ] = useSession();
  const [loading, setLoading] = useState(false);
  const fetch = useFetcher();
  const { success, error } = useToasts();

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
      <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8} mb={8}>
        <Box>
          <Heading as="h3" fontSize="lg" mt={4}>Name</Heading>
          <Box d="inline-block" mr={4}>
            <Input
              placeholder="Given (First) Name"
              value={mentor.givenName}
              onChange={(e) => setMentor(['givenName', e.target.value])}
            />
          </Box>
          <Box d="inline-block">
            <Input
              d="inline-block"
              placeholder="Family (Last) Name"
              value={mentor.surname}
              onChange={(e) => setMentor(['surname', e.target.value])}
              mr={4}
            />
          </Box>
        </Box>

        <Box>
          <Heading as="h3" fontSize="lg" mt={4}>Pronouns</Heading>
          <Box d="inline-block" mr={4}>
            <Input
              placeholder="i.e. they/them"
              value={specialProfile.pronouns}
              onChange={(e) => setSpecialProfile(['pronouns', e.target.value])}
            />
          </Box>
        </Box>
      </Grid>

      <Box mb={8}>
        <Heading as="h3" fontSize="lg">Job</Heading>
        <Box d="inline-block" mr={1}>
          <Input
            placeholder="Role"
            value={specialProfile.role}
            onChange={(e) => setSpecialProfile(['role', e.target.value])}
          />
        </Box>
        at
        <Box d="inline-block" ml={1}>
          <Input
            placeholder="Company"
            value={specialProfile.company}
            onChange={(e) => setSpecialProfile(['company', e.target.value])}
          />
        </Box>
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 2fr) 1fr' }} gap={8} mb={8}>
        <Box>
          <Heading as="h3" fontSize="lg" mt={4}>Mentor Manager</Heading>
          <Box d="inline-block">
            <Input
              placeholder="Manager Username"
              value={mentor.managerUsername}
              borderTopRightRadius={0}
              borderBottomRightRadius={0}
              onChange={(e) => setMentor(['managerUsername', e.target.value])}
            />
          </Box>
          <Button
            d="inline-block"
            borderTopLeftRadius={0}
            borderBottomLeftRadius={0}
            onClick={() => setMentor(['managerUsername', session?.user?.nickname])}
          >
            &lt; Me
          </Button>
        </Box>

        <Box>
          <Heading as="h3" fontSize="lg" mt={4}>Max Weeks of Mentorship</Heading>
          <Box d="inline-block" mr={4}>
            <NumberInput
              value={mentor.maxWeeks - 1}
              min={4}
              max={11}
              precision={0}
              stepSize={1}
              onChange={(e) => setMentor(['maxWeeks', e + 1])}
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


      <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={8} mb={8}>
        <Box>
          <Heading as="h3" fontSize="lg" mt={4}>Email</Heading>
          <Box d="inline-block" mr={4}>
            <Input
              placeholder="Email"
              value={mentor.email}
              onChange={(e) => setMentor(['email', e.target.value])}
            />
          </Box>
        </Box>

        <Box>
          <Heading as="h3" fontSize="lg" mt={4}>Phone</Heading>
          <Box d="inline-block" mr={4}>
            <Input
              placeholder="Phone"
              value={specialProfile.phone}
              onChange={(e) => setSpecialProfile(['phone', e.target.value])}
            />
          </Box>
        </Box>

        <Box>
          <Heading as="h3" fontSize="lg" mt={4}>LinkedIn</Heading>
          <Box d="inline-block" mr={4}>
            <Input
              placeholder="URL"
              value={specialProfile.linkedIn}
              onChange={(e) => setSpecialProfile(['linkedIn', e.target.value])}
            />
          </Box>
        </Box>
      </Grid>

      <Box mb={8}>
        <Heading as="h3" fontSize="lg" mt={4}>Bio</Heading>
        <Textarea
          value={specialProfile.bio}
          height={32}
          onChange={(e) => setSpecialProfile(['bio', e.target.value])}
        />
      </Box>

      <Box mb={8}>
        <Heading as="h3" fontSize="lg" mt={4}>Why Volunteer?</Heading>
        <Textarea
          value={specialProfile.whyVolunteer}
          height={24}
          onChange={(e) => setSpecialProfile(['whyVolunteer', e.target.value])}
        />
      </Box>

      <Box>
        <Heading as="h3" fontSize="lg" mt={4}>Additional Profile Data (JSON)</Heading>
        <Textarea
          value={profileText}
          height="sm"
          onChange={(e) => setProfileText(e.target.value)}
          {...(profileTextValid ? {} : { borderColor: 'red.600' })}
        />
      </Box>

      <Button
        mt={8}
        colorScheme="green"
        isLoading={loading}
        disabled={loading || !profileTextValid}
        onClick={async () => {
          setLoading(true);

          try {
            const result = await fetch(print(EditMentor), {
              id: mentor.id,
              givenName: mentor.givenName,
              surname: mentor.surname,
              email: mentor.email,
              profile: {...(JSON.parse(profileText) || {}), ...specialProfile},
              status: mentor.status,
              managerUsername: mentor.managerUsername || '',
              maxWeeks: mentor.maxWeeks,
            });
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
    </Box>
  );
}
