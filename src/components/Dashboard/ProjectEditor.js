import { useReducer, useState } from 'react';
import { print } from 'graphql';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import { default as Textarea } from '@codeday/topo/Atom/Input/Textarea';
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/core"
import Text, { Heading } from '@codeday/topo/Atom/Text';
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import SelectTrack from './SelectTrack';
import SelectProjectStatus from './SelectProjectStatus';
import { EditProject, EditProjectLimited } from './ProjectEditor.gql';
import TagPicker from './TagPicker';
import { default as Checkbox } from '@codeday/topo/Atom/Input/Checkbox';

export default function ProjectEditor({ tags, project: originalProject, limited, ...rest }) {
  const [project, setProject] = useReducer(
    (prev, next) => Array.isArray(next) ? { ...prev, [next[0]]: next[1] } : next,
    originalProject
  );
  const [loading, setLoading] = useState(false);
  const fetch = useFetcher();
  const { success, error } = useToasts();

  return (
    <Box {...rest}>
      <Grid
        templateColumns={limited ? 'repeat(3, 1fr)' : '1fr' }
        gap={4}
        color={limited ? 'current.textLight' : undefined}
        textAlign={limited ? 'center' : undefined}
      >
        <Text>
          <Text as="span" bold>Status:</Text>
          {limited
            ? project.status
            : <SelectProjectStatus ml={2} status={project.status} onChange={(e) => setProject(['status', e.target.value])} />
          }
        </Text>
        <Text>
          <Text as="span" bold>Track:</Text>
          {limited
            ? project.track
            : <SelectTrack ml={2} track={project.track} onChange={(e) => setProject(['track', e.target.value])} />
          }
        </Text>
        <Text>
          <Text as="span" bold>Max Students:</Text>
          {limited
            ? project.maxStudents
            : (
              <Box d="inline-block" ml={2}>
                <NumberInput
                  value={project.maxStudents}
                  min={1}
                  max={12}
                  precision={0}
                  stepSize={1}
                  onChange={(e) => setProject(['maxStudents', e])}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </Box>
            )
          }
        </Text>
      </Grid>

      <Heading as="h4" fontSize="lg">Description</Heading>
      <Textarea
        value={project.description}
        placeholder="2-3 sentence description of what your students will work on."
        onChange={(e) => setProject(['description', e.target.value])}
      />

      <Heading mt={8} as="h4" fontSize="lg">Deliverables</Heading>
      <Textarea
        value={project.deliverables}
        placeholder="~3 milestones you expect your students to meet."
        onChange={(e) => setProject(['deliverables', e.target.value])}
      />

      <Heading mt={8} as="h4" fontSize="lg">Interest Tags</Heading>
      <TagPicker
        onlyType="INTEREST"
        display="mentor"
        options={tags}
        tags={project.tags}
        onChange={(e) => setProject(['tags', e])}
      />

      <Heading mt={8} as="h4" fontSize="lg">Technology Tags</Heading>
      <TagPicker
        onlyType="TECHNOLOGY"
        display="mentor"
        options={tags}
        tags={project.tags}
        onChange={(e) => setProject(['tags', e])}
      />

      {limited && ['DRAFT', 'PROPOSED'].includes(project.status) && (
        <>
          <Heading mt={8} as="h4" fontSize="lg">Ready?</Heading>
          <Checkbox
            isChecked={project.status !== 'DRAFT'}
            onClick={() => setProject(['status', project.status === 'PROPOSED' ? 'DRAFT' : 'PROPOSED'])}
          >
            My project proposal is ready for matching.
          </Checkbox>
        </>
      )}

      <Box mt={4}>
        <Button
          d="inline-block"
          variantColor="green"
          onClick={async () => {
            setLoading(true);
            try {
              const result = await fetch(print(limited ? EditProjectLimited : EditProject), {
                id: project.id,
                description: project.description || "",
                deliverables: project.deliverables || "",
                tags: (project.tags || []).map(({ id }) => id),
                ...(limited ? {} : {
                  status: project.status,
                  track: project.track,
                  maxStudents: project.maxStudents,
                })
              });
              setProject(result.labs.editProject);
              success('Project updated.');
            } catch (ex) {
              error(ex.toString());
            }
            setLoading(false);
          }}
          isLoading={loading}
          disabled={loading}
        >
          Save Project
        </Button>
      </Box>
    </Box>
  )
}
