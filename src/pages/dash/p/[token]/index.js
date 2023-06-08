import { apiFetch } from '@codeday/topo/utils';
import { Box, Grid, Heading, List, Link, ListItem } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { DateTime } from 'luxon';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import Page from '../../../../components/Page';
import { PartnerStudentsAbout } from './index.gql';
import SurveyFields from '../../../../components/SurveyFields';

function getCautionColors(caution) {
  if (caution > 0.9) return { bg: 'red.500', color: 'red.50' };
  if (caution > 0.1) return { bg: 'orange.500', color: 'orange.50' };
  return {};
}

export default function PartnerPage({ students }) {
  return (
    <Page>
      <Content>
        <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={8}>
          <Box>
            <Heading as="h3" fontSize="md" bold>Students</Heading>
            <List>
              {students.map((s) => (
                <ListItem><Link href={`#s-${s.id}`}>{s.name}</Link></ListItem>
              ))}
            </List>
          </Box>
          <Box>
            {students.map((s) => (
              <Box mb={8}>
                <a name={`s-${s.id}`} />
                <Heading as="h4" fontSize="2xl">{s.name}</Heading>
                <Accordion allowToggle>
                  <AccordionItem>
                    <AccordionButton>
                      Time Management Plan ({s.minHours}hr/week)
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      {!s.timeManagementPlan ? 'Not collected' : (
                        <List styleType="disc" ml={6}>
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                            <ListItem>
                              <strong>{day}: </strong>
                              {s.timeManagementPlan[day.toLowerCase()].map(({start, end}) => (
                                `${Math.floor(start/60)}:${(start%60).toString().padEnd(2, '0')}`
                                + ' to '
                                + `${Math.floor(end/60)}:${(end%60).toString().padEnd(2, '0')}`
                              )).join('; ')}
                            </ListItem>
                          ))}
                        </List>
                      )}
                    </AccordionPanel>
                  </AccordionItem>
                  {s.surveyResponsesAbout
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
                        {(sr.authorMentor || sr.authorStudent).id === s.id
                          ? 'Self-Reflection'
                          : `${(sr.authorMentor || sr.authorStudent).name} (${sr.surveyOccurence.survey.personType === 'MENTOR' ? 'mentor' : 'peer'})`
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
          </Box>
        </Grid>
      </Content>
    </Page>
  )
}

export async function getServerSideProps({ params: { token } }) {
  const result = await apiFetch(PartnerStudentsAbout, {}, {
    'X-Labs-Authorization': `Bearer ${token}`,
  });

  return {
    props: {
      students: result?.labs?.students,
    },
  };
}
