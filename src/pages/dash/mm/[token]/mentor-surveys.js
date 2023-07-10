import { Content } from "@codeday/topo/Molecule";
import Page from "../../../../components/Page";
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from "@chakra-ui/react";
import { decode } from "jsonwebtoken";
import { apiFetch } from "@codeday/topo/utils";
import { MentorSurveys } from './mentor-surveys.gql';
import { Box, Heading, Link } from "@codeday/topo/Atom";
import { DateTime } from "luxon";
import SurveyFields from "../../../../components/SurveyFields";


function getCautionColors(caution) {
  if (caution > 0.9) return { bg: 'red.500', color: 'red.50' };
  if (caution > 0.1) return { bg: 'orange.500', color: 'orange.50' };
  return {};
}

export default function MentorSurveysPage({ mentors }) {
  return (
    <Page>
      <Content>
        {mentors.map((m) => (
          <Box mb={4}>
            <Link href={`mailto:${m.email}`}>
              <Heading as="h4" fontSize="2xl">{m.name}</Heading>
            </Link>
            <Accordion>
              {m.surveyResponsesAbout
                .sort((a, b) => {
                  if (DateTime.fromISO(a.surveyOccurence.dueAt) > DateTime.fromISO(b.surveyOccurence.dueAt)) return -1;
                  if (DateTime.fromISO(a.surveyOccurence.dueAt) < DateTime.fromISO(b.surveyOccurence.dueAt)) return 1;
                  if (a.surveyOccurence.survey.personType === 'STUDENT' && b.surveyOccurence.survey.personType === 'MENTOR') return 1;
                  if (a.surveyOccurence.survey.personType === 'MENTOR' && b.surveyOccurence.survey.personType === 'STUDENT') return -1;
                })
                .map((sr) => (
                <AccordionItem>
                  <AccordionButton {...getCautionColors(sr.caution)}>
                    {DateTime.fromISO(sr.surveyOccurence.dueAt).toLocaleString()}{' - '}
                    {(sr.authorMentor || sr.authorStudent).id === m.id
                      ? 'Self-Reflection'
                      : `${(sr.authorMentor || sr.authorStudent).name} (${sr.surveyOccurence.survey.personType === 'STUDENT' ? 'student' : 'peer'})`
                    }
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel pb={4}>
                    <SurveyFields content={sr.response} />
                  </AccordionPanel>
                </AccordionItem>
              ))}
            </Accordion>
          </Box>
        ))}
      </Content>
    </Page>
  )
}


export async function getServerSideProps({ params: { token } }) {
  const { sid: username } = decode(token) || {};
  const result = await apiFetch(MentorSurveys, { username }, {
    'X-Labs-Authorization': `Bearer ${token}`,
  });

  return {
    props: {
      mentors: result?.labs?.mentors,
    },
  };
}