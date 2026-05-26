import { useRouter } from 'next/router';
import { Box, Grid, Spinner } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../../../components/Page';
import CenteredMessagePage from '../../../../components/Dashboard/CenteredMessagePage';
import RatingControls, { ReviewTrackFilter } from '../../../../components/Dashboard/RatingControls';
import StudentApplication from '../../../../components/Dashboard/StudentApplication';
import StudentHeader from '../../../../components/Dashboard/StudentHeader';
import useReviewQueue from '../../../../components/Dashboard/useReviewQueue';

export default function ReviewPage() {
  const { query } = useRouter();
  const queue = useReviewQueue({ token: query?.token });

  if (!queue.student || queue.isLoading) {
    return (
      <CenteredMessagePage title="Review Dashboard">
        <Spinner />
        <Box textAlign="center">
          <ReviewTrackFilter track={queue.track} onTrackChange={queue.setTrack} />
        </Box>
      </CenteredMessagePage>
    );
  }

  const { student } = queue;

  return (
    <Page title={`Application Review ~ ${student.givenName[0]}. ${student.surname[0]}.`}>
      <Content mt={-8}>
        <StudentHeader anonymous student={student} />
        <Grid templateColumns="3fr 1fr" gap={8}>
          <StudentApplication student={student} />
          <RatingControls
            student={student}
            track={queue.track}
            onTrackChange={queue.setTrack}
            recommendedTrack={queue.recommendedTrack}
            onRecommendedTrackChange={queue.setRecommendedTrack}
            rating={queue.rating}
            onRatingChange={queue.setRating}
            onSkip={queue.skip}
            onSubmit={() => queue.submit(student)}
          />
        </Grid>
      </Content>
    </Page>
  );
}
