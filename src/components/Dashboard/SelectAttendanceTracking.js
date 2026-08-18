import { Select, Box } from '@codeday/topo/Atom';

const options = {
  SLACK_HUDDLE: 'Track via Slack Huddles',
  NOT_TRACKED: "We don't meet on Slack -- don't track attendance",
};

export default function SelectAttendanceTracking({ attendanceTracking, onChange, ...props }) {
  return (
    <Box display="inline-block" {...props}>
      <Select display="inline-block" onChange={onChange}>
        {Object.keys(options).map((k) => (
          <option key={k} selected={(attendanceTracking || 'SLACK_HUDDLE') === k} value={k}>{options[k]}</option>
        ))}
      </Select>
    </Box>
  );
}
