import { useEffect } from 'react';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import LinkedInTag from 'react-linkedin-insight';
import { apiFetch } from '@codeday/topo/utils';
import { Box, Grid, Button, Image, Text, Heading, Link, List, ListItem as Item } from '@codeday/topo/Atom';
import { CognitoForm, Content } from '@codeday/topo/Molecule';
import Page from '../../components/Page';
import { useProgramDates } from '../../providers';
import { IndexQuery } from './index.gql';
import { useColorMode } from '@codeday/topo/Theme';

export default function Mentor() {
  const { colorMode } = useColorMode();

  return (
    <Page slug="/oss/signup" title="OSS Project Signup">
      <Content mt={-8}>
        <Heading as="h2" size="xl">Recruit new contributors to your OSS project!</Heading>
        <CognitoForm formId={111} />
      </Content>
    </Page>
  );
}