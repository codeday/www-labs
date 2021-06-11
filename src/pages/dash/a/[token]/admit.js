import { useReducer, useState, useEffect } from 'react';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import { Heading } from '@codeday/topo/Atom/Text';
import { useToasts } from '@codeday/topo/utils';
import { default as Input } from '@codeday/topo/Atom/Input/Text';
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
import Spinner from '@codeday/topo/Atom/Spinner';

function Entry({ student, onChange, ...rest }) {
  const fetch = useFetcher();
  const { success, error } = useToasts();
  const [track, setTrack] = useState(student.track);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box as="tr" {...rest}>
      <Box as="td">{student.name}<br />{student.profile?.location?.country}<br />{student.profile?.schoolType}</Box>
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
          variantColor="purple"
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
          variantColor="green"
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
          variantColor="red"
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
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetch = useFetcher();
  const refresh = async () => {
    setLoading(true);
    const result = await fetch(TopStudentsByTrack, { track });
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
  }, [typeof window, track, query]);

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
