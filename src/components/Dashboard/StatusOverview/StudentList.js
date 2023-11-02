import { Link, List, ListItem } from '@codeday/topo/Atom';
import { DateTime } from 'luxon';
import SummaryBadge from "./SummaryBadge";

function standupRatingToCaution(rating) {
  if (rating === 0) return 0.4;
  if (rating === 1) return 0.2;
  if (rating === 2) return 0.1;
  return 0;
}

export default function StudentList({ students }) {
  const visibleStudents = students.filter(s => s.status !== 'CANCELED');
  return (
    <List styleType="none">
      {visibleStudents.map((s) => (
        <ListItem key={s.id}>
          <SummaryBadge
            mr={2}
            statusEvents={[
              { caution: s.timeManagementPlan || s.timezone ? 0 : 0.1 },
              { caution: (s.hasProjectPreferences || s.skipPreferences || (s.projects && s.projects.length > 0)) ? 0 : 1 },
              { caution: Math.max(0, 1-(s.trainingSubmissions.filter((ts) => ts.submission).length / Math.min(3, s.trainingSubmissions.length))) },
              { caution: s.emailCount > 0 ? 0 : 1},
              { caution: s.slackId ? 0 : 1},
              ...(s.notes || [])
                .map(n => ({
                  date: DateTime.fromISO(n.createdAt),
                  caution: n.caution,
                })),
              ...(s.surveyResponsesAbout || [])
                .map(sr => ({
                  date: DateTime.fromISO(sr.surveyOccurence.dueAt),
                  caution: sr.caution,
                })),
              ...(s.standupRatings || [])
                .filter(s => s.rating !== null)
                .map(s => ({
                  date: DateTime.fromISO(s.dueAt),
                  caution: standupRatingToCaution(s.rating),
                }))
            ]}
          />
          <Link href={`#s-${s.id}`}>{s.name}</Link>
        </ListItem>
      ))}
    </List>
  );
}