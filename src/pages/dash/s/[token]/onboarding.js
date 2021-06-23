import { useState, useReducer } from 'react';
import { useRouter } from 'next/router';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Button from '@codeday/topo/Atom/Button';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
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
        variantColor="green"
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

  return (
    <Page title="Onboarding Week Assignments">
      <Content mt={-8}>
        <Link href={`/dash/s/${query?.token}`}>&laquo; Back to dashboard</Link>
        <Heading as="h2" mb={8}>Onboarding Week Assignments</Heading>
        {student.requiredTagTraining.length === 0 ? (
          <Text>You currently have no required onboarding assignments.</Text>
        ) : (
          <Box borderWidth={1} borderColor="blue.700" color="blue.900" bg="blue.50" p={4} rounded="sm" mb={8}>
            You need to complete at least {Math.min(3, student.requiredTagTraining.length)} by the end of the week.
            It's up to you how you'd like to prioritize the assignments, we recommend you choose the technologies you're
            least familiar with, or which you think are most important to your project.<br /><br />
            We'll be checking in if you haven't submitted anything by Wednesday. If you need help please drop into an
            office hours session.
          </Box>
        )}
        {student.requiredTagTraining.map((t) => (
          <Box>
            <Text d="inline-block" pr={8} fontWeight="bold" color={submitted.includes(t.id) ? 'green.700' : undefined}>
              {t.studentDisplayName}
            </Text>
            <Button as="a" mr={8} href={t.trainingLink} target="_blank">View Instructions</Button>
            {submitted.includes(t.id) ? (
              <>Submitted!</>
            ) : (
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
