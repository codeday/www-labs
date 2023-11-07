import { Box, Heading, Image, Text } from '@codeday/topo/Atom';
import Ticker from 'react-ticker';

import PageVisibility from 'react-page-visibility';
import { useInView } from 'react-intersection-observer';
import { useQuery, useShuffled } from '../../providers';
import { useEffect, useState } from 'react';

function ContributionDetails({ name, logoUrl, url, projectCount}) {
  return (
    <Box pl={4} pr={4}>
      <Box
        as="a"
        display="block"
        href={url}
        target="_blank"
        w={48}
        h={48}
        p={2}
        textAlign="center"
      >
        <Box h={20} w="100%" mb={4}>
          <Image
            src={logoUrl}
            maxW="100%"
            maxH="100%"
            display="inline-block"
          />
        </Box>
        <Text fontSize="sm">{projectCount} contribution{projectCount !== 1 ? 's' : ''} to</Text>
        <Text fontSize="md" pb={0} mb={0} fontWeight="bold">{name}</Text>
      </Box>
    </Box>

  )
}

export default function ProjectSlider(props) {
  const [pageIsVisible, setPageIsVisible] = useState(true);
  const { ref, inView } = useInView({ rootMargin: '200px' });

  const repositories = useQuery('labs.repositories', []);
  const repositoriesShuffled = useShuffled(repositories);
  
  return (
    <Box {...props}>
      <Heading as="h3" mb={6} textAlign="center" pl={4} pr={4}>
        Contribute to open-source software used by millions of people.
      </Heading>
      <PageVisibility onChange={setPageIsVisible}>
        <Box ref={ref}>
        {(pageIsVisible && inView)
          ? (
            <Box h={48}>
              <Ticker>
                {({ index }) => (
                  <ContributionDetails {...repositoriesShuffled[index % (repositoriesShuffled.length - 1)]} />
                )}
              </Ticker>
            </Box>
          )
          : <Box h={48} />
        }
        </Box>
      </PageVisibility>
    </Box>
  )
}