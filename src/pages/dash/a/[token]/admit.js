import { useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { DateTime } from 'luxon';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { Box, Button, Checkbox, Heading, Spinner } from '@codeday/topo/Atom';
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
  if (avg < 2) return '#e53e3e';
  if (avg < 4) return '#dd6b20';
  if (avg < 6) return '#d69e2e';
  if (avg < 8) return '#805ad5';
  return '#3182ce';
}

function IdCellRenderer({ value, data, context }) {
  const href = `/dash/a/${context.token}/student/${value}`;
  return <a href={href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline', color: '#3182ce' }}>{value}</a>;
}

function DropdownSaveCellRenderer({ value, data, colDef, context }) {
  const field = colDef.field;
  const isTrack = field === 'track';
  const options = isTrack ? TRACK_OPTIONS : STATUS_OPTIONS;
  const [selected, setSelected] = useState(value);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isTrack) {
        await context.fetch(StudentChangeTrack, { id: data.id, track: selected });
      } else {
        await context.fetch(StudentChangeStatus, { id: data.id, status: selected });
      }
      context.success(`Updated ${data.name}`);
      context.refresh();
    } catch (ex) {
      context.error(ex.toString());
    }
    setSaving(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ flex: 1, fontSize: '12px', padding: '2px' }}
      >
        {Object.entries(options).map(([k, v]) => (
          <option key={k} value={k}>{v}</option>
        ))}
      </select>
      <button
        onClick={handleSave}
        disabled={saving || selected === value}
        style={{
          fontSize: '11px',
          padding: '2px 6px',
          cursor: saving || selected === value ? 'default' : 'pointer',
          opacity: saving || selected === value ? 0.5 : 1,
        }}
      >
        {saving ? '...' : 'Save'}
      </button>
    </div>
  );
}

function StatusCellRenderer({ value, data, colDef, context }) {
  const [offering, setOffering] = useState(false);

  const handleOffer = async () => {
    setOffering(true);
    try {
      await context.fetch(StudentOfferAdmission, { id: data.id });
      context.success(`Offered admission to ${data.name}`);
      context.refresh();
    } catch (ex) {
      context.error(ex.toString());
    }
    setOffering(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      <div style={{ flex: 1 }}>
        <DropdownSaveCellRenderer value={value} data={data} colDef={colDef} context={context} />
      </div>
      <button
        onClick={handleOffer}
        disabled={offering}
        style={{
          fontSize: '9px',
          padding: '1px 4px',
          lineHeight: '1.2',
          cursor: offering ? 'default' : 'pointer',
          opacity: offering ? 0.5 : 1,
          backgroundColor: '#38a169',
          color: 'white',
          border: 'none',
          borderRadius: '2px',
          whiteSpace: 'nowrap',
        }}
      >
        {offering ? '..' : 'Offer'}
      </button>
    </div>
  );
}

function RatingCellRenderer({ value }) {
  const bg = ratingColor(value);
  return (
    <span style={{
      backgroundColor: bg,
      color: bg ? 'white' : undefined,
      fontWeight: bg ? 'bold' : 'normal',
      padding: bg ? '2px 6px' : undefined,
      borderRadius: bg ? '3px' : undefined,
    }}>
      {value != null ? Math.round(value * 100) / 100 : ''}
    </span>
  );
}

const TRACK_COLORS = { BEGINNER: '#319795', INTERMEDIATE: '#38a169', ADVANCED: '#a0aec0' };
const TRACK_LABELS = { BEGINNER: 'B', INTERMEDIATE: 'I', ADVANCED: 'A' };

function TrackRecCellRenderer({ data }) {
  const recs = data.trackRecommendation || [];
  const weights = {};
  recs.forEach((rec) => { weights[rec.track] = rec.weight; });

  return (
    <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
      {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((t) => (
        <div
          key={t}
          style={{
            backgroundColor: TRACK_COLORS[t],
            opacity: weights[t] || 0,
            color: 'white',
            fontSize: '10px',
            fontWeight: 'bold',
            padding: '1px 5px',
            borderRadius: '2px',
            lineHeight: '1.4',
          }}
        >
          {TRACK_LABELS[t]}
        </div>
      ))}
    </div>
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
    refresh,
    success,
    error,
  }), [query.token, fetchGql, refresh, success, error]);

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

        <div className="ag-theme-alpine" style={{ height: 700, width: '100%' }}>
          <AgGridReact
            rowData={rows}
            context={context}
            defaultColDef={{
              sortable: true,
              filter: 'agTextColumnFilter',
              floatingFilter: true,
              resizable: true,
              width: 150,
            }}
            frameworkComponents={{
              idCellRenderer: IdCellRenderer,
              dropdownSaveCellRenderer: DropdownSaveCellRenderer,
              statusCellRenderer: StatusCellRenderer,
              ratingCellRenderer: RatingCellRenderer,
              trackRecCellRenderer: TrackRecCellRenderer,
            }}
          >
            <AgGridColumn field="id" headerName="ID" cellRenderer="idCellRenderer" width={120} />
            <AgGridColumn field="name" headerName="Name" width={180} />
            <AgGridColumn field="status" headerName="Status" cellRenderer="statusCellRenderer" width={230} filter={false} />
            <AgGridColumn field="track" headerName="Track" cellRenderer="dropdownSaveCellRenderer" width={200} filter={false} />
            <AgGridColumn field="admissionRatingAverage" headerName="Avg Rating" cellRenderer="ratingCellRenderer" width={120} filter="agNumberColumnFilter" />
            <AgGridColumn headerName="Track Rec" cellRenderer="trackRecCellRenderer" width={90} filter={false} sortable={false} />
            <AgGridColumn field="admissionRatingCount" headerName="# Ratings" width={110} filter="agNumberColumnFilter" />
            <AgGridColumn field="interviewNotes" headerName="Interview Notes" width={300} />
            <AgGridColumn field="partnerCode" headerName="Partner Code" width={140} />
            <AgGridColumn field="minHours" headerName="Min Hours" width={110} filter="agNumberColumnFilter" />
            <AgGridColumn field="timezoneOffset" headerName="Timezone (UTC)" width={130} filter="agNumberColumnFilter" />
          </AgGridReact>
        </div>
      </Content>
    </Page>
  );
}
