import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { useState } from 'react';
import Box from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Image from '@codeday/topo/Atom/Image';
import CognitoForm from '@codeday/topo/Molecule/CognitoForm';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import { useAnalytics } from '@codeday/topo/utils';
import Page from '../../components/Page';
import { useProgramDates } from '../../providers';
import { ApplyQuery } from './apply.gql';
import { DateTime } from 'luxon';

export default function MentorApplyPage () {
  const { goal } = useAnalytics();
  const [hasStarted, setHasStarted] = useState(false);
  const { mentorApplicationWarningAt, mentorApplicationEndsAt } = useProgramDates();

  return (
    <Page slug="/mentor/apply" title="Mentor Application">
      <Content>
        <Image
          width="100%"
          maxHeight="300px"
          borderRadius="md"
          marginBottom={4}
          src="https://img.codeday.org/w=1024;h=300;fit=crop;crop=faces,edges/w/v/wvs5jzy36vt5hw1y71pnn7hsfupbh2v9ew3v7fc4z9otg265zzejg9iq97an9aszfa.jpg"
        />
        <Heading as="h2" size="xl" marginBottom={3}>Mentor Application</Heading>
        {mentorApplicationEndsAt < DateTime.local() ? (
          <>
            <Text>The mentor application is now closed. Check back for a future cycle of CodeDay Labs.</Text>
          </>
        ) : (
          <>
            {mentorApplicationWarningAt < DateTime.local() && (
              <Box bg="orange.50" borderColor="orange.200" borderWidth={2} borderRadius={2} p={4} mb={4} color="orange.800">
                <Heading as="h3" fontSize="lg" mb={4}>CodeDay Labs starts soon!</Heading>
                <Text>
                  It's not too late to become a mentor, but we'll need to complete an onboarding call to discuss your project
                  quickly. Please keep a close eye on your email after submitting.
                </Text>
              </Box>
            )}
            <CognitoForm
              formId="57"
              onFirstPageChange={() => { goal('VA6TNIKN'); setHasStarted(true); }}
              onSubmit={() => { goal('FQKVLN2E'); window.location = '/mentor/share?applied'; } }
            />
          </>
        )}
      {hasStarted && (
        <img
          height="1"
          width="1"
          style={{ 'display': 'none' }}
          alt=""
          src="https://px.ads.linkedin.com/collect/?pid=1831116&fmt=gif"
        />
      )}
      </Content>
    </Page>
  );
};

export async function getStaticProps() {
  const data = await apiFetch(print(ApplyQuery));

  return {
    props: {
      query: data || {},
      random: Math.random(),
    },
    revalidate: 240,
  };
}

