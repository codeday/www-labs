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
import UiWarning from '@codeday/topocons/Icon/UiWarning';
import ShootingStar from '@codeday/topocons/Icon/ShootingStar';
import UiUpload from '@codeday/topocons/Icon/UiUpload';
import Page from '../../../../components/Page';
import { Icon } from '@chakra-ui/react';
import { BulkImportStudents, ImportMatches } from './index.gql';
import { apiFetch, useToasts } from '@codeday/topo/utils';
import { useRef } from 'react';

function ActionButton({ icon, href, children, ...rest }) {
  return (
    <Button
      as="a"
      href={href}
      {...rest}
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
  const matchesUploadRef = useRef(null);
  const studentsUploadRef = useRef(null);
  const toast = useToasts();

  return (
    <Page title="Admin Dashboard">
      <Content>
        <Grid
          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }}
          gap={4}
        >
          <input
            ref={matchesUploadRef}
            type="file"
            accept="text/csv"
            onChange={async (e) => {
              if (e.target.files.length > 0) {
                try { 
                  await apiFetch(ImportMatches, { file: e.target.files[0] }, { 'X-Labs-Authorization': `Bearer ${query.token}` });
                  toast.success('Matches imported successfully');
                } catch (error) {
                  toast.error(error.toString());
                }
              }
            }}
            style={{ display: 'none' }}
          />
          <input
            ref={studentsUploadRef}
            type="file"
            accept="text/csv"
            onChange={async (e) => {
              if (e.target.files.length > 0) {
                try { 
                  await apiFetch(BulkImportStudents, { file: e.target.files[0] }, { 'X-Labs-Authorization': `Bearer ${query.token}` });
                  toast.success('Students imported successfully');
                } catch (error) {
                  toast.error(error.toString());
                }
              }
            }}
            style={{ display: 'none' }}
          />
          <ActionButton icon={FaceVeryHappy} href={`/dash/a/${query.token}/admit`}>Admissions</ActionButton>
          <ActionButton icon={Agreement} href={`/dash/a/${query.token}/partner`}>Partner Admissions</ActionButton>
          <ActionButton icon={ShootingStar} href={`/dash/a/${query.token}/partners`}>Partners</ActionButton>
          <ActionButton icon={UiWarning} href={`/dash/a/${query.token}/activities`}>Activities</ActionButton>
          <ActionButton icon={Email} href={`/dash/a/${query.token}/email`}>Send Email</ActionButton>
          <ActionButton icon={FileDoc} href={`/dash/a/${query.token}/csv`}>Admitted CSV</ActionButton>
          <ActionButton icon={Goal} href={`/api/matchingPrefs?token=${query.token}`}>Matching Prefs</ActionButton>
          <ActionButton icon={HeadGroup} href={`/api/projectCapacities?token=${query.token}`}>Matching Capacities</ActionButton>
          <ActionButton icon={UiTrash} href={`/dash/a/${query.token}/delete`}>Delete Mentor</ActionButton>
          <ActionButton icon={Bolt} href={`/dash/a/${query.token}/clone`}>Clone</ActionButton>
          <ActionButton icon={Bolt} href={`/dash/a/${query.token}/match`}>Match Board</ActionButton>
          <ActionButton icon={UiUpload} onClick={() => studentsUploadRef.current?.click()}>Bulk Import Students</ActionButton>
          <ActionButton icon={UiUpload} onClick={() => matchesUploadRef.current?.click()}>Import Matches</ActionButton>
        </Grid>
      </Content>
    </Page>
  );
}
