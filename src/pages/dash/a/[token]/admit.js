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

function Entry({ student, onChange, ...rest }) {
  const fetch = useFetcher();
  const { success, error } = useToasts();
  const [track, setTrack] = useState(student.track);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box as="tr" {...rest}>
      <Box as="td">
        <Link href={`mailto:${student.email}`}>{student.name}</Link><br />
        #{student.id}<br />
        {student.profile?.location?.country}<br />
        {student.profile?.schoolType}
        {student.profile?.partnerCode && (<><br />{student.profile.partnerCode}</>)}
      </Box>
      <Box as="td">{student.status}</Box>
      <Box as="td">{Math.round(student.admissionRatingAverage, 2)} (of {student.admissionRatingCount})</Box>
      <Box as="td">
        {student.trackRecommendation.map((rec) => `${Math.floor(rec.weight * 100)}% ${rec.track[0]}`).join(' / ')}
      </Box>
      <Box as="td">
        <SelectTrack
          disabled={isLoading}
          track={track}
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
        />
      </Box>
      <Box>
        <Button
          isLoading={isLoading}
          disabled={isLoading}
          colorScheme="purple"
          onClick={async () => {
            setIsLoading(true);
            try {
              await fetch(StudentTrackChallenge, { id: student.id });
              success('Challenge sent.');
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
      <Content mt={-8}>
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
            <Box as="td">Name</Box>
            <Box as="td">Status</Box>
            <Box as="td">Rating</Box>
            <Box as="td">Track Rating</Box>
            <Box as="td">&nbsp;</Box>
            <Box as="td">&nbsp;</Box>
          </Box>
          {students.map((s, i) => (
            <Entry key={s.id} onChange={refresh} student={s} bg={i % 2 === 1 ? 'gray.100' : undefined} />
          ))}
        </Box>
      </Content>
    </Page>
  );
}
