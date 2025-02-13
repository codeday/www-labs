import { useMemo, useState } from 'react';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import { Box, Grid, Heading, List, Link, ListItem, Text, TextInput as Input, Button, Checkbox } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { DateTime } from 'luxon';
import {
  Select,
} from '@chakra-ui/react'
import Page from '../../../../components/Page';
import { PartnerStudentsAbout, PartnerStudentsAboutLimited, AssociatePartnerCodeMutation } from './index.gql';
import { useFetcher } from '../../../../dashboardFetch';
import { Match } from '../../../../components/Dashboard/Match';
import { getReflectionType } from '../../../../utils';
import ReactMarkdown from 'react-markdown';
import StatusEntryCollection from '../../../../components/Dashboard/StatusEntry/Collection';
import { StatusEntry } from '../../../../components/Dashboard/StatusEntry/StatusEntry';
import StudentList from '../../../../components/Dashboard/StatusOverview/StudentList';
import StandupRatings from '../../../../components/Dashboard/StandupRatings';
import { useRouter } from 'next/router';
import SurveyDetails from '../../../../components/Dashboard/SurveyDetails';
import { StudentCsv } from '../../../../components/Dashboard/StudentCsv';
import SurveyFields from '../../../../components/SurveyFields';

export default function PartnerPage({ students, event, partner, hidePartner }) {
  const { query } = useRouter();
  const [showAll, setShowAll] = useState(false);
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
          createdAt: s.tagTrainingSubmissions.filter((ts) => ts.tag.id === t.id)[0]?.createdAt,
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
        <Heading as="h3" fontSize="3xl" mt={-8} mb={4}>{event.name}</Heading>
        <Text>
          Application links:
          {event.hasBeginner && <Link ml={2} href={`/apply/${event.id}/beginner/${partner.partnerCode}`}>beginner</Link>}
          {event.hasIntermediate && <Link ml={2} href={`/apply/${event.id}/intermediate/${partner.partnerCode}`}>intermediate</Link>}
          {event.hasAdvanced && <Link ml={2} href={`/apply/${event.id}/advanced/${partner.partnerCode}`}>advanced</Link>}
        </Text>
        <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={8}>
          <Box>

            <Select onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Show all</option>
              <option value="peer">Show peer reflections</option>
              <option value="self">Show self-reflections</option>
              <option value="other">Show assigned reflections</option>
              <option value="notes">Show notes</option>
              <option value="meta">Show metadata</option>
            </Select>
            <Checkbox isChecked={!showAll} onChange={(e) => setShowAll(!showAll)} mb={4}>
              Only active students
            </Checkbox>

            <Heading as="h3" fontSize="md" bold>
              Students
              <StudentCsv
                pl={2}
                textColor="current.textLight"
                students={studentsWithTrainingInfo}
                onlyAccepted={!showAll}
              />
            </Heading>
            <StudentList
              students={studentsWithTrainingInfo}
              onlyAccepted={!showAll}
            />

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
              .filter((s) => showAll || s.status === 'ACCEPTED')
              .map((s) => (
                <Box mb={8}>
                  <a name={`s-${s.id}`} />
                  <Heading as="h4" fontSize="2xl">
                    {s.status !== 'ACCEPTED' && (
                      <Box
                        display="inline-block"
                        mr={2}
                        px={2}
                        py={1}
                        borderWidth={1}
                        position="relative"
                        top={-1}
                        borderRadius={2}
                        fontSize="xs"
                      >
                        {s.status}
                      </Box>
                    )}
                    {s.name}, {s.minHours}hr/wk
                  </Heading>
                  {s.projects && s.projects.length > 0 && (
                    <Text>Mentored by {s.projects.flatMap((p) => p.mentors).flatMap((m) => m.name).join(', ')}</Text>
                  )}

                  <StandupRatings
                    mb={4}
                    mt={4}
                    ratings={s.standupRatings}
                    token={query.token}
                    allowChanges={!hidePartner}
                  />

                  <StatusEntryCollection onlyType={filter}>
                    {/* Show time management plan */}
                    <StatusEntry
                      type="meta"
                      title={`Admission Agreement`}
                      caution={0}
                    >
                      <SurveyFields content={s.eventContractData || {}} />
                      <SurveyFields content={s.partnerContractData || {}} />

                      <Text textTransform="uppercase" fontSize="sm" fontWeight="bold" color="gray.600">Timezone</Text>
                      <Text>{s.timezone || 'Unknown'}</Text>
                      
                      <Text mt={4} textTransform="uppercase" fontSize="sm" fontWeight="bold" color="gray.600">Time Management Plan</Text>
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
                    {s.status === 'ACCEPTED' && (
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
                    )}

                    {/* Show onboarding assignments if project is assigned */}
                    {s.projects && s.projects.length > 0 && s.trainingSubmissions.length > 0 && (
                      <StatusEntry
                        type="meta"
                        title="Onboarding Assignments"
                        caution={1-(s.trainingSubmissions.filter((ts) => ts.submission).length / Math.min(2, s.trainingSubmissions.length))}
                      >
                            <List styleType="disc" ml={6}>
                              {s.trainingSubmissions.map((ts) => (
                                <ListItem key={ts.trainingLink}>
                                  <Link href={ts.trainingLink}>
                                    <strong>
                                      {ts.mentorDisplayName}
                                    </strong>
                                  </Link>:{' '}
                                  {ts.submission ? (
                                    <Link href={ts.submission}>
                                      {DateTime.fromISO(ts.createdAt).toLocaleString(DateTime.DATETIME_MED)}
                                    </Link>
                                  ) : <>missing</>}
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
                    {s.notes?.map?.(n => (
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
                          title={(sr.authorMentor || sr.authorStudent)?.name}
                          caution={sr.caution}
                        >
                          <SurveyDetails token={query.token} id={sr.id} />
                        </StatusEntry>
                      ))
                    }

                    {(s.artifacts.length > 0 || event.artifactTypes.length > 0) && s.projects && s.projects.length > 0 && (
                      <StatusEntry
                        type="meta"
                        caution={0}
                        title="Artifacts"
                      >
                          <List styleType="disc" ml={6}>
                            {event.artifactTypes.filter(at => at.personType !== 'MENTOR').map(at => (
                              <ListItem key={at.id}>
                                <strong>{at.name}: </strong>
                                {(() => {
                                  const artifact = s.artifacts.filter(a => a.id === at.id)[0];
                                  if (artifact) return (
                                    <Link href={a.link} target="_blank">
                                      {DateTime.fromISO(a.createdAt).toLocaleString(DateTime.DATETIME_MED)}
                                    </Link>
                                  );
                                  return <>missing</>;
                                })()}
                              </ListItem>
                            ))}
                            {s.artifacts.filter(a => !a.artifactTypeId).map(a => (
                              <ListItem key={a.id}>
                                <strong>{a.name}: </strong>
                                <Link href={a.link} target="_blank">
                                  {DateTime.fromISO(a.createdAt).toLocaleString(DateTime.DATETIME_MED)}
                                </Link>
                              </ListItem>
                            ))}
                          </List>
                      </StatusEntry>
                    )}

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
      event: result?.labs?.event,
      partner: result?.labs?.partner,
    },
  };
}

export async function getServerSidePropsLimited({ params: { token } }) {
  const result = await apiFetch(PartnerStudentsAboutLimited, {}, {
    'X-Labs-Authorization': `Bearer ${token}`,
  });

  return {
    props: {
      students: result?.labs?.students,
      event: result?.labs?.event,
      partner: result?.labs?.partner,
    },
  };
}
