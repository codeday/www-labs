import React, { useState } from 'react';
import { Heading, Button } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { Form } from '@rjsf/chakra-ui';
import Page from '../../../../../../../components/Page';
import { useSurveyResponses } from '../../../../../../../utils';
import { SurveyQuery, SurveyRespondMutation } from './index.gql';
import { apiFetch } from '@codeday/topo/utils';

export default function SurveyPage({ mentor, survey, token, surveyId, occurrenceId }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [responses, setResponse, getResponse] = useSurveyResponses();

  const projects = mentor.projects.filter((p) => p.status === 'MATCHED');
  const peerMentors = projects
    .map((p) => p.mentors.map((m) => ({ ...m, projectId: p.id })))
    .flat()
    .filter((m) => m.id !== mentor.id);
  const students = projects
    .map((p) => p.students.map((s) => ({ ...s, projectId: p.id })))
    .flat()

  if (isSubmitted) {
    return (
      <Page slug={`/dash/m/${token}/survey/${surveyId}/${occurrenceId}`} title="Form Submission">
        <Content>
          Thanks for submitting this survey. You can now close the page.
        </Content>
      </Page>
    );
  }

  return (
    <Page slug={`/dash/m/${token}/survey/${surveyId}/${occurrenceId}`} title="Form Submission">
      {survey?.selfSchema && (
        <Content>
          <Heading fontSize="5xl">Self-Reflection</Heading>
          <Form
            schema={survey.selfSchema}
            uiSchema={survey.selfUi}
            onChange={(e) => setResponse({ response: e.formData, mentor: mentor.id })}
            formData={getResponse({ mentor: mentor.id })?.response || {}}
            disabled={isLoading}
            children={true}
          />
        </Content>
      )}
      {survey?.projectSchema && projects.map((p) => (
        <Content>
          <Heading fontSize="5xl">
            Project Reflection: Your project with {p.students.map(m => m.givenName).join('/')}
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
      {survey?.peerSchema && peerMentors.map((p) => (
        <Content>
          <Heading fontSize="5xl">Peer Reflection: {p.givenName} {p.surname}</Heading>
          <Form
            schema={survey.peerSchema}
            uiSchema={survey.peerUi}
            onChange={(e) => setResponse({ response: e.formData, mentor: p.id })}
            formData={getResponse({ mentor: p.id })?.response || {}}
            disabled={isLoading}
            children={true}
          />
        </Content>
      ))}
      {survey?.menteeSchema && students.map((m) => (
        <Content>
          <Heading fontSize="5xl">Mentee Reflection: {m.givenName} {m.surname}</Heading>
          <Form
            schema={JSON.parse(JSON.stringify(survey.menteeSchema).replace(/{{name}}/g, m.givenName))}
            uiSchema={survey.menteeUi}
            onChange={(e) => setResponse({ response: e.formData, student: m.id })}
            formData={getResponse({ student: m.id })?.response || {}}
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
  if (!res?.labs?.survey) throw new Error('No survey.');
  return {
    props: {
      mentor: res.labs.mentor,
      survey: res.labs.survey,
      surveyId,
      occurrenceId,
      token,
    },
  };
}