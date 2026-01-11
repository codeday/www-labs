import { useEffect, useMemo, useRef, useState } from 'react';
import { LiveStudentProjectDetailsQuery } from './LiveStudentProjectDetails.gql';
import { apiFetch } from '@codeday/topo/utils';
import { Box, Link, Text } from '@codeday/topo/Atom';

const nl2br = (str) => str && str
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/(https?:\/\/[^\s\(\)]+)/g, (url) => `<a href="${url}" style="text-decoration: underline" target="_blank">${url}</a>`)
  .replace(/\n/g, '<br />');

export default function LiveStudentProjectDetails({ studentIds, token, ...props }) {
  const projectDetailsCache = useRef({});
  const [studentsWithProjects, setStudentsWithProjects] = useState({}); 

  useEffect(() => {
    const cachedKeys = Object.keys(projectDetailsCache.current);
    const toFetchIds = studentIds
      .filter(id => !cachedKeys.includes(id));

    const newEntries = Promise.all(
      toFetchIds
        .map(async (id) => {
          try {
            const result = await apiFetch(
              LiveStudentProjectDetailsQuery,
              { id },
              { 'X-Labs-Authorization': `Bearer ${token}` },
            );
            return [id, result?.labs?.student];
          } catch (ex) {
            console.error(ex);
            return [id, null];
          }
        })
    ).then(newEntries => {
      const cachedEntries = Object.entries(projectDetailsCache.current)
      .filter(([id]) => studentIds.includes(id));

    projectDetailsCache.current = Object.fromEntries([
      ...newEntries,
      ...cachedEntries,
    ].filter(([,e]) => !!e));

    setStudentsWithProjects(projectDetailsCache.current);
    });
    
  }, [studentIds]);

  const allProjects = Object.fromEntries(
      Object.entries(studentsWithProjects)
        .flatMap(([, s]) => s.projects)
        .map(p => [p.id, p])
  );

  return useMemo(() => (
    <Box {...props}>
      {Object.values(allProjects).map(p => (
        <Box key={p.id} borderWidth={1} mb={2} p={2} rounded="sm">
          <Box>
            <Text
              fontWeight="bold"
              display="inline"
            >
              Mentor{p.mentors.length > 0 ? 's' : ''}:{' '}
            </Text>
            {p.mentors.map((m, i) => (
              <>
                <Link key={m.id} href={`mailto:${m.email}`}>
                  {m.name}
                </Link>
                {i+1 < p.mentors.length ? ', ' : ''}
              </>
            ))}
          </Box>

          <Box mt={2}>
              <Text
                fontWeight="bold"
                display="inline"
              >
                Student{p.students.length > 0 ? 's' : ''}:{' '}
              </Text>
              {p.students.map((s, i) => (
                <Text
                  key={s.id}
                  display="inline"
                  fontWeight={studentIds.includes(s.id) ? 'bold' : 'normal'}
                >
                  <Link href={`mailto:${s.email}`}>
                    {s.name}
                  </Link>
                  {s.partnerCode && <> ({s.partnerCode})</>}
                  {i+1 < p.students.length ? ', ' : ''}
                </Text>
              ))}
          </Box>

          <Box mt={2}>
              <Text
                fontWeight="bold"
                display="inline"
              >
                Tags:{' '}
              </Text>
              {p.tags.map(t => t.mentorDisplayName).join(', ')}
          </Box>

          <Box mt={2}>
              <Text
                fontWeight="bold"
              >
                Description:
              </Text>
              <div dangerouslySetInnerHTML={{ __html: nl2br(p.description) }} />
          </Box>

          {p.deliverables && (
            <Box mt={2}>
                <Text
                  fontWeight="bold"
                >
                  Deliverables:
                </Text>
                <div dangerouslySetInnerHTML={{ __html: nl2br(p.deliverables) }} />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  ), [Object.keys(allProjects)]);
}