import React from 'react';
import { Content } from '@codeday/topo/Box';
import CognitoForm from '@codeday/topo/CognitoForm';
import { Heading } from '@codeday/topo/Text';
import { getStudent, getProject, getMentor } from '../../../utils/airtable';
import Page from '../../../components/Page';

export const getServerSideProps = async ({ params: { id } }) => {
  const mentor = await getMentor(id);
  const projects = await Promise.all(mentor.Projects.map((p) => getProject(p)));
  const studentIds = projects.reduce((accum, p) => [...accum, ...p.Team], []);
  const students = await Promise.all(studentIds.map((s) => getStudent(s)));
  return {
    props: {
      MentorID: id,
      MentorName: { First: mentor['First Name'], Last: mentor['Last Name'] },
      Students: students.filter((s) => !s['Extended Internship']).map((s) => ({
        StudentID: s.id,
        ProjectID: s.Projects[0],
        Name: s.Name,
      })),
    },
  };
};

export default function MentorApplyPage(props) {
  return (
    <Page slug="/reflect" title="Student Reflection">
      <Content>
        <Heading as="h2" size="xl" marginBottom={3}>Final Reflection</Heading>
        <CognitoForm
          formId="73"
          prefill={props}
        />
      </Content>
    </Page>
  );
}
