import { print } from 'graphql';
import { useEffect } from 'react';
import Content from '@codeday/topo/Molecule/Content';
import Text from '@codeday/topo/Atom/Text';
import Spinner from '@codeday/topo/Atom/Spinner';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import { StudentDashboardQuery } from './index.gql'

export default function Dashboard() {
  const { isValidating, data } = useSwr(print(StudentDashboardQuery));
  useEffect(() => {
    if (typeof window === 'undefined' || data?.labs?.student?.status !== 'ACCEPTED' ) return;
    if (
      !(data?.labs?.projects && data.labs.projects.length === 0)
      && !(data?.labs?.projectPreferences && data.labs.projectPreferences.length > 0)
    ) window.location = `${window.location.href}/matching`;
  }, [ data?.labs?.projects, data?.labs?.projectPreferences, typeof window ]);

  if (isValidating || !data?.labs?.student) return (
    <Page title="Student Dashboard">
      <Content textAlign="center">
        <Spinner />
      </Content>
    </Page>
  );

  if (data?.labs?.student?.status !== 'ACCEPTED') return (
    <Page title="Student Dashboard">
      <Content textAlign="center">
        <Text>Your dashboard will become available if you are accepted to CodeDay Labs.</Text>
      </Content>
    </Page>
  );

  if (
    (data?.labs?.projectPreferences && data.labs.projectPreferences.length > 0)
    && (!data?.labs?.projects || data.labs.projects.length === 0)
  ) return (
    <Page title="Student Dashboard">
      <Content textAlign="center">
        <Text>Your project preferences have been submitted! Check back once you've been matched.</Text>
      </Content>
    </Page>
  );

  return (
    <Page title="Student Dashboard">
      <Content>
        Welcome to CodeDay Labs!
      </Content>
    </Page>
  )
}
