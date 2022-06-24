import { apiFetch } from '@codeday/topo/utils';
import { ProjectCapacities } from './projectCapacities.gql';
import stringify from 'csv-stringify/lib/sync';

export default async function matchingPrefs(req, res) {
  const token = req.query.token;
  const result = await apiFetch(ProjectCapacities, {}, {
    'X-Labs-Authorization': `Bearer ${token}`,
  });

  const projects = result.labs.mentors
    .flatMap((m) => m.projects)
    .filter((p) => ['MATCHED', 'ACCEPTED'].includes(p.status))
    .map(({ id, mentors, track: pTrack, studentCount, maxStudents }) => [
      `${mentors[0].givenName.replace(/ /g, '')}${mentors[0].surname.replace(/ /g, '')}-${pTrack}-${id}`,
      Math.max(maxStudents - studentCount, 0),
    ]);

  res.setHeader('Content-type', 'application/octet-stream');
  res.setHeader('Content-Disposition', `attachment; filename="capacities-${+new Date()}.csv"`);
  res.send(stringify(projects, {
    header: true,
    columns: [
      'projectId',
      'count',
    ],
  }));
}
