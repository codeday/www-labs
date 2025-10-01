import nl2br from 'react-nl2br';
import { Box, Grid, Text, Heading, List, ListItem as Item } from '@codeday/topo/Atom';

export default function Comparison({ leftTop, rightTop, leftBottom, rightBottom, factors, ...props }) {
  const rotatedFactors = factors.reduce((accum, factor) => ({
      left: [...accum.left, { title: factor.title, content: factor.left }],
      right: [...accum.right, { title: factor.title, content: factor.right }],
    }), {left: [], right: []});

  return (
    <Box {...props}>
      {/* Desktop View */}
      <Box display={{ base: 'none', md: 'block' }} mb={8}>
        <Grid templateColumns="1fr 1fr" gap={8}>
          <Box>{leftTop}</Box>
          <Box>{rightTop}</Box>
        </Grid>
        {factors.map(({ title, left, right }) => (
          <Box mb={4}>
            <Grid templateColumns="1fr 1fr" gap={8}>
              <Box>
                <Heading as="h4" fontSize="md" fontWeight="bold" mb={2}>{title}</Heading>
                <Text>{nl2br(left)}</Text>
              </Box>
              <Box>
                <Heading as="h4" fontSize="md" fontWeight="bold" mb={2}>{title}</Heading>
                <Text>{nl2br(right)}</Text>
              </Box>
            </Grid>
          </Box>
        ))}
        <Grid templateColumns="1fr 1fr" gap={8}>
          <Box>{leftBottom}</Box>
          <Box>{rightBottom}</Box>
        </Grid>
      </Box>

      {/* Mobile View */}
      {[
        { _: 'left', top: leftTop, bottom: leftBottom, elem: rotatedFactors.left },
        { _: 'right', top: rightTop, bottom: rightBottom, elem: rotatedFactors.right }
      ].map(({ top, bottom, elem, _ }) => (
          <Box display={{ base: 'block', md: 'none' }} mb={8} key={_}>
            {top}
            <List styleType="disc" stylePos="outside" p={4}>
              {elem.map((factor) => (
                <Item key={factor.title}>
                  <Text bold as="span">{factor.title}:</Text> {factor.content}
                </Item>
              ))}
            </List>
            {bottom}
          </Box>
        ))}
    </Box>
  )
}
