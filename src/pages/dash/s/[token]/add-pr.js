
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { DateTime } from 'luxon';
import { Box, Button, Text, Heading, Spinner, TextInput as Input, HStack } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import SignatureCanvas from 'react-signature-canvas';
import TimezoneSelect from '../../../../components/TimezoneSelect';
import TimeManagementPlan from '../../../../components/TimeManagementPlan';
import Page from '../../../../components/Page';
import ConfirmAll from '../../../../components/ConfirmAll';
import { useFetcher, useSwr } from '../../../../dashboardFetch';
import { AddProjectPr, PrUrlStatus } from './add-pr.gql'

function ProjectPr({ hasMultipleProjects, project, ...props }) {
  const { error, success } = useToasts();
  const fetch = useFetcher();
  const [url, setUrl] = useState(project.prUrl || '');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box {...props}>
      {hasMultipleProjects && (
        <>
          <Text>Your project with {project.mentors.map(m => m.name).join('/')} with the description:</Text>
          <Text mb={2} ml={2} pl={2} borderLeftWidth={2}>{project.description}</Text>
        </>
      )}
      <HStack>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://github.com/..." />
        <Button
          isLoading={isLoading}
          onClick={async () => {
            setIsLoading(true);
            try {
              await fetch(AddProjectPr, { project: project.id, prUrl: url });
              success('Saved! Thanks for sharing your PR link.');
            } catch (ex) {
              error(ex.toString());
            }
            setIsLoading(false);
          }}
        >
          Save
        </Button>
      </HStack>
    </Box>
  );
}

export default function AddPr() {
  const { isValidating, data } = useSwr(print(PrUrlStatus), {}, { revalidateOnFocus: false, revalidateOnReconnect: false });
  const { query } = useRouter();

  if (isValidating || !data?.labs?.student) return (
    <Page title="Add PR">
      <Content textAlign="center">
        <Spinner />
      </Content>
    </Page>
  );

  const student = data.labs.student;

  return (
    <Page title="Add PR">
      <Content mt={-8} display={{ base: 'none', sm: 'block' }}>
        <Heading as="h2" fontSize="3xl" mb={4}>Add PR</Heading>
        {student.projects.map(p => (
          <ProjectPr project={p} hasMultipleProjects={student.projects.length > 1 || true} mb={2} />
        ))}
      </Content>
    </Page>
  );
}
