import { useReducer, useState } from 'react';
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

function Entry({ student, ...rest }) {
  const fetch = useFetcher();
  const { success, error } = useToasts();
  const [track, setTrack] = useState(student.track);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Box as="tr" {...rest}>
      <Box as="td">{student.name}<br />{student.profile?.location?.country}</Box>
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
  const { success, error } = useToasts();
  const [track, setTrack] = useState('BEGINNER');
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetch = useFetcher();

  return (
    <Page title="Admissions">
      <Content mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mt={4}>Admissions</Heading>
        <Box mb={8}>
          <SelectTrack
            disabled={loading}
            track={track}
            onChange={(e) => setTrack(e.target.value)}
          />
          <Button
            disabled={loading}
            isLoading={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const result = await fetch(TopStudentsByTrack, { track });
                setStudents(result?.labs?.studentsTopRated);
              } catch (ex) {
                error(ex.toString());
              }
              setLoading(false);
            }}
          >Fetch</Button>
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
          {students.map((s, i) => <Entry key={s.id} student={s} bg={i % 2 === 1 ? 'gray.100' : undefined} />)}
        </Box>
      </Content>
    </Page>
  );
}
