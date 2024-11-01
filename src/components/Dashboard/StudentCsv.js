import { Icon } from "@chakra-ui/react";
import { Link } from "@codeday/topo/Atom";
import UiDownload from '@codeday/topocons/Icon/UiDownload';
import { DateTime } from "luxon";
import { useRef } from "react";
import { CSVLink } from "react-csv";

const TIME_MANAGEMENT_DAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function flatTimeManagement (timeManagementPlan) {
  return TIME_MANAGEMENT_DAYS.map(d => (
    (timeManagementPlan?.[d.toLowerCase()] || [])
      .map(({ start, end }) => `${Math.floor(start/60)}:${(start%60).toString().padEnd(2, '0')}-${Math.floor(end/60)}:${(end%60).toString().padEnd(2, '0')}`)
      .join(';')
  ));
}

export function StudentCsv({ students, onlyAccepted, ...props }) {
  const ref = useRef();

  const csvHeaders = [
    'appliedAt',
    'id',
    'name',
    'email',
    'username',
    'status',
    'mentors',
    'issueUrl',
    'description',
    'timeCommitment',
    'timezone',
    'hasProjectPreferences',
    'hasSlack',
    'hasRepliedToEmail',
    'partnerAgreement',
    'eventAgreement',
    ...TIME_MANAGEMENT_DAYS.map(d => `${d}Availability`),
  ];

  const csvData = students
  .filter(s => !s.onlyAccepted || s.status === 'ACCEPTED')
  .map(s => ({ createdAtDate: DateTime.fromISO(s.createdAt), ...s }))
  .sort((a, b) => {
    const mentorA = a.projects?.[0]?.mentors?.[0]?.name || '';
    const mentorB = b.projects?.[0]?.mentors?.[0]?.name || '';
    if (mentorA && !mentorB) return -1;
    if (!mentorA && mentorB) return 1;
    if (mentorA && mentorB && mentorA !== mentorB) return mentorA.localeCompare(mentorB);
    return a.createdAtDate > b.createdAtDate ? 1 : -1
  })
  .map(s => [
    s.createdAtDate.toLocaleString(DateTime.DATETIME_MED).replace(/,/g, ''),
    s.id,
    s.name.replace(/"/g, '""'),
    s.email,
    s.username,
    s.status,
    s.projects.flatMap(p => p.mentors).map(m => m.name).join('; ').replace(/"/g, '""'),
    s.projects.map(p => p.issueUrl).join('; ').replace(/"/g, '""'),
    s.projects.map(p => p.description).join('; ').replace(/\n/g, ' ').replace(/"/g, '""'),
    s.minHours,
    s.timezone,
    s.hasProjectPreferences ? 'yes' : 'no',
    s.slackId ? 'yes' : 'no',
    s.emailCount > 0 ? 'yes' : 'no',
    s.partnerContractData ? JSON.stringify(s.partnerContractData).replace(/"/g, '""') : '',
    s.eventContractData ? JSON.stringify(s.eventContractData).replace(/"/g, '""') : '',
    ...flatTimeManagement(s.timeManagementPlan),
  ]);

  return (
    <Link
      {...props}
      onClick={() => {
        ref && ref.current && ref.current.link.click();
      }}
    >
      <CSVLink
          ref={ref}
          style={{ display: "none" }}
          data={csvData}
          headers={csvHeaders}
          filename={'students.csv'}
        />
        <Icon as={UiDownload} />
        CSV
    </Link>
  );
}