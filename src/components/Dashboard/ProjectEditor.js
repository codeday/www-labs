import { useReducer, useState } from 'react';
import { print } from 'graphql';
import {
  Box,
  Grid,
  Button,
  Textarea,
  Text,
  Heading,
  Link,
  List,
  TextInput as Input,
  ListItem as Item,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
} from "@codeday/topo/Atom"
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import SelectTrack from './SelectTrack';
import SelectProjectStatus from './SelectProjectStatus';
import { EditProject, CreateProject } from './ProjectEditor.gql';
import TagPicker from './TagPicker';

export default function ProjectEditor({ tags, project: originalProject, limited, repositories, hideStatus, ...rest }) {
  const [project, setProject] = useReducer(
    (prev, next) => Array.isArray(next) ? { ...prev, [next[0]]: next[1] } : next,
    originalProject
  );
  const [loading, setLoading] = useState(false);
  const fetch = useFetcher();
  const { success, error } = useToasts();

  const tagInfo = (project.tags || []).map((t) => tags.filter((tInfo) => tInfo.id === t.id)[0]);

  const save = (data) => async () => {
    setLoading(true);
    try {
      const { affinePartner: _, ...postData } = data;
      const query = project.id ? EditProject : CreateProject;
      const result = await fetch(print(query), {
        id: project.id,
        data: {
          description: project.description || "",
          deliverables: project.deliverables || "",
          issueUrl: project.issueUrl || null,
          repositoryId: repositories ? (project.repositoryId || null) : undefined,
          tags: (project.tags || []).map(({ id }) => id),
          ...(limited ? {} : {
            status: project.status,
            track: project.track,
            maxStudents: project.maxStudents,
          }),
          ...postData,
        }
      });
      success(`Project ${project.id ? 'updated' : 'created'}.`);
      setProject(result.labs.editProject || { tags: [], maxStudents: 4 });
    } catch (ex) {
      error(ex.message);
    }
    setLoading(false);
  };

  return (
    <Box {...rest}>
      <Grid
        templateColumns={limited ? 'repeat(3, 1fr)' : '1fr' }
        gap={4}
        color={limited ? 'current.textLight' : undefined}
        textAlign={limited ? 'center' : undefined}
        mb={4}
      >
        {!hideStatus && (
          <Text>
            <Text as="span" bold>Status: </Text>
            {limited
              ? project.status
              : <SelectProjectStatus ml={2} status={project.status} onChange={(e) => setProject(['status', e.target.value])} />
            }
          </Text>
        )}

        <Text>
          <Text as="span" bold>Track: </Text>
          {limited
            ? project.track
            : <SelectTrack ml={2} track={project.track} onChange={(e) => setProject(['track', e.target.value])} />
          }
        </Text>
        <Text>
          <Text as="span" bold>Max Students: </Text>
          {limited
            ? project.maxStudents
            : (
              <Box display="inline-block" ml={2}>
                <NumberInput
                  defaultValue={project.maxStudents}
                  onChange={(e) => setProject(['maxStudents', Number.parseInt(e)])}
                  min={1}
                  max={12}
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
            )
          }
        </Text>
      </Grid>

      {project.affinePartner?.partnerCode && (
        <Text mb={8}>
          <Text as="span" bold>Only For Partner: </Text>
          {project.affinePartner.partnerCode}
        </Text>
      )}

      <Heading as="h4" fontSize="lg">Description</Heading>
      <Textarea
        value={project.description}
        placeholder="2-3 sentence description of what your students will work on."
        onChange={(e) => setProject(['description', e.target.value])}
        height={48}
        disabled={project.status === 'MATCHED' && limited}
      />

      <Heading mt={8} as="h4" fontSize="lg">Deliverables</Heading>
      <Textarea
        value={project.deliverables}
        placeholder="~3 milestones you expect your students to meet."
        onChange={(e) => setProject(['deliverables', e.target.value])}
        height={32}
        disabled={project.status === 'MATCHED' && limited}
      />

      <Heading as="h4" fontSize="lg" mt={8}>Issue URL</Heading>
      <Input
        value={project.issueUrl}
        placeholder="Issue link (Github etc) if this is an issue in an existing project."
        onChange={(e) => setProject(['issueUrl', e.target.value])}
        disabled={project.status === 'MATCHED' && limited}
      />

      {repositories && (
        <>
          <Heading as="h4" fontSize="lg" mt={8}>Repository</Heading>
          <Select
            value={project.repositoryId}
            onChange={(e) => setProject(['repositoryId', e.target.value])}
            disabled={project.status === 'MATCHED' && limited}
          >
            <option value=""></option>
            {repositories.map(r => (
              <option value={r.id}>{r.name}</option>
            ))}
          </Select>
        </>
      )}

      <Heading mt={8} as="h4" fontSize="lg">Interest Tags</Heading>
      <TagPicker
        onlyType="INTEREST"
        display="mentor"
        options={tags}
        tags={project.tags}
        onChange={(e) => setProject(['tags', e])}
        disabled={project.status === 'MATCHED' && limited}
      />

      <Heading mt={8} as="h4" fontSize="lg">Technology Tags</Heading>
      <TagPicker
        onlyType="TECHNOLOGY"
        display="mentor"
        options={tags}
        tags={project.tags}
        onChange={(e) => setProject(['tags', e])}
        disabled={project.status === 'MATCHED' && limited}
      />

      {!(project.status === 'MATCHED' && limited) && (
        <Box mt={4}>
          <Button
            display="inline-block"
            onClick={save(limited ? { status: 'DRAFT' } : {})}
            isLoading={loading}
            disabled={loading}
          >
            { limited ? 'Save Draft' : 'Save' }
          </Button>

          {limited && ['DRAFT', 'PROPOSED'].includes(project.status) && (
            <Box display="inline-block" ml={4} pl={4} borderLeftWidth={1}>
              <Button
                display="inline-block"
                colorScheme="green"
                onClick={save({ status: 'PROPOSED' })}
                isLoading={loading}
                disabled={loading}
              >
                Save &amp; Submit
              </Button>
            </Box>
          )}
        </Box>
      )}
      {tagInfo.filter((t) => !!t.trainingLink).length > 0 && (
        <Box>
          <Heading as="h3" fontSize="xl" mt={8} mb={4}>Onboarding Week</Heading>
          <Text>
            Based on your tech stack, we'll ask your students to complete the following assignments during onboarding week,
            which is the week before you start mentoring. (In addition to some basics like Git.)
          </Text>
          <Text>
            You're welcome to ask your team to do something different if you'd prefer.
          </Text>
          <List styleType="disc">
            {tagInfo.filter((t) => !!t.trainingLink).map((t) => (
              <Item>
                <Link href={t.trainingLink}>{t.mentorDisplayName}</Link>
              </Item>
            ))}
          </List>
        </Box>
      )}
      {project.status === 'MATCHED' && (
        <Box>
          <Heading as="h3" fontSize="xl" mt={8} mb={4}>Students</Heading>
          <List styleType="disc" stylePos="outside" ml={2}>
            {project.students.map((s) => (
              <Item mb={4}>
                <Link href={`mailto:${s.email}`} fontWeight="bold">{s.name}</Link><br />
                completed onboarding:{' '}
                {s.tagTrainingSubmissions.length === 0 ? 'none' : s.tagTrainingSubmissions.map((train, i) => (
                  <>
                    <Link href={train.url} target="_blank">{train.tag.mentorDisplayName}</Link>
                    {i + 1 === s.tagTrainingSubmissions.length ? '' : ', '}
                  </>
                ))}
              </Item>
            ))}
          </List>
        </Box>
      )}
    </Box>
  )
}
