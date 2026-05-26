import { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, Checkbox, Heading, Spinner } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useColorModeValue } from '@codeday/topo/Theme';
import Page from '../../../../components/Page';
import SelectTrack from '../../../../components/Dashboard/SelectTrack';
import StudentActionRow from '../../../../components/Dashboard/StudentActionRow';
import useTopStudents from '../../../../components/Dashboard/useTopStudents';

const HELD_SPOT_STATUSES = ['OFFERED', 'ACCEPTED', 'TRACK_CHALLENGE', 'TRACK_INTERVIEW'];

function heldSpotsCount(stats) {
  return stats
    .filter(({ key }) => HELD_SPOT_STATUSES.includes(key))
    .reduce((accum, { value }) => accum + value, 0);
}

export default function AdminAdmit() {
  const { query } = useRouter();
  const [track, setTrack] = useState('BEGINNER');
  const [includeRejected, setIncludeRejected] = useState(false);
  const altBg = useColorModeValue('gray.100', 'gray.900');
  const { students, stats, loading, refresh } = useTopStudents({
    track,
    includeRejected,
    token: query.token,
  });

  return (
    <Page title="Admissions">
      <Content maxW="container.xl" mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mt={4}>Admissions</Heading>
        <Box>
          <SelectTrack track={track} onChange={(e) => setTrack(e.target.value)} />
          <Checkbox onClick={(e) => setIncludeRejected(e.target.checked)}>Include Rejected</Checkbox>
          {loading && <Spinner />}
        </Box>
        <Box mb={8}>Current held spots: {heldSpotsCount(stats)}</Box>

        <Box as="table" w="100%">
          <Box as="tr" fontWeight="bold" borderBottomColor="black" borderBottomWidth={1}>
            <Box w="20%" as="td">Name</Box>
            <Box w="20%" as="td">Rating</Box>
            <Box w="40%" as="td">Interview Notes</Box>
            <Box w="20%" as="td">&nbsp;</Box>
          </Box>
          {students.map((s, i) => (
            <StudentActionRow
              key={s.id}
              onChange={refresh}
              student={s}
              bg={i % 2 === 1 ? altBg : undefined}
            />
          ))}
        </Box>
      </Content>
    </Page>
  );
}
