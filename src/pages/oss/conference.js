import { useState } from 'react';
import { Box, Grid, Button, Image, Text, Heading, Link, List, ListItem as Item } from '@codeday/topo/Atom';
import { CognitoForm, Content } from '@codeday/topo/Molecule';
import Page from '../../components/Page';
import { useColorModeValue } from '@codeday/topo/Theme';
import { useToasts } from '@codeday/topo/utils';

export default function Mentor() {
  const { success } = useToasts();
  const [selectedType, setSelectedType] = useState('');

  const titles = {
    '': 'Which best describes you?',
    'mentor': 'Help students find their place in tech!',
    'oss': 'Recruit new contributors to your OSS project!',
  };

  const formIds = {
    'mentor': 98,
    'oss': 111,
  }

  return (
    <Page slug="/oss/conference" title="OSS Project Signup">
      <Content mt={-8}>
        <Box mb={8}>
          <Heading as="h2" size="xl">{titles[selectedType]}</Heading>
          {selectedType && <Link onClick={() => setSelectedType('')} mt={-8} mb={8}>&laquo; Back</Link>}
        </Box>
        {selectedType
          ? (
            <CognitoForm
              prefill={{ Roles: ['mentor'], Backgrounds: ['industrySde'], Programs: ['labs'] }}
              formId={formIds[selectedType]}
              onSubmit={() => {success('Thank you!'); setSelectedType('');}}
            />
          ) : (
            <Grid mt={24} mb={24} textAlign="center" templateColumns={{ base: '1fr', md: '1fr 1fr'}} gap={8} fontSize="xl" fontWeight="bold">
              <Link onClick={() => setSelectedType('mentor')}>Mentor</Link>
              <Link onClick={() => setSelectedType('oss')}>OSS Maintainer</Link>
            </Grid>
          )
        }
      </Content>
    </Page>
  );
}