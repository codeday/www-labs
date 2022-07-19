import { Box, Text, List, ListItem } from '@codeday/topo/Atom';

function filter(key) {
  const lowerkey = key.toLowerCase();
  return true;
}

export default function SurveyFields({ content, ...rest }) {
  return (
    <Box {...rest}>
      {Object.keys(content)
        .filter(filter)
        .filter((k) => Boolean(content[k]) && (!Array.isArray(content[k]) || content[k].length > 0))
        .map((k) => (
          <Box key={k} mb={4}>
            <Text textTransform="uppercase" fontSize="sm" fontWeight="bold" color="gray.600">
              {k
                .replace(/_/g, ' ')
                .replace(/([a-z](?=[A-Z]))/g, '$1 ')
              }
            </Text>
            {Array.isArray(content[k])
              ? (
                <List listStyleType="disc" pl={8}>
                  {content[k].map((e, i) => (
                    <ListItem key={i}>
                      {typeof e === 'object' ? <SurveyFields content={e} /> : e.toString()}
                    </ListItem>
                  ))}
                </List>
              )
              : (
                typeof content[k] === 'object' ? <SurveyFields content={content[k]} /> : <Text>{content[k].toString()}</Text>
              )
            }
          </Box>
      ))}
    </Box>
  )
}
