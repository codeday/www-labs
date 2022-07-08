import React, { useState } from 'react';
import { Heading, Button } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { Form } from '@rjsf/chakra-ui';
import Page from '../../../../../../../components/Page';
import { useSurveyResponses } from '../../../../../../../utils';
import { SurveyQuery, SurveyRespondMutation } from './index.gql';
import { apiFetch } from '@codeday/topo/utils';

export default function SurveyPage({ student, survey, token, surveyId, occurrenceId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responses, setResponse, getResponse] = useSurveyResponses();

  const projects = student.projects.filter((p) => p.status === 'MATCHED');
  const mentors = projects
    .map((p) => p.mentors.map((s) => ({ ...s, projectId: p.id })))
    .flat();
  const teammates = projects
    .map((p) => p.students.map((s) => ({ ...s, projectId: p.id })))
    .flat()
    .filter((s) => s.id !== student.id);

  if (isSubmitted) {
    return (
      <Page slug={`/dash/s/${token}/survey/${surveyId}/${occurrenceId}`} title="Form Submission">
        <Content>
          Thanks for submitting this survey. You can now close the page.
        </Content>
      </Page>
    );
  }

  return (
    <Page slug={`/dash/s/${token}/survey/${surveyId}/${occurrenceId}`} title="Form Submission">
      {survey?.selfSchema && (
        <Content>
          <Heading fontSize="5xl">Self-Reflection</Heading>
          <Form
            schema={survey.selfSchema}
            uiSchema={survey.selfUi}
            onChange={(e) => setResponse({ response: e.formData, student: student.id })}
            formData={getResponse({ student: student.id })?.response || {}}
            disabled={isLoading}
            children={true}
          />
        </Content>
      )}
      {survey?.projectSchema && projects.map((p) => (
        <Content>
          <Heading fontSize="5xl">
            Project Reflection: Your project with {[...p.mentors, ...p.students].map(m => m.givenName).join('/')}
          </Heading>
          <Form
            schema={survey.projectSchema}
            uiSchema={survey.projectUi}
            onChange={(e) => setResponse({ response: e.formData, project: p.id })}
            formData={getResponse({ project: p.id })?.response || {}}
            disabled={isLoading}
            children={true}
          />
        </Content>
      ))}
      {survey?.peerSchema && teammates.map((p) => (
        <Content>
          <Heading fontSize="5xl">Peer Reflection: {p.givenName} {p.surname}</Heading>
          <Form
            schema={JSON.parse(JSON.stringify(survey.peerSchema).replace(/{{name}}/g, p.givenName))}
            uiSchema={survey.peerUi}
            onChange={(e) => setResponse({ response: e.formData, student: p.id })}
            formData={getResponse({ student: p.id })?.response || {}}
            disabled={isLoading}
            children={true}
          />
        </Content>
      ))}
      {survey?.mentorSchema && mentors.map((m) => (
        <Content>
          <Heading fontSize="5xl">Mentor Reflection: {m.givenName} {m.surname}</Heading>
          <Form
            schema={JSON.parse(JSON.stringify(survey.mentorSchema).replace(/{{name}}/g, m.givenName))}
            uiSchema={survey.mentorUi}
            onChange={(e) => setResponse({ response: e.formData, mentor: m.id })}
            formData={getResponse({ mentor: m.id })?.response || {}}
            disabled={isLoading}
            children={true}
          />
        </Content>
      ))}
      <Content textAlign="center" mt={8}>
        <Button
          isLoading={isLoading}
          size="lg"
          colorScheme="green"
          onClick={async () => {
            setIsLoading(true);
            try {
              const res = await apiFetch(
                SurveyRespondMutation,
                { occurrenceId, responses },
                { 'X-Labs-Authorization': `Bearer ${token}` },
              );
              setIsSubmitted(true);
            } catch (ex) { console.error(ex); }
            setIsLoading(false);
          }}
        >
          Submit
        </Button>
      </Content>
    </Page>
  )
}

export async function getServerSideProps({ params: { token, surveyId, occurrenceId }}) {
  const res = await apiFetch(SurveyQuery, { surveyId }, { 'X-Labs-Authorization': `Bearer ${token}` });
  if (res?.labs?.student?.status !== 'ACCEPTED') throw new Error('Not accepted.');
  if (!res?.labs?.survey) throw new Error('No survey.');
  return {
    props: {
      student: res.labs.student,
      survey: res.labs.survey,
      surveyId,
      occurrenceId,
      token,
    },
  };
}
