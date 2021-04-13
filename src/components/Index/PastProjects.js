import nl2br from 'react-nl2br';
import Box, { RatioBox, Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import MediaPlay from '@codeday/topocons/Icon/MediaPlay';
import { useQuery, useShuffled } from '../../providers';

const MAX_PROJECTS = 3;
const BG_COLORS = {
  beginner: 'indigo.700',
  advanced: 'teal.700',
  default: 'gray.700',
};

function fixDescription(description) {
  return description
    .split(`\n`)
    .filter((line) => !line.startsWith('Mentor: '))
    .filter((line) => !line.startsWith('Team members: '))
    .join(`\n`)
    .trim();
}

export default function PastProjects(props) {
  const projects = useShuffled(useQuery('showcase.pastProjects', [])).filter(Boolean);

  if (projects.length === 0) return <></>;

  // We'll always show 2/3 advanced projects, and 1/3 beginner projects.
  const advancedProjects = projects.filter((project) => project.track === 'advanced')
    .slice(0, Math.round(MAX_PROJECTS * 0.66));
  const beginnerProjects = projects.filter((project) => project.track === 'beginner')
    .slice(0, Math.round(MAX_PROJECTS * 0.33));

  const displayProjects = useShuffled([...advancedProjects, ...beginnerProjects]);

  return (
    <Content {...props}>
      <Heading as="h3" fontSize="4xl" textAlign="center">Past Student Projects</Heading>
      <Text mb={8} textAlign="center"><Link href="https://showcase.codeday.org/projects/labs">See All</Link></Text>

      {displayProjects.filter(Boolean).map((project) => (
        <Grid
          as="a"
          href={`https://showcase.codeday.org/project/${project.id}`}
          target="_blank"
          rel="noopener"
          templateColumns={{ base: '1fr', md: '1fr 2fr' }}
          gap={8}
          mb={4}
          textAlign={{ base: 'center', md: 'left' }}
          borderWidth={1}
          p={8}
          rounded="sm"
          shadow="sm"
        >
          <RatioBox
            backgroundImage={`url(${project.media[0].image})`}
            backgroundSize="cover"
            backgroundPosition="50% 50%"
            w={16}
            h={10}
            width="100%"
            maxWidth={{ base: 64, md: 'none' }}
            auto="h"
            margin="0 auto"
            autoDefault={500}
            position="relative"
          >
            <Box
              position="absolute"
              top="50%"
              left={0}
              right={0}
              mt={-4}
              fontSize={"xl"}
              textAlign="center"
            >
              <Box d="inline-block" rounded="sm" p={6} pt={2} pb={2} bg="rgba(0, 0, 0, 0.5)" color="white">
                <MediaPlay />
              </Box>
            </Box>
          </RatioBox>

          <Box
            position="relative"
            height={48}
            overflow="hidden"
          >
            <Heading as="h4" fontSize="xl">
              {project.name}
              <Box
                ml={2}
                p={2}
                pt={1}
                pb={1}
                position="relative"
                top="-3px"
                color="white"
                bg={BG_COLORS[project.track] || BG_COLORS['default']}
                d="inline-block"
                rounded="sm"
                fontSize="md"
              >
                {project.track[0].toUpperCase()}{project.track.slice(1)} Track
              </Box>
            </Heading>
            <Text>Mentor: {project.mentorName}, {project.mentorTitle} at {project.mentorCompany}</Text>
            <Text>{nl2br(fixDescription(project.description))}</Text>

            <Box
              position="absolute"
              bottom={0}
              left={0}
              right={0}
              p={8}
              backgroundImage="linear-gradient(to bottom, rgba(255, 255, 255 ,0), rgba(255, 255, 255 ,1))"
            />
          </Box>
        </Grid>
      ))}
    </Content>
  )
}
