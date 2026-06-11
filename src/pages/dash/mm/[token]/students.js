import { useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { AgGridReact } from 'ag-grid-react';
import { Box, Grid, Heading, Button, Spinner } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../../../components/Page';
import CenteredMessagePage from '../../../../components/Dashboard/CenteredMessagePage';
import { useSwr } from '../../../../dashboardFetch';
import { DashboardStudents } from './students.gql';

const TITLE = 'Student Dashboard';

export default function StudentDashboard() {
  const { query } = useRouter();
  const { isValidating, data } = useSwr(print(DashboardStudents), {}, { refreshInterval: 1000 * 60 });
  const [lastUpdated, setLastUpdated] = useState(DateTime.local());
  useEffect(() => {
    if (!isValidating) setLastUpdated(DateTime.local());
  }, [isValidating]);

  const [gridApi, setGridApi] = useState(null);

  if (!data?.labs) return <CenteredMessagePage title={TITLE}><Spinner /></CenteredMessagePage>;

  const { sid: myUsername } = decode(query.token) || {};

  const students = !data?.labs?.mentors ? [] : data.labs.mentors
    .map(({ projects, ...m }) => projects.map((p, i) => ({ project: p, mentor: m, projCount: projects.length, i })))
    .flat()
    .map(({ project: { students, ...p }, ...rest }) => students.map((s) => ({ student: s, project: p, ...rest })))
    .flat()
    .filter(({ project, student }) => project.status === 'MATCHED' && student.status === 'ACCEPTED')
    .reduce((accum, s) => ({ [s.student.id]: s, ...accum }), {});

  const rows = Object.values(students)
    .map(({ student, mentor, project, i, projCount }) => ({
      projectId: project.id,
      studentId: student.id,
      manager: mentor.managerUsername,
      student: student.name,
      studentEmail: student.email,
      studentPhone: student.profile?.phone,
      partnerCode: student.partnerCode,
      mentorEmail: mentor.email,
      mentorPhone: mentor.profile?.phone,
      weeks: student.weeks,
      projectTrack: project.track,
      studentTrack: student.track,
      maxWeeks: mentor.maxWeeks,
      mentor: projCount > 1 ? `${mentor.name} (${i+1}/${projCount})` : mentor.name,
      trainingCount: student.tagTrainingSubmissions.length,
      training: student.tagTrainingSubmissions.map((s) => s.tag.mentorDisplayName).join(', '),
      schoolYear: student.profile?.schoolYear,
      ethnicity: student.profile?.ethnicity,
      pronouns: student.profile?.pronouns,
    }));

  return (
    <Page title={TITLE}>
      <Content mt={-8}>
        <Button as="a" href={`/dash/mm/${query.token}`} mb={8}>&laquo; Back</Button>
        <Grid templateColumns={{ base: '1fr', md: '2fr 1fr' }}>
          <Box mb={4}>
            <Heading as="h2" fontSize="3xl">Mentor Manager Dashboard</Heading>
            <Button size="sm" mt={4} onClick={() => gridApi.exportDataAsCsv()}>Download CSV</Button>
          </Box>
          <Box textAlign="right">
            {isValidating ? <Spinner /> : (
              <>
                Updated {lastUpdated.toLocaleString({
                  day: 'numeric',
                  month: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric'
                })}
              </>
            )}
          </Box>
        </Grid>
      </Content>
      <Content maxWidth="100%">
        <div className="ag-theme-alpine" style={{height: 700, width: '100%'}}>
          <AgGridReact
            onGridReady={(params) => {
              setGridApi(params.api);
            }}
            rowData={rows}
            defaultColDef={{
              width: 150,
              editable: true,
              filter: 'agTextColumnFilter',
              floatingFilter: true,
              resizable: true,
            }}
            columnDefs={[
              { field: 'manager', sortable: true, filter: 'agTextColumnFilter' },
              { field: 'mentor', sortable: true, filter: 'agTextColumnFilter' },
              { field: 'mentorEmail' },
              { field: 'projectId' },
              { field: 'studentId' },
              { field: 'mentorPhone' },
              { field: 'projectTrack', sortable: true },
              { field: 'student', filter: 'agTextColumnFilter' },
              { field: 'studentEmail' },
              { field: 'studentPhone' },
              { field: 'studentTrack', sortable: true },
              { field: 'partnerCode', sortable: true },
              { field: 'weeks', sortable: true },
              { field: 'maxWeeks', sortable: true },
              { field: 'trainingCount' },
              { field: 'training' },
              { field: 'schoolYear' },
              { field: 'ethnicity' },
              { field: 'pronouns' },
            ]}
          />
        </div>
      </Content>
    </Page>
  );
}
