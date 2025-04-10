import { Box, Text, List, ListItem } from '@codeday/topo/Atom';

export default function SurveyFields({ content, displayFn, inline, ...rest }) {

  const displayFnRunnable = displayFn
    ? (new Function(`{ return ${displayFn} }`)).call(null)
    : (a) => a;

  const renderedContent = Object.entries(displayFnRunnable({...content}))
    .filter(([, v]) => 
      Boolean(v)
      && (!Array.isArray(v) || v.length > 0)
      && (typeof v !== 'object' || Object.entries(v).length > 0)
    );

  return (
    <Box {...rest}>
      {renderedContent
        .map(([k, v]) => {
          let renderedVal = v;
          if (Array.isArray(v)) {
            if (inline) renderedVal = v.map((e, i) => (
              typeof e === 'object' ? <SurveyFields inline={inline} displayFn={displayFn} content={e} /> : e.toString()
            )).join(', ');
            else renderedVal = (
              <List listStyleType="disc" pl={8}>
                {v.map((e, i) => (
                  <ListItem key={i}>
                    {typeof e === 'object' ? <SurveyFields inline={inline} displayFn={displayFn} content={e} /> : e.toString()}
                  </ListItem>
                ))}
              </List>
            );
          }
          else if (typeof v === 'object') renderedVal = (
            <SurveyFields
              ml={4}
              mt={2}
              borderLeftWidth={2}
              borderLeftStyle="dotted"
              pl={4}
              content={v}
              inline={inline}
              displayFn={displayFn}
            />
          );
          if (inline) return (
            <Text>
              <b>
                {k
                  .replace(/_/g, ' ')
                  .replace(/([a-z](?=[A-Z]))/g, '$1 ')
                }:
              </b>
              {renderedVal}
            </Text>
          )

          return (
            <Box key={k} mb={4}>
              <Text textTransform="uppercase" fontSize="sm" fontWeight="bold" color="gray.600">
                {k
                  .replace(/_/g, ' ')
                  .replace(/([a-z](?=[A-Z]))/g, '$1 ')
                }
              </Text>
              {renderedVal}
            </Box>
          )
        })}
    </Box>
  )
}
