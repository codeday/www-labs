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
  Badge,
} from '@chakra-ui/react';
import { DateTime } from 'luxon';
import Page from '../../../../../components/Page';
import SurveyDetails from '../../../../../components/Dashboard/SurveyDetails';
import { GetSurveyQuery } from './[id].gql';

function getCautionColors(caution) {
  if (caution > 0.9) return { bg: 'red.500', color: 'red.50' };
  if (caution > 0.1) return { bg: 'orange.500', color: 'orange.50' };
  return {};
}

function responseLabel(sr) {
  const author = sr.authorMentor || sr.authorStudent;
  const target = sr.student || sr.mentor;
  if (!author) return 'Unknown';
  if (target && target.id === author.id) return `${author.name} (Self-Reflection)`;
  if (target) return `${author.name} on ${target.name}`;
  return author.name;
}

export default function AdminSurveyDetail({ survey }) {
  const { query } = useRouter();

  if (!survey) {
    return (
      <Page title="Survey">
        <Content mt={-8}>
          <Button as="a" href={`/dash/a/${query.token}/surveys`}>&laquo; Back</Button>
          <Text mt={4}>Survey not found.</Text>
        </Content>
      </Page>
    );
  }

  return (
    <Page title={survey.name}>
      <Content mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}/surveys`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mb={8} mt={4}>
          {survey.name}
          <Badge ml={3} verticalAlign="middle" fontSize="lg">{survey.personType}</Badge>
        </Heading>

        {survey.occurrences.length === 0 && <Text color="gray.500">No occurrences yet.</Text>}

        <Accordion allowMultiple>
          {[...survey.occurrences]
            .sort((a, b) => DateTime.fromISO(b.dueAt) - DateTime.fromISO(a.dueAt))
            .map((occ) => (
              <AccordionItem key={occ.id}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    Sent {DateTime.fromISO(occ.visibleAt).toLocaleString(DateTime.DATETIME_MED)}
                    {' — '}
                    Due {DateTime.fromISO(occ.dueAt).toLocaleString(DateTime.DATETIME_MED)}
                    {' — '}
                    {occ.surveyResponses.length} response{occ.surveyResponses.length === 1 ? '' : 's'}
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  {occ.surveyResponses.length === 0 ? (
                    <Text color="gray.500">No responses yet.</Text>
                  ) : (
                    <Accordion allowMultiple>
                      {occ.surveyResponses.map((sr) => (
                        <AccordionItem key={sr.id}>
                          <AccordionButton {...getCautionColors(sr.caution)}>
                            <Box flex="1" textAlign="left">{responseLabel(sr)}</Box>
                            <AccordionIcon />
                          </AccordionButton>
                          <AccordionPanel pb={4}>
                            <SurveyDetails token={query.token} id={sr.id} />
                          </AccordionPanel>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  )}
                </AccordionPanel>
              </AccordionItem>
            ))}
        </Accordion>
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ params: { token, id } }) {
  const res = await apiFetch(GetSurveyQuery, { id }, { 'X-Labs-Authorization': `Bearer ${token}` });
  return {
    props: {
      survey: res.labs.survey || null,
    },
  };
}
