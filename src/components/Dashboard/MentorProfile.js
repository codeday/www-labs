import { useState, useReducer, useEffect } from 'react';
import { print } from 'graphql';
import { useSession } from 'next-auth/client'
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import { default as Textarea } from '@codeday/topo/Atom/Input/Textarea';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/core"
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import { Heading } from '@codeday/topo/Atom/Text';
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

  const [profileText, setProfileText] = useState(JSON.stringify(mentor.profile, null, 4));
  useEffect(() => setProfileText(JSON.stringify(mentor.profile, null, 4)), [JSON.stringify(mentor.profile)]);
  const profileTextValid = isSuccess(() => JSON.parse(profileText));

  if (!mentor) return <></>;
  return (
    <Box {...rest}>
      <Heading as="h2" fontSize="5xl">{mentor.givenName} {mentor.surname}</Heading>

      <Heading as="h3" fontSize="lg" mt={4}>Status</Heading>
      <SelectMentorStatus status={mentor.status} onChange={(e) => setMentor(['status', e.target.value])} />

      <Heading as="h3" fontSize="lg" mt={4}>Name</Heading>
      <Box>
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

      <Heading as="h3" fontSize="lg" mt={4}>Email</Heading>
      <Box>
        <Box d="inline-block" mr={4}>
          <Input
            placeholder="Email"
            value={mentor.email}
            onChange={(e) => setMentor(['email', e.target.value])}
          />
        </Box>
      </Box>

      <Heading as="h3" fontSize="lg" mt={4}>Username</Heading>
      <Box>
        <Box d="inline-block" mr={4}>
          <Input
            placeholder="Username"
            value={mentor.username}
            onChange={(e) => setMentor(['username', e.target.value])}
          />
        </Box>
      </Box>

      <Heading as="h3" fontSize="lg" mt={4}>Manager Username</Heading>
      <Box>
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
          Set To Me
        </Button>
      </Box>

      <Heading as="h3" fontSize="lg" mt={4}>Max Weeks</Heading>
      <Box>
        <Box d="inline-block" mr={4}>
          <NumberInput
            value={mentor.maxWeeks}
            min={4}
            max={12}
            precision={0}
            stepSize={1}
            onChange={(e) => setMentor(['maxWeeks', e])}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </Box>
      </Box>

      <Heading as="h3" fontSize="lg" mt={4}>Profile</Heading>
      <Textarea
        value={profileText}
        height="sm"
        onChange={(e) => setProfileText(e.target.value)}
        {...(profileTextValid ? {} : { borderColor: 'red.600' })}
      />

      <Button
        mt={8}
        variantColor="green"
        isLoading={loading}
        disabled={loading || !profileTextValid}
        onClick={async () => {
          setLoading(true);

          try {
            const result = await fetch(print(EditMentor), {
              id: mentor.id,
              givenName: mentor.givenName,
              surname: mentor.surname,
              username: mentor.username,
              email: mentor.email,
              profile: JSON.parse(profileText),
              status: mentor.status,
              managerUsername: mentor.managerUsername,
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
