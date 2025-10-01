import { Box, Text } from '@codeday/topo/Atom';

export default function ProjectImagePreview({ project }) {
  const bgImage = project.media.sort((m) => m.type === 'IMAGE' ? 1 : -1)[0].image;

  return (
    <Box
      as="a"
      display="block"
      href={`https://showcase.codeday.org/project/${project.id}`}
      target="_blank"
      rel="noopener"
      backgroundImage={bgImage && `url(${bgImage})`}
      backgroundSize="cover"
      backgroundPosition="50% 50%"
      backgroundRepeat="no-repeat"
      backgroundColor="gray.100"
      position="relative"
      width="100%"
      height="100%"
    >
      <Box
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        p={2}
        backgroundImage="linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))"
        color="white"
      >
        <Text mb={0} mt={2} fontSize="md" bold>{project.name}</Text>
        <Text mb={0} fontSize="sm">Mentor: {project.mentorName}, {project.mentorCompany}</Text>
      </Box>
    </Box>
  )
}
