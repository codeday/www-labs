import { Box, RatioBox } from '@codeday/topo/Atom';
import { useShuffled, useQuery, useSlideshow } from '../providers';
import ProjectImagePreview from './ProjectImagePreview';

const MAX_PROJECTS = 10;

export default function ProjectFader({ duration, ...props }) {
  const projects = useShuffled(useQuery('showcase.faderProjects')).filter(Boolean).slice(0, MAX_PROJECTS);
  const i = useSlideshow(projects.length, duration);

  if (projects.length === 0) return <></>;

  return (
    <RatioBox
      position="relative"
      w={16}
      h={10}
      width="100%"
      auto="h"
      autoDefault={500}
      shadow="md"
      rounded="sm"
      overflow="hidden"
      {...props}
    >
      {projects.map((p, j) => (
        <Box
          key={p.id}
          position="absolute"
          top={0}
          opacity={i === j ? 1 : 0}
          zIndex={i === j ? 200 : null}
          w="100%"
          height="100%"
          transition="all 1s ease-in-out"
        >
          <ProjectImagePreview project={p} />
        </Box>
      ))}
    </RatioBox>
  );
}
