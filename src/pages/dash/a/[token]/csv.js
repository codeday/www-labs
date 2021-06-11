import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import { Heading } from '@codeday/topo/Atom/Text';
import Page from '../../../../components/Page';
import { useFetcher } from '../../../../dashboardFetch';
import { CsvStudents } from './csv.gql';

export default function AdminAddMentor() {
  const { query } = useRouter();
  const fetch = useFetcher();
  const [students, setStudents] = useState([]);

  useEffect(async () => {
    if (typeof window === 'undefined' || !query.token) return;
    const resp = await fetch(CsvStudents);
    setStudents(resp?.labs?.students);
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
          value={`Name,Email,LastName,Id,Track\n` + students.map((s) => `${s.givenName},${s.email},${s.surname},${s.id},${s.track}`).join(`\n`)}
        />
      </Content>
    </Page>
  );
}
