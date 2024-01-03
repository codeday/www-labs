import { useEffect, useMemo } from 'react';
import useSwr from 'swr';
import fetch from 'node-fetch';
import { signIn } from 'next-auth/client'
import { Box, Text, Button, Spinner, Divider, Heading, Grid } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../components/Page';
import RequestLoginLink from '../../components/Dashboard/RequestLoginLink';
import { useColorModeValue } from '@chakra-ui/react';

const sectionNames = { a: 'Admin', mm: 'Staff', r: 'Reviewer', m: 'Mentor', s: 'Student' };

export default function DashboardLogin() {
  const { isValidating, data } = useSwr(
    '/api/dashRedirect',
    (url) => fetch(url).then((r) => r.json())
  );

  const headerBg = useColorModeValue('gray.200', 'gray.900');
  const headerFg = useColorModeValue('gray.900', 'white');

  const result = useMemo(() => {
    if (data && Object.keys(data).length > 0) {
      return Object.entries(data).map(([title, tokens]) => (
        <Box rounded="sm" borderWidth={1}>
          <Heading
            p={2}
            as="h3"
            fontSize="lg"
            backgroundColor={headerBg}
            color={headerFg}
            roundedTop="sm"
          >
            {title}
          </Heading>
          <Box p={2}>
            {Object.entries(tokens).filter(([_, token]) => !!token).map(([k, token]) => (
              <Button
                key={k}
                mr={2}
                as="a"
                size="sm"
                href={`/dash/${k}/${token}`}
              >
                {sectionNames[k]}
              </Button>
            ))}
            {tokens.mm && (
              <Button
                colorScheme="green"
                mr={2}
                as="a"
                size="sm"
                href={`/dash/mm/${tokens.mm}/note`}
                color="green.900"
              >
                Add Student Note
              </Button>
            )}
          </Box>
        </Box>
      ));
    } else if (data) {
      return (<>Sorry, nothing is associated with your account.</>);
    } else if (isValidating) {
      return <Spinner />;
    } else {
      return (
        <>
          <Text mb={4}>
            Students/program staff: Log into your CodeDay account to continue.
          </Text>
          <Button
            onClick={() => signIn('auth0')}
            colorScheme="green"
            mb={2}
          >
            Sign In
          </Button>
        </>
      );
    }
  }, [isValidating, data, headerBg, headerFg]);

  return (
    <Page slug={`/dash`} title={`Dashboard`}>
          {Array.isArray(result) ? (
            <Content maxW="container.lg">
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                {result}
              </Grid>
            </Content>
          ) : <Content maxW="container.sm" textAlign="center">{result}</Content>}
        <Content maxW="container.sm">
          <Divider mt={8} mb={8} />
          <Text mb={4}>
            Mentors: enter your email to receive a login link.
          </Text>
          <RequestLoginLink />
      </Content>
    </Page>
  );
}
