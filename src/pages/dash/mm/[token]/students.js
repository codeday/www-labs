import { useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import Spinner from '@codeday/topo/Atom/Spinner';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import { DashboardStudents } from './students.gql';

export default function StudentDashboard() {
  const { query } = useRouter();
  const { isValidating, data } = useSwr(print(DashboardStudents), {}, { refreshInterval: 1000 * 60 });
  const [lastUpdated, setLastUpdated] = useState(DateTime.local());
  useEffect(() => {
    if (typeof window !== 'undefined' && !isValidating) setLastUpdated(DateTime.local());
  }, [typeof window, isValidating]);


  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  if (!data?.labs) return <Page title="Student Dashboard"><Content textAlign="center"><Spinner /></Content></Page>;

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
      manager: mentor.managerUsername,
      student: student.name,
      studentEmail: student.email,
      partnerCode: student.partnerCode,
      mentorEmail: mentor.email,
      weeks: student.weeks,
      projectTrack: project.track,
      studentTrack: student.track,
      maxWeeks: mentor.maxWeeks,
      mentor: projCount > 1 ? `${mentor.name} (${i+1}/${projCount})` : mentor.name,
      trainingCount: student.tagTrainingSubmissions.length,
      training: student.tagTrainingSubmissions.map((s) => s.tag.mentorDisplayName).join(', '),
    }));

  return (
    <Page title="Student Dashboard">
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
              setGridColumnApi(params.columnApi);
            }}
            rowData={rows}
            defaultColDef={{
              width: 150,
              editable: true,
              filter: 'agTextColumnFilter',
              floatingFilter: true,
              resizable: true,
            }}
          >
            <AgGridColumn field="manager" sortable={true} filter="agTextColumnFilter"></AgGridColumn>
            <AgGridColumn field="mentor" sortable={true} filter="agTextColumnFilter"></AgGridColumn>
            <AgGridColumn field="mentorEmail"></AgGridColumn>
            <AgGridColumn field="projectTrack" sortable={true}></AgGridColumn>
            <AgGridColumn field="student" filter="agTextColumnFilter"></AgGridColumn>
            <AgGridColumn field="studentEmail"></AgGridColumn>
            <AgGridColumn field="studentTrack" sortable={true}></AgGridColumn>
            <AgGridColumn field="partnerCode" sortable={true}></AgGridColumn>
            <AgGridColumn field="weeks" sortable={true}></AgGridColumn>
            <AgGridColumn field="maxWeeks" sortable={true}></AgGridColumn>
            <AgGridColumn field="trainingCount"></AgGridColumn>
            <AgGridColumn field="training"></AgGridColumn>
          </AgGridReact>
        </div>
      </Content>
    </Page>
  );
}
