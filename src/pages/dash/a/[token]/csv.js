import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import { Heading } from '@codeday/topo/Atom/Text';
import Page from '../../../../components/Page';
import { useFetcher } from '../../../../dashboardFetch';
import { CsvStudents } from './csv.gql';

function projectFilter({ status }) {
  return ['ACCEPTED', 'MATCHED'].includes(status);
}

export default function AdminAddMentor() {
  const { query } = useRouter();
  const fetch = useFetcher();
  const [data, setData] = useState({students: [], mentors: []});
  const { students, mentors } = data;

  useEffect(async () => {
    if (typeof window === 'undefined' || !query.token) return;
    const resp = await fetch(CsvStudents);
    setData(resp?.labs);
  }, [typeof window, query.token])

  return (
    <Page title="Admitted CSV">
      <Content mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mb={8} mt={4}>Admitted CSV</Heading>
        <Box
          as="textarea"
          w="100%"
          h="md"
          value={
            [
              `Name,Email,LastName,Id,Track,Type`,
              ...students.map((s) => [s.givenName, s.email, s.surname, s.id, s.track, 'STUDENT'].join(',')),
              ...mentors.filter(({ projects }) => projects.filter(projectFilter).length > 0).map((m) => [
                m.givenName,
                m.email,
                m.surname,
                m.id,
                m.projects.filter(projectFilter)[0].track,
                'MENTOR'
              ].join(`,`))
            ].join(`\n`)
          }
        />
      </Content>
    </Page>
  );
}
