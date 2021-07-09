import React from 'react';
import { apiFetch } from '@codeday/topo/utils';
import CognitoForm from '@codeday/topo/Molecule/CognitoForm';
import Page from '../../../../../components/Page';
import Content from '@codeday/topo/Molecule/Content';
import { FormQuery } from './form.gql';

export default function FormPage({ data, token, formId }) {
  const projects = data.projects.filter((p) => p.status === 'MATCHED');
  const mentors = projects
    .map((p) => p.mentors.map((s) => ({ ...s, projectId: p.id })))
    .flat();
  const teammates = projects
    .map((p) => p.students.map((s) => ({ ...s, projectId: p.id })))
    .flat()
    .filter((s) => s.id !== data.id);

  const prefill = {
    StudentID: data.id,
    StudentName: {
      First: data.givenName,
      Last: data.surname,
    },
    StudentEmail: data.email,
    StudentPartnerCode: data.partnerCode,
    Projects: projects.map((p) => ({
      ProjectID: p.id,
    })),
    Mentors: mentors.map((m) => ({
      MentorName: {
        First: m.givenName,
        Last: m.surname,
      },
      MentorEmail: m.email,
      MentorID: m.id,
      ProjectID: m.projectId,
      MentorManager: m.managerUsername,
    })),
    Teammates: teammates.map((s) => ({
      TeammateID: s.id,
      TeammatePartnerCode: s.partnerCode,
      TeammateName: {
        First: s.givenName,
        Last: s.surname,
      },
      TeammateEmail: s.email,
    })),
  };

  return (
    <Page slug={`/dash/s/${token}/form/${formId}`} title="Form Submission">
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
  if (res?.labs?.student?.status !== 'ACCEPTED') throw Error('Not accepted.');

  return {
    props: {
      data: res.labs.student,
      formId,
      token,
    },
  };
}
