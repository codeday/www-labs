import { AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/react';
import { Grid, Box } from '@codeday/topo/Atom';
import StatusEntryTypeBadge from './TypeBadge';
import StatusEntryStatusBadge from './StatusBadge';

export function StatusEntry({ date, type, caution, title, children, ...props }) {
  return (
    <AccordionItem {...props}>
      {({ isExpanded }) => (
        <Box
          shadow={isExpanded ? '2xl' : 'none'}
          borderColor={isExpanded ? 'inherit' : 'transparent'}
          borderLeftWidth={1}
          borderRightWidth={1}
        >
          <AccordionButton>
            <Grid
              textAlign="left"
              templateColumns="3fr 3fr 4fr 13fr"
              gap={1}
              w="100%"
              display={{ base: 'block', md: 'grid' }}
            >
              <Box
                display={{ base: 'inline', md: 'block' }}
                mr={{ base: 1, md: 0 }}
              >
                <StatusEntryStatusBadge
                  caution={caution}
                />
              </Box>
              <Box
                display={{ base: 'inline', md: 'block' }}
                mr={{ base: 2, md: 0 }}
              >
                <StatusEntryTypeBadge
                  type={type}
                />
              </Box>
              <Box
                display={{ base: 'inline', md: 'block' }}
                mr={{ base: 1, md: 0 }}
              >
                {date && <>{date.toLocaleString()}</>}
              </Box>
              <Box
                display={{ base: 'inline', md: 'block' }}
                mr={{ base: 1, md: 0 }}
              >
                {title}
              </Box>
            </Grid>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {children}
          </AccordionPanel>
        </Box>
      )}
    </AccordionItem>
  )
}