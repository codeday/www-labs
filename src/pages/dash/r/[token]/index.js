import { print } from 'graphql';
import { useState, useEffect } from 'react';
import reactnl2br from 'react-nl2br';
import { useRouter } from 'next/router';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Button from '@codeday/topo/Atom/Button';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import { useToasts } from '@codeday/topo/utils';
import Spinner from '@codeday/topo/Atom/Spinner';
import Page from '../../../../components/Page';
import SelectTrack from '../../../../components/Dashboard/SelectTrack';
import { useFetcher } from '../../../../dashboardFetch';
import { StudentNeedingRating, StudentNeedingRatingInTrack, SubmitRating } from './index.gql';
import List, { Item } from '@codeday/topo/Atom/List';

function LongAnswer({ title, text }) {
  if (!text) return <></>;
  return (
    <Box mb={8}>
      <Heading
        as="h3"
        fontSize="lg"
        mb={2}
      >
        {title}
      </Heading>
      <Text pl={2} ml={2} borderLeftWidth={2}>{reactnl2br(text)}</Text>
    </Box>
  )
}

export default function ReviewPage() {
  const { query } = useRouter();
  const fetch = useFetcher();
  const [studentResp, setStudentResp] = useState();
  const [recommendedTrack, setRecommendedTrack] = useState();
  const [track, setTrack] = useState(null);
  const [rating, setRating] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useToasts();

  const next = async () => {
    if (track) return fetch(print(StudentNeedingRatingInTrack), { track });
    return fetch(print(StudentNeedingRating));
  }

  useEffect(async () => {
    if (typeof window !== 'undefined' && query?.token) {
      setStudentResp(await next());
    }
  }, [typeof window, setStudentResp, query?.token, track]);

  useEffect(() => {
    if (studentResp) {
      setRecommendedTrack(null);
      setRating(null);
    }
  }, [studentResp]);

  const showMeBox = (
    <Box p={4} mb={8} bg="purple.50" borderColor="purple.800" borderWidth={1} rounded="sm" d="inline-block">
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
  const links = {
    github: student.profile?.github,
    linkedin: student.profile?.linkedin,
    resume: student.profile?.resume,
  };

  const factors = [
    ...(
      student.profile.fteIn <= 12
        ? [`They are looking for a full-time job ${student.profile?.fteIn > 0 ? `in ~${student.profile?.fteIn}mo` : 'now'}.`]
        : []
    ),
    ...(
      student.profile?.pronouns !== 'he/him'
      || ['Black', 'Latino/a/e* or Hispanic', 'Native American'].includes(student.profile?.ethnicity)
        ? ['They are a member of an group significantly underrepresented in tech.']
        : []
    )
  ];

  return (
    <Page title={student.id}>
      <Content mt={-8}>
        <Grid templateColumns="1fr 1fr" mb={8}>
          <Box>
            <Heading as="h2" fontSize="4xl" mb={0}>{student.givenName[0]}.{student.surname[0]}.</Heading>
            <Text fontSize="lg" bold mb={0}>{student.profile?.schoolYear}, {student.profile?.schoolName}</Text>
            <Text fontSize="md" bold color="blue.800" mb={0}>
              {Object.keys(links).filter((k) => links[k]).map((k) => (
                <Link key={k} as="a" href={links[k]} target="_blank" mr={3}>{k}</Link>
              ))}
            </Text>
          </Box>
          <Box fontSize="sm" textAlign="right">
            <Text mb={0}>
              <Text as="span" bold>id: </Text><Text as="span" fontFamily="mono">{student.id}</Text> /{' '}
              <Text as="span" bold>app: </Text><Text as="span" fontFamily="mono">#{student.profile?.appId}</Text>
            </Text>
            <Text mb={0}>
              <Text as="span" bold>track: </Text><Text as="span" fontFamily="mono">{student.track}</Text>
            </Text>
          </Box>
        </Grid>
        <Grid templateColumns="3fr 1fr" gap={8}>
          <Box>
            {factors.length > 0 && (
              <Box mb={8}>
                <Heading as="h3" fontSize="lg" mb={2}>Extra factors to consider:</Heading>
                <List styleType="disc">
                  {factors.map((e) => (
                    <Item key={e}>{e}</Item>
                  ))}
                </List>
              </Box>
            )}
            <Box mb={8}>
              <Heading as="h3" fontSize="lg" mb={2}>Things they've done:</Heading>
              <List styleType="disc">
                {student.profile?.haveDone.map((e) => (
                  <Item key={e}>{e}</Item>
                ))}
              </List>
            </Box>
            <LongAnswer
              title={`A past project they're proud of:`}
              text={student.profile?.pastProject}
            />
            <LongAnswer
              title={`If accepted, they look forward to:`}
              text={student.profile?.lookForward}
            />
            <LongAnswer
              title={`Anything else?`}
              text={student.profile?.anythingElse}
            />
          </Box>

          <Box>
            {showMeBox}

            <Heading as="h4" fontSize="md">Which track is best?</Heading>
            <Text fontSize="sm" mb={0}>(* = their selection)</Text>
            <Box>
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((t) => (
                <Button
                  key={t}
                  variantColor={recommendedTrack === t ? 'purple' : undefined}
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
                  variantColor={rating === r ? 'purple' : undefined}
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
                variantColor="green"
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
