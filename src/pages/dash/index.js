import { useEffect, useMemo } from 'react';
import useSwr from 'swr';
import fetch from 'node-fetch';
import { signIn } from 'next-auth/client'
import { Box, Text, Button, Spinner, Divider, Heading } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../components/Page';
import RequestLoginLink from '../../components/Dashboard/RequestLoginLink';

const sectionNames = { a: 'Admin', mm: 'Staff', r: 'Reviewer', m: 'Mentor', s: 'Student' };

export default function DashboardLogin() {
  const { isValidating, data } = useSwr(
    '/api/dashRedirect',
    (url) => fetch(url).then((r) => r.json())
  );

  const result = useMemo(() => {
    if (data && Object.keys(data).length > 0) {
      return Object.entries(data).map(([title, tokens]) => (
        <Box mb={4}>
          <Heading as="h3" fontSize="2xl">{title}</Heading>
          {Object.entries(tokens).filter(([_, token]) => !!token).map(([k, token]) => (
            <Button key={k} mr={2} as="a" href={`/dash/${k}/${token}`}>{sectionNames[k]}</Button>
          ))}
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
  }, [isValidating, data]);

  return (
    <Page slug={`/dash`} title={`Dashboard`}>
      <Content>
        <Box textAlign="center" maxWidth="container.sm" margin="0 auto">
          {result}
          <Divider mt={8} mb={8} />
          <Text mb={4}>
            Mentors: enter your email to receive a login link.
          </Text>
          <RequestLoginLink />
        </Box>
      </Content>
    </Page>
  );
}
