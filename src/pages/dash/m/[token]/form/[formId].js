import React from 'react';
import { apiFetch } from '@codeday/topo/utils';
import { CognitoForm, Content } from '@codeday/topo/Molecule';
import Page from '../../../../../components/Page';
import { FormQuery } from './form.gql';

export default function FormPage({ data, token, formId }) {
  const students = data.projects
    .filter((p) => p.status === 'MATCHED')
    .map((p) => p.students.map((s) => ({ ...s, projectId: p.id })))
    .flat();

  const prefill = {
    MentorName: {
      First: data.givenName,
      Last: data.surname,
    },
    MentorEmail: data.email,
    MentorID: data.id,
    MentorManager: data.managerUsername,
    Students: students.map((s) => ({
      StudentID: s.id,
      ProjectID: s.projectId,
      StudentName: {
        First: s.givenName,
        Last: s.surname,
      },
      StudentEmail: s.email,
      StudentPartnerCode: s.partnerCode,
    })),
  };

  return (
    <Page slug={`/dash/m/${token}/form/${formId}`} title="Form Submission">
      <Content>
        <CognitoForm
          formId={formId}
          prefill={prefill}
        />
      </Content>
    </Page>
  )
}

export async function getServerSideProps({ params: { token, formId }}) {
  const res = await apiFetch(FormQuery, {}, { 'X-Labs-Authorization': `Bearer ${token}` });
  if (res?.labs?.mentor?.status !== 'ACCEPTED') throw Error('Not accepted.');

  return {
    props: {
      data: res.labs.mentor,
      formId,
      token,
    },
  };
}
