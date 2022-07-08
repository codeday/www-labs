import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { decode } from 'jsonwebtoken';
import { apiFetch } from '@codeday/topo/utils';
import { Box, Button, Heading } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../../../components/Page';
import { useFetcher } from '../../../../dashboardFetch';
import { CsvStudents } from './csv.gql';
import { makeToken } from '../../../../utils/makeToken';

function projectFilter({ status }) {
  return ['ACCEPTED', 'MATCHED'].includes(status);
}

export default function AdminAddMentor({ students, mentors }) {
  const { query } = useRouter();

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
              `Name,Email,LastName,Id,Track,Type,Link`,
              ...students.map((s) => [s.givenName, s.email, s.surname, s.id, s.track, 'STUDENT', s.link].join(',')),
              ...mentors.filter(({ projects }) => projects.filter(projectFilter).length > 0).map((m) => [
                m.givenName,
                m.email,
                m.surname,
                m.id,
                m.projects.filter(projectFilter)[0].track,
                'MENTOR',
                m.link,
              ].join(`,`))
            ].join(`\n`)
          }
        />
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ params: { token }}) {
  const res = await apiFetch(CsvStudents, {}, { 'X-Labs-Authorization': `Bearer ${token}` });
  const { evt } = decode(token);
  console.log(evt);
  return {
    props: {
      students: res.labs.students.map((s) => ({ ...s, link: `https://labs.codeday.org/dash/s/${makeToken({ typ: 's', sid: s.id, tgt: 'i', evt })}` })),
      mentors: res.labs.mentors.map((m) => ({ ...m, link: `https://labs.codeday.org/dash/m/${makeToken({ typ: 'm', sid: m.id, tgt: 'i', evt })}` })),
    },
  };
}
