import { useReducer, useState, useEffect } from 'react';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { Box, Button, Heading, Link, Spinner, Checkbox } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { useFetcher } from '../../../../dashboardFetch';
import SelectTrack from '../../../../components/Dashboard/SelectTrack';
import {
  TopStudentsByTrack,
  StudentChangeTrack,
  StudentTrackChallenge,
  StudentTrackInterview,
  StudentReject,
  StudentOfferAdmission
} from './admit.gql';
import { useColorMode } from '@chakra-ui/react';

const nl2br = (str) => str && str
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/(https?:\/\/[^\s\(\)]+)/g, (url) => `<a href="${url}" style="text-decoration: underline" target="_blank">${url}</a>`)
  .replace(/\n/g, '<br />');

function Entry({ student, onChange, ...rest }) {
  const fetch = useFetcher();
  const { success, error } = useToasts();
  const [track, setTrack] = useState(student.track);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box as="tr" {...rest}>
      <Box as="td">
        <Link href={`mailto:${student.email}`}>{student.name}</Link><br />
        <Link href={`student/${student.id}`} target="_blank">#{student.id}</Link><br />
        {student.status}<br />
        {student.minHours} hours<br />
        {student.timezone} {student.profile?.location?.country || student?.profile?.country}<br />
        {student.profile?.yearsToGraduation ? <>{student.profile.yearsToGraduation} years to graduation<br /></>: ''}
        {student.partnerCode && (<><br />Partner Code: {student.partnerCode}</>)}
      </Box>
      <Box as="td">
        {Math.round(student.admissionRatingAverage, 2)} (of {student.admissionRatingCount || 0})<br />
        {student.trackRecommendation.map((rec) => `${Math.floor(rec.weight * 100)}% ${rec.track[0]}`).join(' / ')}
      </Box>
      <Box as="td">
        <div dangerouslySetInnerHTML={{ __html: nl2br(student.interviewNotes) }} />
      </Box>
      <Box as="td">
        <SelectTrack
          disabled={isLoading}
          track={track}
          size="sm"
          onChange={async (e) => {
            setIsLoading(true);
            try {
              await fetch(StudentChangeTrack, { id: student.id, track: e.target.value });
              setTrack(e.target.value);
              success(`Changed ${student.name}'s track to ${e.target.value}`);
              onChange();
            } catch (ex) {
              error(ex.toString());
            }
            setIsLoading(false);
          }}
        /><br />
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          colorScheme="purple"
          size="xs"
          onClick={async () => {
            setIsLoading(true);
            try {
              await fetch(StudentTrackInterview, { id: student.id });
              success('Interview request sent.');
              onChange();
            } catch (ex) {
              error(ex.toString());
            }
            setIsLoading(false);
          }}
        >
          Challenge
        </Button>{' '}
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          colorScheme="green"
          size="xs"
          onClick={async () => {
            setIsLoading(true);
            try {
              await fetch(StudentOfferAdmission, { id: student.id });
              success('Offer sent.');
              onChange();
            } catch (ex) {
              error(ex.toString());
            }
            setIsLoading(false);
          }}
        >
          Admit
        </Button>{' '}
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          colorScheme="red"
          size="xs"
          onClick={async () => {
            setIsLoading(true);
            try {
              await fetch(StudentReject, { id: student.id });
              success('Rejection sent.');
              onChange();
            } catch (ex) {
              error(ex.toString());
            }
            setIsLoading(false);
          }}
        >
          Reject
        </Button>
      </Box>
    </Box>
  )
}

export default function AdminAdmit() {
  const { query } = useRouter();
  const { error } = useToasts();
  const [track, setTrack] = useState('BEGINNER');
  const [includeRejected, setIncludeRejected] = useState(false);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const { colorMode } = useColorMode();
  const fetch = useFetcher();
  const refresh = async () => {
    setLoading(true);
    const result = await fetch(TopStudentsByTrack, { track, includeRejected: includeRejected || false });
    setStudents(result?.labs?.studentsTopRated);
    setStats(result?.labs?.statAdmissionsStatus);
    setLoading(false);
  }
  useEffect(async () => {
    if (typeof window === 'undefined' || !fetch || !query.token) return;
    try {
      await refresh();
    } catch (ex) {
      error(ex.toString());
    }
  }, [typeof window, track, includeRejected, query]);

  return (
    <Page title="Admissions">
      <Content maxW="container.xl" mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mt={4}>Admissions</Heading>
        <Box>
          <SelectTrack
            track={track}
            onChange={(e) => setTrack(e.target.value)}
          />
          <Checkbox onClick={(e) => setIncludeRejected(e.target.checked)}>Include Rejected</Checkbox>
          {loading && <Spinner />}
        </Box>
        <Box mb={8}>
          Current held spots: {
            stats
              .filter(({ key }) => ['OFFERED', 'ACCEPTED', 'TRACK_CHALLENGE', 'TRACK_INTERVIEW'].includes(key))
              .reduce((accum, { value }) => accum + value, 0)
          }
        </Box>

        <Box as="table" w="100%">
          <Box as="tr" fontWeight="bold" borderBottomColor="black" borderBottomWidth={1}>
            <Box w="20%" as="td">Name</Box>
            <Box w="20%" as="td">Rating</Box>
            <Box w="40%" as="td">Interview Notes</Box>
            <Box w="20%" as="td">&nbsp;</Box>
          </Box>
          {students.map((s, i) => (
            <Entry
              key={s.id}
              onChange={refresh}
              student={s}
              bg={i % 2 === 1 ? (colorMode === 'dark' ? 'gray.900' : 'gray.100') : undefined}
            />
          ))}
        </Box>
      </Content>
    </Page>
  );
}
