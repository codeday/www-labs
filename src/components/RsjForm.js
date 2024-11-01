import { Form } from '@rjsf/chakra-ui';
import { ChakraProvider, Heading, extendTheme, useTheme } from '@chakra-ui/react';
import { Box } from '@codeday/topo/Atom';
import validator from '@rjsf/validator-ajv8';
import ReactMarkdown from 'react-markdown';


function FieldTemplate(props) {
  const {classNames, help, description, rawErrors, children, schema} = props;
  const errorText = rawErrors
  ?.map?.(e => e === 'is a required property' ? 'required' : e)
  ?.join?.(';')
  return (
    <Box className={classNames} mb={4}>
      {children}
      <Box fontSize="sm" color="gray.500">
        {schema.type !== 'object' ? description : null}
        {help}
        <Box color="red.600">{errorText}</Box>
      </Box>
    </Box>
  );
}

function ObjectFieldTemplate(props) {
  return (
    <div>
      <Heading as="h5" mt={8} mb={2} fontSize="lg">{props.title}</Heading>
      {props.description && (
        <Box>
          <ReactMarkdown className="markdown">{props.description.replace(/\n/g, `  \n`)}</ReactMarkdown>
        </Box>
      )}
      <Box
        m={props.title ? 4 : 0}
        mb={props.title ? 8 : 0}
        pl={props.title ? 4 : 0}
        borderLeftWidth={props.title ? 2 : 0}
      >
        {props.properties.map(element => <div className="property-wrapper">{element.content}</div>)}
      </Box>
    </div>
  );
}

export default function RsjForm({ ...props }) {
  
  const baseTheme = useTheme();
  const theme = extendTheme(
    baseTheme,
    {
      components: {
        FormLabel: {
          baseStyle: {
            fontWeight: '600',
            mb: 1,
          }
        },
      },
    },
  );

  return (
  <ChakraProvider theme={theme}>
    <Form
      FieldTemplate={FieldTemplate}
      ObjectFieldTemplate={ObjectFieldTemplate}
      validator={validator}
      {...props}
    />
  </ChakraProvider>
  );
}