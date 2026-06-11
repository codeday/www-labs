import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { AgGridReact } from 'ag-grid-react';
import { Box, Button, Checkbox, Heading, Link, Select, Spinner, Text } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import useTopStudents from '../../../../components/Dashboard/useTopStudents';
import { useFetcher } from '../../../../dashboardFetch';
import { StudentChangeTrack, StudentChangeStatus, StudentOfferAdmission } from './admit.gql';

const HELD_SPOT_STATUSES = ['OFFERED', 'ACCEPTED', 'TRACK_CHALLENGE', 'TRACK_INTERVIEW'];

const TRACK_OPTIONS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
};

const STATUS_OPTIONS = {
  APPLIED: 'Applied',
  TRACK_INTERVIEW: 'Track Interview',
  TRACK_CHALLENGE: 'Track Challenge',
  OFFERED: 'Offered',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  CANCELED: 'Canceled',
};

function heldSpotsCount(stats) {
  return stats
    .filter(({ key }) => HELD_SPOT_STATUSES.includes(key))
    .reduce((accum, { value }) => accum + value, 0);
}

function tzToOffset(tz) {
  if (!tz) return '';
  try {
    const offset = DateTime.now().setZone(tz).offset / 60;
    const sign = offset >= 0 ? '+' : '';
    return `${sign}${offset}`;
  } catch {
    return tz;
  }
}

function ratingColor(avg) {
  if (avg == null || avg === 0) return undefined;
  if (avg < 2) return 'red.500';
  if (avg < 4) return 'orange.500';
  if (avg < 6) return 'yellow.500';
  if (avg < 8) return 'purple.500';
  return 'blue.500';
}

function IdCellRenderer({ value, data, node, context }) {
  if (node?.group) return null;
  const href = `/dash/a/${context.token}/student/${value}`;
  return <Link href={href} target="_blank" rel="noopener noreferrer" color="blue.500" textDecoration="underline">{value}</Link>;
}

function DropdownSaveCellRenderer({ value, data, node, colDef, context }) {
  if (node?.group) return null;
  const field = colDef.field;
  const isTrack = field === 'track';
  const options = isTrack ? TRACK_OPTIONS : STATUS_OPTIONS;
  const [selected, setSelected] = useState(value);
  const [saving, setSaving] = useState(false);

  useEffect(() => { setSelected(value); }, [value]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isTrack) {
        await context.fetch(StudentChangeTrack, { id: data.id, track: selected });
      } else {
        await context.fetch(StudentChangeStatus, { id: data.id, status: selected });
      }
      if (node) node.setDataValue(field, selected);
      context.success(`Updated ${data.name}`);
    } catch (ex) {
      context.error(ex.toString());
    }
    setSaving(false);
  };

  return (
    <Box display="flex" alignItems="center" style={{ gap: '4px' }}>
      <Select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        size="xs"
        flex={1}
        fontSize="xs"
      >
        {Object.entries(options).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </Select>
      <Button
        onClick={handleSave}
        disabled={saving || selected === value}
        size="xs"
        fontSize="xs"
        px={2}
        opacity={saving || selected === value ? 0.5 : 1}
      >
        {saving ? '...' : 'Save'}
      </Button>
    </Box>
  );
}

function StatusCellRenderer({ value, data, node, colDef, context }) {
  if (node?.group) return null;
  const [offering, setOffering] = useState(false);

  const handleOffer = async () => {
    setOffering(true);
    try {
      await context.fetch(StudentOfferAdmission, { id: data.id });
      if (node) node.setDataValue('status', 'OFFERED');
      context.success(`Offered admission to ${data.name}`);
    } catch (ex) {
      context.error(ex.toString());
    }
    setOffering(false);
  };

  return (
    <Box display="flex" alignItems="center" style={{ gap: '4px' }}>
      <Box flex={1}>
        <DropdownSaveCellRenderer value={value} data={data} colDef={colDef} context={context} />
      </Box>
      <Button
        onClick={handleOffer}
        disabled={offering}
        size="xs"
        fontSize="2xs"
        px={1}
        py={0}
        lineHeight="1.2"
        colorScheme="green"
        opacity={offering ? 0.5 : 1}
        whiteSpace="nowrap"
      >
        {offering ? '..' : 'Offer'}
      </Button>
    </Box>
  );
}

function RatingCellRenderer({ value, node }) {
  if (node?.group) return null;
  const bg = ratingColor(value);
  return (
    <Box
      as="span"
      bg={bg}
      color={bg ? 'white' : undefined}
      fontWeight={bg ? 'bold' : 'normal'}
      px={bg ? 2 : 0}
      py={bg ? '2px' : 0}
      borderRadius={bg ? 'sm' : undefined}
    >
      {value != null ? Math.round(value * 100) / 100 : ''}
    </Box>
  );
}

const TRACK_COLORS = { BEGINNER: 'teal.500', INTERMEDIATE: 'green.500', ADVANCED: 'gray.500' };
const TRACK_LABELS = { BEGINNER: 'B', INTERMEDIATE: 'I', ADVANCED: 'A' };

function TrackRecCellRenderer({ data, node }) {
  if (node?.group) return null;
  const recs = data.trackRecommendation || [];
  const weights = {};
  recs.forEach((rec) => { weights[rec.track] = rec.weight; });

  return (
    <Box display="flex" style={{ gap: '3px' }} alignItems="center">
      {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((t) => (
        <Box
          as="span"
          key={t}
          bg={TRACK_COLORS[t]}
          opacity={weights[t] || 0}
          color="white"
          fontWeight="bold"
          px={2}
          py="2px"
          borderRadius="sm"
        >
          {TRACK_LABELS[t]}
        </Box>
      ))}
    </Box>
  );
}

export default function AdminAdmit() {
  const { query } = useRouter();
  const fetchGql = useFetcher();
  const { success, error } = useToasts();
  const [includeRejected, setIncludeRejected] = useState(false);
  const { students, stats, loading, refresh } = useTopStudents({
    includeRejected,
    token: query.token,
  });

  const rows = useMemo(() => students.map((s) => ({
    ...s,
    timezoneOffset: tzToOffset(s.timezone),
  })), [students]);

  const context = useMemo(() => ({
    token: query.token,
    fetch: fetchGql,
    success,
    error,
  }), [query.token, fetchGql, success, error]);

  return (
    <Page title="Admissions">
      <Content maxW="100%" mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mt={4}>Admissions</Heading>
        <Box mb={4}>
          <Checkbox onClick={(e) => setIncludeRejected(e.target.checked)}>Include Rejected</Checkbox>
          {loading && <Spinner ml={4} />}
        </Box>
        <Box mb={4}>Current held spots: {heldSpotsCount(stats)}</Box>

        <Box className="ag-theme-quartz" h={700} w="100%">
          <AgGridReact
            theme="legacy"
            rowData={rows}
            context={context}
            rowGroupPanelShow="always"
            groupDefaultExpanded={-1}
            defaultColDef={{
              sortable: true,
              filter: 'agTextColumnFilter',
              floatingFilter: true,
              resizable: true,
              width: 150,
            }}
            columnDefs={[
              { field: 'id', headerName: 'ID', cellRenderer: IdCellRenderer, width: 120 },
              { field: 'name', headerName: 'Name', width: 180 },
              { field: 'status', headerName: 'Status', cellRenderer: StatusCellRenderer, width: 230, filter: false },
              { field: 'track', headerName: 'Track', cellRenderer: DropdownSaveCellRenderer, width: 200, filter: false },
              { field: 'admissionRatingAverage', headerName: 'Avg Rating', cellRenderer: RatingCellRenderer, width: 120, filter: 'agNumberColumnFilter', sort: 'desc' },
              { headerName: 'Track Rec', cellRenderer: TrackRecCellRenderer, width: 90, filter: false, sortable: false },
              { field: 'admissionRatingCount', headerName: '# Ratings', width: 110, filter: 'agNumberColumnFilter' },
              { field: 'interviewNotes', headerName: 'Interview Notes', width: 300 },
              { field: 'partnerCode', headerName: 'Partner Code', width: 140, rowGroup: true, hide: true },
              { field: 'minHours', headerName: 'Min Hours', width: 110, filter: 'agNumberColumnFilter' },
              { field: 'timezoneOffset', headerName: 'Timezone (UTC)', width: 130, filter: 'agNumberColumnFilter' },
            ]}
          />
        </Box>
      </Content>
    </Page>
  );
}
