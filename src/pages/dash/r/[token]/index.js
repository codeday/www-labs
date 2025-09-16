import { print } from 'graphql';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Grid, Button, Text, Heading, Spinner } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import SelectTrack from '../../../../components/Dashboard/SelectTrack';
import { useFetcher } from '../../../../dashboardFetch';
import { StudentNeedingRating, StudentNeedingRatingInTrack, SubmitRating } from './index.gql';
import { useColorMode } from '@codeday/topo/Theme';
import StudentApplication from '../../../../components/Dashboard/StudentApplication';
import StudentHeader from '../../../../components/Dashboard/StudentHeader';

export default function ReviewPage() {
  const { query } = useRouter();
  const fetch = useFetcher();
  const [studentResp, setStudentResp] = useState();
  const [recommendedTrack, setRecommendedTrack] = useState();
  const [track, setTrack] = useState(null);
  const [rating, setRating] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToasts();
  const { colorMode } = useColorMode();

  const next = async () => {
    if (track) return fetch(print(StudentNeedingRatingInTrack), { track });
    return fetch(print(StudentNeedingRating));
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && query?.token) {
      next().then(setStudentResp);
    }
  }, [typeof window, setStudentResp, query?.token, track]);

  useEffect(() => {
    if (studentResp) {
      setRecommendedTrack(studentResp?.labs?.nextStudentNeedingRating?.track);
      setRating(null);
    }
  }, [studentResp]);

  const showMeBox = (
    <Box
      p={4}
      mb={8}
      bg={colorMode === 'dark' ? 'purple.900' : 'purple.50'}
      borderColor={colorMode === 'dark' ? 'purple.600' : 'purple.900'}
      borderWidth={1}
      rounded="sm"
      d="inline-block"
    >
      <Heading as="h4" fontSize="md">Show me...</Heading>
      <SelectTrack track={track} allowNull onChange={(e) => setTrack(e.target.value)} />
    </Box>
  );

  if (!studentResp?.labs?.nextStudentNeedingRating || isLoading) {
    return (
      <Page title="Review Dashboard">
        <Content textAlign="center">
          <Spinner />
          <Box textAlign="center">
            {showMeBox}
          </Box>
        </Content>
      </Page>
    );
  }

  const student = studentResp.labs.nextStudentNeedingRating;

  return (
    <Page title={`Application Review ~ ${student.givenName[0]}. ${student.surname[0]}.`}>
      <Content mt={-8}>
        <StudentHeader anonymous student={student} />
        <Grid templateColumns="3fr 1fr" gap={8}>
          <StudentApplication student={student} />
          <Box>
            {showMeBox}

            <Heading as="h4" fontSize="md">Which track is best?</Heading>
            <Text fontSize="sm" mb={0}>(* = their selection)</Text>
            <Box>
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((t) => (
                <Button
                  key={t}
                  colorScheme={recommendedTrack === t ? 'purple' : undefined}
                  onClick={() => setRecommendedTrack(t)}
                  size="sm"
                  mr={1}
                >
                  {t[0]}{t.slice(1,3).toLowerCase()}{student.track === t && '*'}
                </Button>
              ))}
            </Box>

            <Heading as="h4" fontSize="md" mt={8}>Rate this application:</Heading>
            <Box>
              {[1, 2, 3, 4, 5].map((r) => (
                <Button
                  key={r}
                  colorScheme={rating === r ? 'purple' : undefined}
                  onClick={() => setRating(r)}
                  size="sm"
                  mr={1}
                >
                  {r}
                </Button>
              ))}
            </Box>

            <Box mt={8}>
              <Button
                onClick={async () => {
                  setIsLoading(true);
                  setStudentResp(await next());
                  setIsLoading(false);
                }}
                mr={2}
              >
                Skip
              </Button>

              <Button
                colorScheme="green"
                disabled={!rating || !recommendedTrack}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await fetch(print(SubmitRating), { id: student.id, rating: rating * 2, track: recommendedTrack });
                    setStudentResp(await next());
                    success('Submitted rating!');
                  } catch (ex) {
                    error(ex);
                  }
                  setIsLoading(false);
                }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}
