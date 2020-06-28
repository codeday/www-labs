import { useState } from 'react';
import Box, { Grid, Content } from '@codeday/topo/Box';
import Text, { Heading, Link } from '@codeday/topo/Text';
import List, { Item as ListItem } from '@codeday/topo/List';
import str_shorten from 'str_shorten';
import Page from '../components/Page';
import { getProjects } from '../utils/airtable';

const nl2br = (str) => str && str
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\n/g, '<br />')
  .replace(/(https?:\/\/[^\s\(\)\<\>]+)/g, (url) => `<a href="${url}" style="text-decoration: underline" target="_blank">${url}</a>`);

export const getServerSideProps = async () => {
  return {
    props: {
      projects: await getProjects(),
    }
  }
}

const ProjectBox = ({ project }) => {
  const [showMore, setShowMore] = useState(false);

  const truncatedDescription = str_shorten(project.Description, 140);

  return (
    <Box borderColor="gray.100" borderWidth={2} borderRadius={2} p={4}>
      <Box mb={2}>
          {project.Mentors.map((mentor) => (
            <Heading as="h3" fontSize="lg">
              {mentor.Name}{' '}
              {mentor.Company && (
                <Text fontWeight="400" as="span" color="gray.800" fontSize="sm">({mentor.Company})</Text>
              )}
            </Heading>
          ))}
        <Text fontSize="sm" color="gray.800" mb={1}>
        </Text>
        {project.Team && project.Team.length > 0 && (
          <Text fontSize="sm" bold>
            With {project.Team.map((student) => student['Display Name']).join(', ')}
          </Text>
        )}
      </Box>
      <Text>
        <Text
          as="span"
          dangerouslySetInnerHTML={{ __html: nl2br(showMore ? project.Description : truncatedDescription) }}
        />{' '}
        {truncatedDescription !== project.Description && !showMore && (
          <Link fontSize="sm" color="blue.500" onClick={() => setShowMore(true)}>(more)</Link>
        )}
      </Text>
    </Box>
  )
}

export default ({ projects }) => (
  <Page slug="/gallery" title="Projects Gallery">
    <Content maxWidth="containers.xl">
      <Heading as="h2" fontSize="3xl" mb={4}>Advanced</Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
        {projects.filter((project) => project.Track[0] === 'Advanced').map((project) => <ProjectBox project={project} />)}
      </Grid>

      <Heading as="h2" fontSize="3xl" mb={4} mt={16}>Beginner</Heading>
      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
        {projects.filter((project) => project.Track[0] === 'Beginner').map((project) => <ProjectBox project={project} />)}
      </Grid>
    </Content>
  </Page>
);
