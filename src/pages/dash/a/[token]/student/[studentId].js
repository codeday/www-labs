import { apiFetch } from '@codeday/topo/utils';
import Page from '../../../../../components/Page';
import { StudentById } from './studentId.gql';
import StudentApplication from '../../../../../components/Dashboard/StudentApplication';
import StudentHeader from '../../../../../components/Dashboard/StudentHeader';
import { Content } from '@codeday/topo/Molecule';

export default function StudentId({ student }) {
  return (
    <Page title={`${student?.givenName} ${student?.surname}`}>
      <Content>
        <StudentHeader student={student} />
        <StudentApplication student={student} />
      </Content>
    </Page>
  )
}

export async function getServerSideProps({ params: { token, studentId } }) {
  const studentById = await apiFetch(
    StudentById,
    { id: studentId },
    { 'X-Labs-Authorization': `Bearer ${token}`}
  );

  return {
    props: {
      student: studentById.labs.student,
    },
  };
}
