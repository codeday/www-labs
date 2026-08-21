import { useRouter } from 'next/router';
import { apiFetch } from '@codeday/topo/utils';
import { Content } from '@codeday/topo/Molecule';
import { Box, Button, Heading, Text } from '@codeday/topo/Atom';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import Page from '../../../../components/Page';
import RsjForm from '../../../../components/RsjForm';
import { GetSurveysQuery } from './surveys.gql';

const SCHEMA_SECTIONS = [
  { key: 'self', title: 'Self-Reflection' },
  { key: 'peer', title: 'Peer Reflection (about a teammate)' },
  { key: 'mentee', title: 'Mentee Reflection (mentor about a student)' },
  { key: 'mentor', title: 'Mentor Reflection (student about a mentor)' },
  { key: 'project', title: 'Project Reflection' },
];

function fillNameTemplate(schema) {
  return JSON.parse(JSON.stringify(schema || {}).replace(/{{name}}/g, 'this person'));
}

function hasSchema(schema) {
  return schema && Object.keys(schema).length > 0;
}

function getRelevantOccurrence(occurrences) {
  if (!occurrences || occurrences.length === 0) return null;
  const now = DateTime.now();
  const sorted = [...occurrences].sort((a, b) => DateTime.fromISO(a.dueAt) - DateTime.fromISO(b.dueAt));
  const next = sorted.find((occ) => DateTime.fromISO(occ.dueAt) >= now);
  if (next) return { occurrence: next, label: 'Next' };
  return { occurrence: sorted[sorted.length - 1], label: 'Last' };
}

const PERSON_TYPE_ORDER = ['STUDENT', 'MENTOR'];

function personTypeLabel(personType) {
  return `${personType.charAt(0)}${personType.slice(1).toLowerCase()} Surveys`;
}

function groupByPersonType(surveys) {
  const groups = new Map();
  surveys.forEach((survey) => {
    if (!groups.has(survey.personType)) groups.set(survey.personType, []);
    groups.get(survey.personType).push(survey);
  });
  return [...groups.entries()].sort(([a], [b]) => {
    const ai = PERSON_TYPE_ORDER.indexOf(a);
    const bi = PERSON_TYPE_ORDER.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function SurveyCard({ survey, token }) {
  const relevant = getRelevantOccurrence(survey.occurrences);
  return (
    <Box mb={10}>
      <Heading as="h4" fontSize="xl" mb={3}>{survey.name}</Heading>

      <Accordion allowMultiple mb={4}>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">Preview Questions</Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {SCHEMA_SECTIONS.every(({ key }) => !hasSchema(survey[`${key}Schema`])) && (
              <Text color="gray.500">No questions configured.</Text>
            )}
            {SCHEMA_SECTIONS.filter(({ key }) => hasSchema(survey[`${key}Schema`])).map(({ key, title }) => (
              <Box key={key} mb={6} bgColor={"bg"}>
                <Heading as="h5" fontSize="lg" mb={2}>{title}</Heading>
                <RsjForm
                  schema={fillNameTemplate(survey[`${key}Schema`])}
                  uiSchema={fillNameTemplate(survey[`${key}Ui`])}
                  formData={{}}
                  onChange={() => {}}
                  children={true}
                />
              </Box>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {relevant ? (
        <Text mb={2}>
          {relevant.label} occurrence — Sent {DateTime.fromISO(relevant.occurrence.visibleAt).toLocaleString(DateTime.DATETIME_MED)}
          {' — '}
          Due {DateTime.fromISO(relevant.occurrence.dueAt).toLocaleString(DateTime.DATETIME_MED)}
        </Text>
      ) : (
        <Text mb={2} color="gray.500">No occurrences yet.</Text>
      )}

      <Button as="a" href={`/dash/a/${token}/surveys/${survey.id}`}>
        View all occurrences &amp; responses ({survey.occurrences.length}) &raquo;
      </Button>
    </Box>
  );
}

export default function AdminSurveys({ surveys }) {
  const { query } = useRouter();

  return (
    <Page title="Surveys">
      <Content mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mb={8} mt={4}>Surveys</Heading>

        {surveys.length === 0 && <Text>No surveys are configured for this session.</Text>}

        {groupByPersonType(surveys).map(([personType, group]) => (
          <Box key={personType} mb={12}>
            <Heading as="h3" fontSize="2xl" mb={4} pb={2} borderBottomWidth={2}>
              {personTypeLabel(personType)}
            </Heading>
            {group.map((survey) => (
              <SurveyCard key={survey.id} survey={survey} token={query.token} />
            ))}
          </Box>
        ))}
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ params: { token } }) {
  const res = await apiFetch(GetSurveysQuery, {}, { 'X-Labs-Authorization': `Bearer ${token}` });
  return {
    props: {
      surveys: res.labs.surveys,
    },
  };
}
