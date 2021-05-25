import { print } from 'graphql';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Spinner from '@codeday/topo/Atom/Spinner';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import MentorProfile from '../../../../components/Dashboard/MentorProfile';
import ProjectEditor from '../../../../components/Dashboard/ProjectEditor';
import { MentorPageQuery } from './mentor.gql';

export default function MentorDashboard({ id }) {
  const { loading, error, data } = useSwr(print(MentorPageQuery), { id });
  if (!data?.labs?.mentor) return <Page title="Mentor Dashboard"><Content><Spinner /></Content></Page>
  const mentor = data.labs.mentor;

  return (
    <Page title={mentor.name}>
      <Content mt={-8}>
        <MentorProfile mentor={mentor} />
        <Heading as="h2" fontSize="3xl" mt={8} mb={4}>
          Project{data.labs.mentor.projects.length !== 1 ? 's' : ''}
        </Heading>
        {data?.labs?.mentor?.projects && (
          <>
            {data?.labs?.mentor?.projects?.map((project) => (
              <ProjectEditor tags={data.labs.tags} project={project} />
            ))}
          </>
        )}
      </Content>
    </Page>
  );
}

export function getServerSideProps({ query: { mentor } }) {
  return { props: { id: mentor } };
}
