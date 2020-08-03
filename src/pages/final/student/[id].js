import React from 'react';
import { Content } from '@codeday/topo/Box';
import CognitoForm from '@codeday/topo/CognitoForm';
import { Heading } from '@codeday/topo/Text';
import { getStudent, getProject, getMentor } from '../../../utils/airtable';
import Page from '../../../components/Page';

export const getServerSideProps = async ({ params: { id } }) => {
  const student = await getStudent(id);
  const project = await getProject(student.Projects[0]);
  const mentor = await getMentor(project.Mentors[0]);
  return {
    props: {
      studentId: id,
      projectId: student.Projects[0],
      studentName: student.Name,
      mentorName: mentor.Name,
      assignee: mentor.Assignee.name,
    },
  };
};

export default function MentorApplyPage({
  studentId, projectId, studentName, mentorName, assignee,
}) {
  return (
    <Page slug="/reflect" title="Student Reflection">
      <Content>
        <Heading as="h2" size="xl" marginBottom={3}>Final Reflection</Heading>
        <CognitoForm
          formId="74"
          prefill={{
            ProjectId: projectId,
            StudentId: studentId,
            StudentName: studentName,
            MentorName: mentorName,
            Assignee: assignee,
          }}
        />
      </Content>
    </Page>
  );
}
