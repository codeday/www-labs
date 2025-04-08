import { useRouter } from 'next/router';
import { apiFetch } from '@codeday/topo/utils';
import { Button, Heading, Textarea } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../../../components/Page';
import MatchBoard from '../../../../components/Dashboard/MatchBoard';
import { LabsMatchBoard } from './match.gql';
import { useState } from 'react';

export default function MatchPage({ students, projects }) {
  const { query } = useRouter();
  const [projectAssignments, setProjectAssignments] = useState({});

  return (
    <Page title="Match Board">
      <Content mt={-8} maxWidth="100%">
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mb={8} mt={4}>Match Board</Heading>
        <MatchBoard
          projects={projects}
          students={students}
          onChange={setProjectAssignments}
        />
        <Textarea value={`projectId,studentId\n` + Object.entries(projectAssignments).flatMap(([projectId, students]) => students.map(s => `${projectId},${s}`)).join(`\n`)} />
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ params: { token }}) {
  const res = await apiFetch(LabsMatchBoard, {}, { 'X-Labs-Authorization': `Bearer ${token}` });
  return {
    props: {
      projects: res.labs.projects,
      students: res.labs.students,
    },
  };
}
