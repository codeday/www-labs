export function getReflectionType(sr, s) {
  if (sr.project) return 'project';
  if (!(sr.authorMentor || sr.authorStudent)) 'peer';
  if ((sr.authorMentor || sr.authorStudent).id === s.id) return 'self';
  if (sr.mentor && sr.authorStudent) return 'mentee';
  if (sr.student && sr.authorMentor) return 'mentor';
  if ((sr.mentor && sr.authorMentor) || (sr.student && sr.authorStudent)) return 'peer';
}