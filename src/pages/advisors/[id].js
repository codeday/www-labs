import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import moment from 'moment-timezone';
import Box, { Grid, Content } from '@codeday/topo/Box';
import Text, { Heading, Link } from '@codeday/topo/Text';
import List, { Item as ListItem } from '@codeday/topo/List';
import Spinner from '@codeday/topo/Spinner';
import Button from '@codeday/topo/Button';
import Page from '../../components/Page';
import { getCareerAdvisors, getStudentOutstandingAdvisingRequests, getStudent } from '../../utils/airtable';

const typeColors = {
  Advising: 'orange',
  Interview: 'green',
  Resume: 'purple',
};

export const getServerSideProps = async ({ params: { id } }) => ({
  props: {
    id,
    student: await getStudent(id),
    myRequests: await getStudentOutstandingAdvisingRequests(id),
    careerAdvisors: await getCareerAdvisors(),
  },
});

const ResumeUpdate = ({ student, onResumeChanged }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [resume, setResume] = useState(student.Resume || null);
  const fileUploadRef = useRef();

  const uploadResume = async (file) => {
    setIsLoading(true);

    // eslint-disable-next-line no-undef
    const data = new FormData();
    data.append('id', student.id);
    data.append('file', file);

    try {
      const result = await axios.post('/api/resume', data, { responseType: 'text' });
      setResume(result.data);
      onResumeChanged(result.data);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <Box
      borderRadius={2}
      borderColor={`${resume ? 'blue' : 'red'}.200`}
      borderWidth={1}
      bg={`${resume ? 'blue' : 'red'}.50`}
      color={`${resume ? 'blue' : 'red'}.900`}
      p={4}
      mb={4}
    >
      <Heading as="h3" mb={2} fontSize="md">Update Resume</Heading>
      <input
        style={{ display: 'none' }}
        ref={fileUploadRef}
        type="file"
        onChange={(e) => e.target.files[0] && uploadResume(e.target.files[0])}
      />

      {isLoading ? <Spinner /> : (
        <>
          {resume ? (
            <>
              <Link href={resume} target="_blank">Here&apos;s the resume we have on file.</Link>{' '}
              If you make changes, upload a new one <Text as="span" bold>before</Text> requesting a resume review.
            </>
          ) : (
            <Text>You don&apos;t have a resume on file! You need to upload one to request resume reviews.</Text>
          )}
          <Button onClick={() => fileUploadRef.current.click()}>Upload</Button>
        </>
      )}
    </Box>
  );
};
ResumeUpdate.propTypes = {
  student: PropTypes.object.isRequired,
  onResumeChanged: PropTypes.func,
};
ResumeUpdate.defaultProps = {
  onResumeChanged: () => {},
};

const AdvisorSignup = ({
  student, advisor, onLoading, onSubmit, hasResume,
}) => {
  const onClick = (type) => async () => {
    onLoading();
    try {
      await axios.post('/api/advisor', { id: student.id, advisor: advisor.id, type });
      onSubmit();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box padding={3} borderWidth={1} borderColor="gray.200">
      <Heading as="h3" fontSize="xl">{advisor.Name}</Heading>
      <Text mb={0}>{advisor.Title}</Text>
      <Text>{advisor.Employer}</Text>
      {advisor['Remaining Resumes'] > 0 && (
        <Button
          variant="outline"
          variantColor={typeColors.Resume}
          size="sm"
          mb={1}
          d="block"
          onClick={onClick('Resume')}
          disabled={!hasResume}
        >
          Resume Feedback (Email)
        </Button>
      )}
      {advisor['Remaining Interviews'] > 0 && (
        <Button
          variant="outline"
          variantColor={typeColors.Interview}
          size="sm"
          mb={1}
          d="block"
          onClick={onClick('Interview')}
        >
          Practice Tech Interview (Call)
        </Button>
      )}
      {advisor['Remaining Advising'] > 0 && (
        <Button
          variant="outline"
          variantColor={typeColors.Advising}
          size="sm"
          mb={1}
          d="block"
          onClick={onClick('Advising')}
        >
          Application Advising (Call)
        </Button>
      )}
    </Box>
  );
};
AdvisorSignup.propTypes = {
  student: PropTypes.object.isRequired,
  advisor: PropTypes.object.isRequired,
  onLoading: PropTypes.func,
  onSubmit: PropTypes.func,
  hasResume: PropTypes.bool,
};
AdvisorSignup.defaultProps = {
  onLoading: () => {},
  onSubmit: () => {},
  hasResume: false,
};

const PastRequests = ({ requests }) => (
  <Box mb={8} mt={8}>
    <Heading as="h3" fontSize="2xl" mb={4}>Past Requests</Heading>
    <List styleType="disc">
      {requests.map((request) => (
        <ListItem>
          {moment.utc(request.Created).tz('America/Los_Angeles').format('MMMM D, YYYY')}:{' '}
          {request.Advisor.Name}, {request.Advisor.Title} at {request.Advisor.Employer}{' '}
          ({request.Advisor.Email}) &mdash;{' '}
          <Text as="span" bold color={`${typeColors[request.Type]}.500`}>{request.Type}</Text>
        </ListItem>
      ))}
    </List>
  </Box>
);
PastRequests.propTypes = {
  requests: PropTypes.array.isRequired,
};

export default function StudentPrep({
  id, student, myRequests, careerAdvisors,
}) {
  const startOfDay = moment.utc().tz('America/Los_Angeles').startOf('day');

  const [isLoading, setIsLoading] = useState(false);
  const [hasUsedDailyRequest, setHasUsedDailyRequest] = useState(
    myRequests.reduce((accum, r) => accum || (r.Created && moment.utc(r.Created).isAfter(startOfDay)), false)
  );
  const [hasResume, setHasResume] = useState(Boolean(student.Resume));

  if (!student) {
    return (
      <Page slug={`/prep/${id}`} title="Advisor Request">
        <Content>
          <Heading as="h2" fontSize="2xl">Not Found</Heading>
        </Content>
      </Page>
    );
  }

  if (hasUsedDailyRequest) {
    return (
      <Page slug={`/advisors/${id}`} title="Advisor Request">
        <Content>
          <Heading as="h2" fontSize="2xl">You have used today&apos;s request.</Heading>
          <Text fontSize="xl">
            You can request one resume review or practice interview each day. (Resets midnight PT.)
          </Text>
          {myRequests && myRequests.length > 0 && <PastRequests requests={myRequests} />}
        </Content>
      </Page>
    );
  }

  return (
    <Page slug={`/advisors/${id}`} title="Advisor Request">
      <Content>
        <Heading as="h2" fontSize="4xl">Welcome {student['First Name']}!</Heading>
        <Grid templateColumns={{ base: '1fr', md: '3fr 1fr' }} gap={2}>
          <Box>
            <Text fontSize="xl">
              You can use this page to request feedback from professionals who make hiring decisions for their company.
              Immediately after you submit your request, we will introduce you over email.
            </Text>
            <Text>
              <Text as="span" bold>Resume Feedback:</Text> We&apos;ll send your resume to your selected advisor, and
              they&apos;ll reply with feedback and recommendations.
            </Text>
            <Text>
              <Text as="span" bold>Practice Technical Interview:</Text> We&apos;ll connect you to your selected advisor
              to set up a 15-30 minute practice coding interview.
            </Text>
            <Text>
              <Text as="span" bold>Application Advising Call:</Text> These advisors make hiring decisions daily.
              We&apos;ll connect you to set up a 15-30 minute call to learn about the application and interview process,
              and get advice on how to stand out.
            </Text>
            <Text color="red.700" bold>Limit one request each day (resets at midnight, pacific time).</Text>
            <Text color="red.700" bold>We will send introduction emails to {student.Email}</Text>
          </Box>
          <Box>
            <ResumeUpdate student={student} onResumeChanged={() => setHasResume(true)} />
          </Box>
        </Grid>

        {myRequests && myRequests.length > 0 && <PastRequests requests={myRequests} />}

        <Heading as="h3" fontSize="2xl" mb={4}>Available Advisors</Heading>
        {isLoading ? <Spinner /> : (
          <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={2}>
            {careerAdvisors
              .filter((advisor) => (
                advisor['Remaining Resumes'] || advisor['Remaining Interviews'] || advisor['Remaining Advising']
              ))
              .map((advisor) => (
                <AdvisorSignup
                  key={advisor.id}
                  student={student}
                  advisor={advisor}
                  onLoading={() => setIsLoading(true)}
                  onSubmit={() => setHasUsedDailyRequest(true)}
                  hasResume={hasResume}
                />
              ))}
          </Grid>
        )}
      </Content>
    </Page>
  );
}
StudentPrep.propTypes = {
  id: PropTypes.string.isRequired,
  student: PropTypes.object.isRequired,
  myRequests: PropTypes.array.isRequired,
  careerAdvisors: PropTypes.array.isRequired,
};
