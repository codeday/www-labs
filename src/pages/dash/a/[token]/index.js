import { useRouter } from 'next/router';
import { Content } from '@codeday/topo/Molecule';
import { Box, Button, Grid, Link } from '@codeday/topo/Atom';
import UiTrash from '@codeday/topocons/Icon/UiTrash';
import Agreement from '@codeday/topocons/Icon/Agreement'
import FaceVeryHappy from '@codeday/topocons/Icon/FaceVeryHappy';
import FileDoc from '@codeday/topocons/Icon/FileDoc';
import Email from '@codeday/topocons/Icon/Email';
import Bolt from '@codeday/topocons/Icon/Bolt';
import Goal from '@codeday/topocons/Icon/Goal';
import HeadGroup from '@codeday/topocons/Icon/HeadGroup';
import Page from '../../../../components/Page';
import { Icon } from '@chakra-ui/react';

function ActionButton({ icon, href, children }) {
  return (
    <Button
      as="a"
      href={href}
    >
      <Icon as={icon} />
      <Box ml={1} display="inline-block">
        {children}
      </Box>
    </Button>
  )
}

export default function AdminDashboard() {
  const { query } = useRouter();
  return (
    <Page title="Admin Dashboard">
      <Content>
        <Grid
          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={4}
        >
          <ActionButton icon={FaceVeryHappy} href={`/dash/a/${query.token}/admit`}>Admissions</ActionButton>
          <ActionButton icon={Agreement} href={`/dash/a/${query.token}/partner`}>Partner Students</ActionButton>
          <ActionButton icon={FileDoc} href={`/dash/a/${query.token}/csv`}>Admitted CSV</ActionButton>
          <ActionButton icon={Email} href={`/dash/a/${query.token}/email`}>Send Email</ActionButton>
          <ActionButton icon={Goal} href={`/api/matchingPrefs?token=${query.token}`}>Matching Prefs</ActionButton>
          <ActionButton icon={HeadGroup} href={`/api/projectCapacities?token=${query.token}`}>Matching Capacities</ActionButton>
          <ActionButton icon={UiTrash} href={`/dash/a/${query.token}/delete`}>Delete Mentor</ActionButton>
          <ActionButton icon={Bolt} href={`/dash/a/${query.token}/clone`}>Clone</ActionButton>
        </Grid>
      </Content>
    </Page>
  );
}
