import { Box, Heading, Link, List, ListItem, Text } from '@codeday/topo/Atom';
import { DateTime } from 'luxon';
import ReactMarkdown from 'react-markdown';
import StatusEntryCollection from './StatusEntry/Collection';
import { StatusEntry } from './StatusEntry/StatusEntry';
import StandupRatings from './StandupRatings';
import { Match } from './Match';
import SurveyDetails from './SurveyDetails';
import SurveyFields from '../SurveyFields';
import { getReflectionType } from '../../utils';
import { DAYS, formatTimeManagementPlanDay } from './formatTimeManagementPlan';

function StatusTag({ status }) {
  return (
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
      {status}
    </Box>
  );
}

function AdmissionAgreementEntry({ student }) {
  return (
    <StatusEntry type="meta" title="Admission Agreement" caution={0}>
      <SurveyFields content={student.eventContractData || {}} />
      <SurveyFields content={student.partnerContractData || {}} />

      <Text textTransform="uppercase" fontSize="sm" fontWeight="bold" color="gray.600">Timezone</Text>
      <Text>{student.timezone || 'Unknown'}</Text>

      <Text mt={4} textTransform="uppercase" fontSize="sm" fontWeight="bold" color="gray.600">Time Management Plan</Text>
      {!student.timeManagementPlan ? 'Not collected' : (
        <List styleType="disc" ml={6}>
          {DAYS.map((day) => (
            <ListItem key={day}>
              <strong>{day}: </strong>
              {formatTimeManagementPlanDay(student.timeManagementPlan, day)}
            </ListItem>
          ))}
        </List>
      )}
    </StatusEntry>
  );
}

function ProjectEntry({ student }) {
  if (student.status !== 'ACCEPTED') return null;
  const hasProjects = student.projects && student.projects.length > 0;
  const caution = (student.hasProjectPreferences || student.skipPreferences || hasProjects) ? 0 : 1;
  return (
    <StatusEntry title="Project" type="meta" caution={caution}>
      {hasProjects ? (
        student.projects.map((p) => <Match match={p} key={p.id} />)
      ) : (
        <>
          <Text>Preferences Submitted: {student.hasProjectPreferences ? 'yes' : 'no'}</Text>
          <Text>Matched: no</Text>
        </>
      )}
    </StatusEntry>
  );
}

function OnboardingAssignmentsEntry({ student }) {
  if (!(student.projects && student.projects.length > 0 && student.trainingSubmissions.length > 0)) return null;
  const submittedCount = student.trainingSubmissions.filter((ts) => ts.submission).length;
  const caution = 1 - (submittedCount / Math.min(2, student.trainingSubmissions.length));
  return (
    <StatusEntry type="meta" title="Onboarding Assignments" caution={caution}>
      <List styleType="disc" ml={6}>
        {student.trainingSubmissions.map((ts) => (
          <ListItem key={ts.trainingLink}>
            <Link href={ts.trainingLink}><strong>{ts.mentorDisplayName}</strong></Link>:{' '}
            {ts.submission ? (
              <Link href={ts.submission}>
                {DateTime.fromISO(ts.createdAt).toLocaleString(DateTime.DATETIME_MED)}
              </Link>
            ) : <>missing</>}
          </ListItem>
        ))}
      </List>
    </StatusEntry>
  );
}

function CommunicationEntry({ student }) {
  if (!(student.projects && student.projects.length > 0)) return null;
  const caution = (student.emailCount > 0 && student.slackId) ? 0 : 1;
  return (
    <StatusEntry type="meta" title="Communication" caution={caution}>
      <List styleType="disc" ml={6}>
        <ListItem>{student.slackId ? 'Has' : 'Has NOT'} joined Slack.</ListItem>
        <ListItem>{student.emailCount > 0 ? 'Has' : 'Has NOT'} replied-all to introduction email.</ListItem>
      </List>
    </StatusEntry>
  );
}

function StaffNotesEntries({ notes }) {
  if (!notes?.map) return null;
  return notes.map((n) => (
    <StatusEntry
      key={n.id}
      type="staff"
      date={DateTime.fromISO(n.createdAt)}
      caution={n.caution}
      title={<>{n.username}<Box display={{ base: 'none', md: 'inline-block' }}>@codeday.org</Box></>}
    >
      <Box pl={4} ml={4} borderLeftWidth={2}>
        <ReactMarkdown className="markdown">{n.note}</ReactMarkdown>
      </Box>
    </StatusEntry>
  ));
}

function compareSurveyResponses(a, b) {
  const aType = a.surveyOccurence.survey.personType;
  const bType = b.surveyOccurence.survey.personType;
  if (aType === 'STUDENT' && bType === 'MENTOR') return 1;
  if (aType === 'MENTOR' && bType === 'STUDENT') return -1;
  return 0;
}

function SurveyFeedbackEntries({ student, token }) {
  return [...student.surveyResponsesAbout]
    .sort(compareSurveyResponses)
    .map((sr) => (
      <StatusEntry
        key={sr.id}
        type={getReflectionType(sr, student)}
        date={DateTime.fromISO(sr.surveyOccurence.dueAt)}
        title={(sr.authorMentor || sr.authorStudent)?.name}
        caution={sr.caution}
      >
        <SurveyDetails token={token} id={sr.id} />
      </StatusEntry>
    ));
}


function ArtifactsEntry({ student, event }) {
  const hasArtifacts = student.artifacts.length > 0 || event.artifactTypes.length > 0;
  const hasProjects = student.projects && student.projects.length > 0;
  if (!hasArtifacts || !hasProjects) return null;
  return (
    <StatusEntry type="meta" caution={0} title="Artifacts">
      <List styleType="disc" ml={6}>
        {event.artifactTypes.filter((at) => at.personType !== 'MENTOR').map((at) => {
          const artifact = student.artifacts.filter((a) => a.artifactTypeId === at.id)[0];
          return (
            <ListItem key={at.id}>
              <strong>{at.name}: </strong>
              {artifact ? (
                <Link href={artifact.link} target="_blank">
                  {DateTime.fromISO(artifact.createdAt).toLocaleString(DateTime.DATETIME_MED)}
                </Link>
              ) : <>missing</>}
            </ListItem>
          );
        })}
        {student.artifacts.filter((a) => !a.artifactTypeId).map((a) => (
          <ListItem key={a.id}>
            <strong>{a.name}: </strong>
            <Link href={a.link} target="_blank">
              {DateTime.fromISO(a.createdAt).toLocaleString(DateTime.DATETIME_MED)}
            </Link>
          </ListItem>
        ))}
      </List>
    </StatusEntry>
  );
}

export default function PartnerStudentEntry({ student, event, token, filter, hidePartner }) {
  const mentorNames = (student.projects || [])
    .flatMap((p) => p.mentors)
    .flatMap((m) => m.name)
    .join(', ');
  return (
    <Box mb={8}>
      <a name={`s-${student.id}`} />
      <Heading as="h4" fontSize="2xl">
        {student.status !== 'ACCEPTED' && <StatusTag status={student.status} />}
        {student.name}, {student.minHours}hr/wk
      </Heading>
      {student.projects && student.projects.length > 0 && (
        <Text>Mentored by {mentorNames}</Text>
      )}

      <StandupRatings
        mb={4}
        mt={4}
        ratings={student.standupRatings}
        token={token}
        allowChanges={!hidePartner}
      />

      <StatusEntryCollection onlyType={filter}>
        <AdmissionAgreementEntry student={student} />
        <ProjectEntry student={student} />
        <OnboardingAssignmentsEntry student={student} />
        <CommunicationEntry student={student} />
        <StaffNotesEntries notes={student.notes} />
        <SurveyFeedbackEntries student={student} token={token} />
        <ArtifactsEntry student={student} event={event} />
      </StatusEntryCollection>
    </Box>
  );
}
