import { useState, useReducer } from 'react';
import { useRouter } from 'next/router';
import { Box, Grid, Button, TextInput as Input, Text, Heading, Link } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { OnboardingInfo, SubmitOnboardingAssignment } from './onboarding.gql';

function AssignmentSubmit({ tag, onSubmitted }) {
  const { query } = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToasts();

  if (!isOpen) return (
    <Button onClick={() => setIsOpen(true)}>Submit Assignment</Button>
  );

  return (
    <>
      <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Github/Repl.it/Codepen Link" />
      <Button
        onClick={async () => {
          setIsLoading(true);
          try {
            await apiFetch(SubmitOnboardingAssignment, { tag, url }, {
              'X-Labs-Authorization': `Bearer ${query.token}`,
            });
            onSubmitted(tag, url);
            success('Submitted!');
          } catch(ex) {
            error(ex.toString());
          }
          setIsLoading(false);
        }}
        isLoading={isLoading}
        disabled={isLoading || !url}
        colorScheme="green"
      >
        Submit
      </Button>
    </>
  )
}

export default function Onboarding({ student }) {
  const { query } = useRouter();
  const [submitted, addSubmitted] = useReducer(
    (prev, add) => [...prev, add],
    student.tagTrainingSubmissions.map((t) => t.tag.id),
  );
  const requiredTrainingCount = Math.min(3, student.requiredTagTraining.length);
  const trainingOptions = student.requiredTagTraining.filter((t) => t.id !== 'git');
  const completedTrainingCount = trainingOptions.filter((t) => submitted.includes(t.id)).length;

  return (
    <Page title="Onboarding Week Assignments">
      <Content mt={-8}>
        <Link href={`/dash/s/${query?.token}`}>&laquo; Back to dashboard</Link>
        <Heading as="h2" mb={8}>Onboarding Week Assignments</Heading>
        {student.requiredTagTraining.length === 0 ? (
          <Text>You currently have no required onboarding assignments.</Text>
        ) : (
          <Box borderWidth={1} borderColor="blue.700" color="blue.900" bg="blue.50" p={4} rounded="sm" mb={8}>
            You need to complete the Git and IDE onboarding, plus at least
            {requiredTrainingCount} other{requiredTrainingCount !== 1 ? 's' : ''} by the end of the week.<br /><br />
            Please spend at least 20 hours this week on onboarding, in order to prepare yourself for your project. Some
            assignments are shorter, so you may need to do more than 3.<br /><br />
            Please do not choose assignments for technologies you are already very familiar with. Beyond that, it's up
            to you how you'd like to prioritize the assignments, but we recommend you choose the technologies you're
            least familiar with, or which you think are most important to your project.<br /><br />
            We'll be checking in if you haven't submitted anything by Wednesday. If you need help please drop into an
            office hours session using Slack.<br /><br />
            <Text as="span" bold>
              You've completed {completedTrainingCount}/{requiredTrainingCount} project-specific training modules.
            </Text>
          </Box>
        )}
        <Box mb={8}>
          <Text d="block" pr={8} fontWeight="bold">
            REQUIRED: Setting up your development environment
          </Text>
          <Button
            as="a"
            mr={8}
            href="https://www.notion.so/srnd/Setting-Up-Your-Development-Environment-5c51d2e381c2425b890a2a976365389b"
            target="_blank"
          >
            View Instructions
          </Button>
        </Box>
        <Box mb={8}>
          <Text d="block" pr={8} fontWeight="bold" color={submitted.includes('git') ? 'green.700' : undefined}>
            REQUIRED: Git
          </Text>
          <Button
            as="a"
            mr={8}
            href="https://www.notion.so/srnd/Git-5ec26af2b3c34129a061c1f26f3cd6f0"
            target="_blank"
          >
            View Instructions
          </Button>
          {!submitted.includes('git') && (
            <AssignmentSubmit tag="git" onSubmitted={() => addSubmitted('git')} />
          )}
        </Box>
        {trainingOptions.map((t) => (
          <Box mb={8}>
            <Text d="block" pr={8} fontWeight="bold" color={submitted.includes(t.id) ? 'green.700' : undefined}>
              Project-Specific: {t.studentDisplayName}
            </Text>
            <Button as="a" mr={8} href={t.trainingLink} target="_blank">View Instructions</Button>
            {!submitted.includes(t.id) && (
              <AssignmentSubmit tag={t.id} onSubmitted={() => addSubmitted(t.id)} />
            )}
          </Box>
        ))}
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ params: { token } }) {
  const result = await apiFetch(OnboardingInfo, {}, {
    'X-Labs-Authorization': `Bearer ${token}`,
  });

  if (!result?.labs?.student || result.labs.student.status !== 'ACCEPTED') throw Error('Not accepted to CodeDay Labs.');

  return {
    props: {
      student: result?.labs?.student || {},
    },
  };
}
