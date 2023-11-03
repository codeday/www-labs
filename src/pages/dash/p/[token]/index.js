import { useMemo, useState } from 'react';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import { Box, Grid, Heading, List, Link, ListItem, Text, TextInput as Input, Button } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { DateTime } from 'luxon';
import {
  Select,
} from '@chakra-ui/react'
import Page from '../../../../components/Page';
import { PartnerStudentsAbout, AssociatePartnerCodeMutation } from './index.gql';
import SurveyFields from '../../../../components/SurveyFields';
import { useFetcher } from '../../../../dashboardFetch';
import { Match } from '../../../../components/Dashboard/Match';
import { getReflectionType } from '../../../../utils';
import ReactMarkdown from 'react-markdown';
import StatusEntryCollection from '../../../../components/Dashboard/StatusEntry/Collection';
import { StatusEntry } from '../../../../components/Dashboard/StatusEntry/StatusEntry';
import StudentList from '../../../../components/Dashboard/StatusOverview/StudentList';
import StandupRatings from '../../../../components/Dashboard/StandupRatings';
import { useRouter } from 'next/router';

export default function PartnerPage({ students, hidePartner }) {
  const { query } = useRouter();
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentUsername, setNewStudentUsername] = useState('');
  const [filter, setFilter] = useState('all');
  const fetch = useFetcher();
  const { success, error } = useToasts();

  const studentsWithTrainingInfo = useMemo(() => students
    .filter((s) => s.status !== 'CANCELED')
    .sort((a, b) => {
      const mentorA = a.projects?.[0]?.mentors?.[0]?.name || '';
      const mentorB = b.projects?.[0]?.mentors?.[0]?.name || '';
      return mentorA.localeCompare(mentorB);
    })
    .map((s) => {
      const trainingSubmissions = (s.projects || []).flatMap((p) => p.tags)
        .filter((t) => t.trainingLink)
        .map((t) => ({
          submission: s.tagTrainingSubmissions.filter((ts) => ts.tag.id === t.id)[0]?.url,
          ...t,
        }));
      return {
        ...s,
        trainingSubmissions,
      };
    }), [students]);

  return (
    <Page>
      <Content>
        <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={8}>
          <Box>

            <Select onChange={(e) => setFilter(e.target.value)} mb={4}>
              <option value="all">Show all</option>
              <option value="peer">Show peer reflections</option>
              <option value="self">Show self-reflections</option>
              <option value="other">Show assigned reflections</option>
              <option value="notes">Show notes</option>
              <option value="meta">Show metadata</option>
            </Select>

            <Heading as="h3" fontSize="md" bold>Students</Heading>
            <StudentList students={studentsWithTrainingInfo} />

            {!hidePartner && (
              <Box mt={8}>
                <Heading as="h4" fontSize="md">Associate Student</Heading>
                <Text fontSize="sm" fontWeight="bold">Email</Text>
                <Input
                  onChange={(e) => setNewStudentEmail(e.target.value)}
                  value={newStudentEmail}
                />
                <Text fontSize="sm" fontWeight="bold">or CodeDay Username</Text>
                <Input
                  onChange={(e) => setNewStudentUsername(e.target.value)}
                  value={newStudentUsername}
                />
                <Button
                  onClick={async () => {
                    try {
                      const result = await fetch(
                        AssociatePartnerCodeMutation,
                        {
                          where: {
                            username: newStudentUsername || undefined,
                            email: newStudentEmail || undefined,
                          },
                        },
                      );
                      if (result.labs.associatePartnerCode.id) {
                        success(`Associated ${result.labs.associatePartnerCode.givenName} ${result.labs.associatePartnerCode.surname}.`);
                        setNewStudentEmail('');
                        setNewStudentUsername('');
                      } else throw new Error();
                    } catch (ex) {
                      console.error(ex);
                      error('Student not found.');
                    }
                  }}
                >
                  Associate
                </Button>
              </Box>
          )}
          </Box>
          <Box>

            {studentsWithTrainingInfo
              .map((s) => (
                <Box mb={8}>
                  <a name={`s-${s.id}`} />
                  <Heading as="h4" fontSize="2xl">{s.name} {s.status !== 'ACCEPTED' && `(Status: ${s.status})`}</Heading>
                  <Text>Mentored by {s.projects.flatMap((p) => p.mentors).flatMap((m) => m.name).join(', ')}</Text>

                  <StandupRatings
                    mb={4}
                    mt={4}
                    ratings={s.standupRatings}
                    token={query.token}
                  />

                  <StatusEntryCollection onlyType={filter}>
                    {/* Show time management plan */}
                    <StatusEntry
                      type="meta"
                      title={`Time Management Plan (${s.minHours}hr/wk)`}
                      caution={0}
                    >
                      <Text><strong>Timezone: </strong>{s.timezone || 'Unknown'}</Text>
                      {!s.timeManagementPlan ? 'Not collected' : (
                        <List styleType="disc" ml={6}>
                          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                            <ListItem key={day}>
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
                    </StatusEntry>

                    {/* Show project details or preference submission */}
                    <StatusEntry
                      title="Project"
                      type="meta"
                      caution={(s.hasProjectPreferences || s.skipPreferences || (s.projects && s.projects.length > 0)) ? 0 : 1}
                    >
                      {s.projects && s.projects.length > 0 ? (
                        s.projects.map((p) => (
                          <Match match={p} key={p.id} />
                        ))
                      ) : (
                        <>
                          <Text>Preferences Submitted: {s.hasProjectPreferences ? 'yes' : 'no'}</Text>
                          <Text>Matched: no</Text>
                        </>
                      )}
                    </StatusEntry>

                    {/* Show onboarding assignments if project is assigned */}
                    {s.projects && s.projects.length > 0 && s.trainingSubmissions.length > 0 && (
                      <StatusEntry
                        type="meta"
                        title="Onboarding Assignments"
                        caution={1-(s.trainingSubmissions.filter((ts) => ts.submission).length / Math.min(3, s.trainingSubmissions.length))}
                      >
                            <List styleType="disc" ml={6}>
                              {s.trainingSubmissions.map((ts) => (
                                <ListItem key={ts.trainingLink}>
                                  <Link href={ts.trainingLink}>
                                    {ts.mentorDisplayName}
                                  </Link>:{' '}
                                  {ts.submission ? (
                                    <Link href={ts.submission}>Submitted</Link>
                                  ) : <>Missing</>}
                                </ListItem>
                              ))}
                            </List>
                      </StatusEntry>
                    )}

                    {s.projects && s.projects.length > 0 && (
                      <StatusEntry
                        type="meta"
                        title="Communication"
                        caution={(s.emailCount > 0 && s.slackId) ? 0 : 1}
                      >
                        <List styleType="disc" ml={6}>
                          <ListItem>
                            {s.slackId ? 'Has' : 'Has NOT'} joined Slack.
                          </ListItem>
                          <ListItem>
                            {s.emailCount > 0 ? 'Has' : 'Has NOT'} replied-all to introduction email.
                          </ListItem>
                        </List>
                      </StatusEntry>
                    )}

                    {/* Show any staff notes */}
                    {s.notes.map(n => (
                      <StatusEntry
                        key={n.id}
                        type="staff"
                        date={DateTime.fromISO(n.createdAt)}
                        caution={n.caution}
                        title={<>
                        {n.username}<Box display={{ base: 'none', md: 'inline-block' }}>@codeday.org</Box>
                        </>}
                      >
                        <Box pl={4} ml={4} borderLeftWidth={2}>
                          <ReactMarkdown className="markdown">{n.note}</ReactMarkdown>
                        </Box>
                      </StatusEntry>
                    ))}

                    {/* Show any survey feedback */}
                    {s.surveyResponsesAbout
                      .sort((a, b) => {
                        if (a.surveyOccurence.survey.personType === 'STUDENT' && b.surveyOccurence.survey.personType === 'MENTOR') return 1;
                        if (a.surveyOccurence.survey.personType === 'MENTOR' && b.surveyOccurence.survey.personType === 'STUDENT') return -1;
                      })
                      .map(sr => (
                        <StatusEntry
                          key={sr.id}
                          type={getReflectionType(sr, s)}
                          date={DateTime.fromISO(sr.surveyOccurence.dueAt)}
                          title={(sr.authorMentor || sr.authorStudent).name}
                          caution={sr.caution}
                        >
                          <SurveyFields
                            content={sr.response}
                            displayFn={sr.surveyOccurence.survey[`${getReflectionType(sr, s)}Display`]}
                          />
                        </StatusEntry>
                      ))
                    }

                  </StatusEntryCollection>
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
