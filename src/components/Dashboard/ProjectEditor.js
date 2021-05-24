import { useState } from 'react';
import { print } from 'graphql';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Divider from '@codeday/topo/Atom/Divider';
import { default as Textarea } from '@codeday/topo/Atom/Input/Textarea';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import { EditProject } from './ProjectEditor.gql';

export default function ProjectEditor({ project, ...rest }) {
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState(project.description);
  const [deliverables, setDeliverables] = useState(project.deliverables);
  const fetch = useFetcher();
  const { success, error } = useToasts();

  return (
    <Box borderWidth={1} p={4} shadow="sm" rounded="sm" mb={2} {...rest}>
      <Grid templateColumns="repeat(3, 1fr)" gap={4} color="current.textLight" textAlign="center">
        <Text><Text as="span" bold>Status:</Text> {project.status}</Text>
        <Text><Text as="span" bold>Track:</Text> {project.track}</Text>
        <Text><Text as="span" bold>Max Students:</Text> {project.maxStudents}</Text>
      </Grid>

      <Heading as="h4" fontSize="lg">Description</Heading>
      <Textarea
        value={description}
        placeholder="2-3 sentence description of what your students will work on."
        onChange={(e) => setDescription(e.target.value)}
      />

      <Heading mt={4} as="h4" fontSize="lg">Deliverables</Heading>
      <Textarea
        value={deliverables}
        placeholder="~3 milestones you expect your students to meet."
        onChange={(e) => setDeliverables(e.target.value)}
      />

      <Button
        mt={4}
        onClick={async () => {
          setLoading(true);
          try {
            await fetch(print(EditProject), {
              id: project.id,
              description: description || "",
              deliverables: deliverables || ""
            });
            success('Project updated.');
          } catch (ex) {
            error(ex.toString());
          }
          setLoading(false);
        }}
        loading={loading}
        disabled={loading}
      >
        Save
      </Button>
    </Box>
  )
}
