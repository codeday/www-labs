
import { print } from 'graphql';
import { useState } from 'react';
import { Box, Button, Text, Heading, Spinner, HStack, Textarea, Select, Checkbox } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { useFetcher, useSwr } from '../../../../dashboardFetch';
import { CreateSupportTicketMutation, ProjectsQuery } from './problem.gql'

const issueTypes = {
  '': 'Select an issue type',
  IssueSolved: 'Someone else solved the issue already',
  IssueCantReplicate: 'No one on our team is able to replicate the problem',
  MaintainerUnsupportive: 'The maintainer doesn\'t want us to work on this issue',
  MentorUnresponsive: 'Our mentor is not responsive',
  Other: 'Other',
}

function ProblemReporter({ projectId, ...props }) {
  const { error, success } = useToasts();
  const fetch = useFetcher();

  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [consultedTa, setConsultedTa] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [preventingProgress, setPreventingProgress] = useState(false);

  const requiresTa = type === 'IssueCantReplicate';
  const requiresDescription = type === 'IssueCantReplicate' || type === 'Other';

  return (
    <Box {...props}>
      {}
      <Heading as="h5" fontSize="md">Issue Type</Heading>
      <Select value={type} onChange={(e) => setType(e.target.value)}>
        {Object.entries(issueTypes).map(([key, value]) => (
          <option value={key}>{value}</option>
        ))}
      </Select>
      <Heading as="h5" fontSize="md" mt={4}>Description</Heading>
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder={`(${requiresDescription ? 'REQUIRED' : 'Optional'}) Describe the problem...`}
      />
      {requiresTa && (
        <>
          <Checkbox
            isChecked={consultedTa}
            onChange={(e) => setConsultedTa(e.target.checked)}
          >
            I have consulted with a TA about this issue. (REQUIRED.) Please provide TA name in the description.
          </Checkbox>
          <br />
        </>
      )}
      <Checkbox
        isChecked={preventingProgress}
        onChange={(e) => setPreventingProgress(e.target.checked)}
      >
        This is preventing me from making progress.
      </Checkbox>
      <br />
      <Button
        mt={4}
        isDisabled={(requiresDescription && !description) || (requiresTa && !consultedTa) || !type}
        isLoading={isLoading}
        onClick={async () => {
          setIsLoading(true);
          try {
            await fetch(CreateSupportTicketMutation, { projectId, type, description });
            success('Thank you for reporting the problem. Expect to hear from us within 24 hours (except weekends).');
          } catch (ex) {
            error(ex.toString());
          }
          setIsLoading(false);
        }}
      >
        Save
      </Button>
    </Box>
  );
}

export default function AddPr() {
  const { isValidating, data } = useSwr(print(ProjectsQuery), {}, { revalidateOnFocus: false, revalidateOnReconnect: false });
  const [project, setProject] = useState(null);

  if (isValidating || !data?.labs?.student || data.labs.student.projects.length === 0) return (
    <Page title="Report a Problem">
      <Content textAlign="center">
        <Spinner />
      </Content>
    </Page>
  );

  const student = data.labs.student;

  return (
    <Page title="Report a Problem">
      <Content mt={-8}>
        <Heading as="h2" fontSize="3xl" mb={4}>Report a Problem</Heading>
        {student.projects.length > 1 && (
          <Select value={project} onChange={(e) => setProject(e.target.value)}>
            {student.projects.map(p => (
              <option value={p.id}>{[...p.mentors, ...p.students].map(m => m.name).join('/')}</option>
            ))}
          </Select>
        )}
        <ProblemReporter projectId={student.projects.length > 1 ? project : student.projects[0].id} />
      </Content>
    </Page>
  );
}
