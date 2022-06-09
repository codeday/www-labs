import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import nl2br from 'react-nl2br';
import { Box, Divider, Text, Heading, Link } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../../components/Page';
import { MentorProjectsQuery } from './track.gql';

export default function Mentor({ projects, track }) {
  const title = `${track[0].toUpperCase()}${track.slice(1)} Project Examples`;
  return (
    <Page slug={`/mentor/projects/${track}`} title={title}>
      <Content mt={-8}>
        <Heading as="h2">{title}</Heading>
        {!projects || projects.length === 0 ? (
          <Text>No projects to display, check back later.</Text>
        ) : (
          projects.map((project) => (
            <Box>
              <Divider mt={8} mb={8} />
              <Heading as="h3" fontSize="lg">
                <Link href={`https://showcase.codeday.org/project/${project.id}`} target="_blank" rel="noopener">
                  {project.name}
                </Link>
            </Heading>
              <Text>{nl2br(project.description)}</Text>
            </Box>
          ))
        )}
      </Content>
    </Page>
  );
}

export function getStaticPaths() {
  return {
    paths: [{ params: { track: 'beginner' }}, { params: { track: 'advanced'}}],
    fallback: false,
  }
}

export async function getStaticProps({ params: { track } }) {
  const data = await apiFetch(print(MentorProjectsQuery));
  const projects = (data?.showcase?.projects || []).filter((p) => p.track === track);

  return {
    props: {
      track,
      projects,
      random: Math.random(),
    },
    revalidate: 240,
  };
}

