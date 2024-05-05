
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Box, Button, Text, Heading, Spinner, TextInput as Input, HStack } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { useFetcher, useSwr } from '../../../../dashboardFetch';
import { AddProjectPr, PrUrlStatus } from './add-pr.gql'

const nl2br = (str) => str && str
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/(https?:\/\/[^\s\(\)]+)/g, (url) => `<a href="${url}" style="text-decoration: underline" target="_blank">${url}</a>`)
  .replace(/\n/g, '<br />');

function ProjectPr({ hasMultipleProjects, project, ...props }) {
  const { error, success } = useToasts();
  const fetch = useFetcher();
  const [url, setUrl] = useState(project.prUrl || '');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box {...props}>
      {hasMultipleProjects && (
        <>
          <Text>PR for your project with {project.mentors.map(m => m.name).join('/')} with the description:</Text>
          <Text mb={4} ml={2} pl={2} fontSize="sm" borderLeftWidth={2}>
            <div dangerouslySetInnerHTML={{ __html: nl2br(project.description) }} />
          </Text>
        </>
      )}
      <HStack>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Pull Request link, e.g. https://github.com/..." />
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
      <Text fontSize="sm">(If you created something new, provide the open-source repository link instead of a pull request link.)</Text>
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
      <Content mt={-8}>
        <Heading as="h2" fontSize="3xl" mb={4}>Add PR (Pull Request)</Heading>
        {student.projects.map(p => (
          <ProjectPr project={p} hasMultipleProjects={student.projects.length > 1 || true} mb={2} />
        ))}
      </Content>
    </Page>
  );
}
