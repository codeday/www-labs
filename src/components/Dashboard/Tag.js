import Box from '@codeday/topo/Atom/Box';

export const Tag = ({ tag, featured }) => (
  <Box
    borderRadius={4}
    d="inline"
    p={2}
    mr={2}
    fontWeight={featured ? 'bold' : undefined}
    color={featured ? 'purple.800' : 'current.textLight'}
    bg={featured ? 'puple.50' : 'white'}
    borderColor={featured ? 'purple.800' : 'gray.100'}
    borderWidth={2}
    style={{ whiteSpace: 'nowrap' }}
    >
      {tag.studentDisplayName}
    </Box>
);

export const TagList = ({ tags, featured: featuredObj }) => {
  const featured = featuredObj?.map((f) => f.id);

  return <Box d="inlineBlock" lineHeight={3}>
    {
      (tags || [])
        .sort((a, b) => {
          if (featured.includes(a) && !featured.includes(b)) return -1;
          if (featured.includes(b) && !featured.includes(a)) return 1;
          return 0;
        })
        .map((tag) => <><Tag key={tag.id} tag={tag} featured={featured && featured.includes(tag.id)} />{' '}</>)
    }
  </Box>
}
