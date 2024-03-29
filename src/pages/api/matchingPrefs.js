import { apiFetch } from '@codeday/topo/utils';
import { MatchingPrefs } from './matchingPrefs.gql';
import stringify from 'csv-stringify/lib/sync';
import { timeManagementPlanToBitmask } from '../../utils';

const TRACK_ORDER = {BEGINNER: 0, INTERMEDIATE: 1, ADVANCED: 2};
const PAGE_SIZE = 25;

export default async function matchingPrefs(req, res) {
  const token = req.query.token;
  const students = [];
  let hadStudents = true;
  let skip = 0;
  do {
    const result = await apiFetch(MatchingPrefs, { take: PAGE_SIZE, skip: PAGE_SIZE * skip}, {
      'X-Labs-Authorization': `Bearer ${token}`,
    });
    const thisStudents = result?.labs?.students || [];
    hadStudents = thisStudents.length > 0;
    students.push(...thisStudents);
    skip++;
  } while(hadStudents);

  const studentRows = students
    .sort((a, b) => TRACK_ORDER[a.track] < TRACK_ORDER[b.track] ? -1 : 1 )
    .map(({ username, track, id, projectPreferences, weeks, timezone, partnerCode, givenName, surname, timeManagementPlan }) => [
      `${username}-${track}-${id}-${givenName}${surname}-${partnerCode || 'NA'}`,
      timeManagementPlanToBitmask(timeManagementPlan, timezone),
      ...(
        projectPreferences
          .filter(({ project }) => track === 'BEGINNER' ? project.track === 'BEGINNER' : project.track !== 'BEGINNER')
          .filter(({ project: { mentors } }) => weeks <= Math.max(...mentors.map((m) => m.maxWeeks)))
          .sort((a, b) => a.ranking < b.ranking ? -1 : 1)
          .map(({ project: { id, mentors, track: pTrack } }) =>
            `${mentors[0].givenName.replace(/ /g, '')}${mentors[0].surname.replace(/ /g, '')}-${pTrack}-${id}`,
          )
      ),
    ]);
  const maxCols = Math.max(0, ...studentRows.map((r) => r.length - 1));
  const posHeadings = [...Array(maxCols).keys()].map((a) => `choice ${a+1}`);

  res.setHeader('Content-type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="prefs-${+new Date()}.csv"`);
  res.send(stringify(studentRows, {
    header: true,
    columns: [
      'student',
      'timeManagement',
      ...posHeadings,
    ],
  }));
}
