import { useEffect, useState } from 'react';
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import { TopStudentsByTrack } from '../../pages/dash/a/[token]/admit.gql';

export default function useTopStudents({ track, includeRejected, token }) {
  const fetch = useFetcher();
  const { error } = useToasts();
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    try {
      const result = await fetch(TopStudentsByTrack, { track, includeRejected: includeRejected || false });
      setStudents(result?.labs?.studentsTopRated || []);
      setStats(result?.labs?.statAdmissionsStatus || []);
    } catch (ex) {
      error(ex.toString());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined' || !fetch || !token) return;
    refresh().catch((ex) => error(ex.toString()));
  }, [track, includeRejected, token]);

  return { students, stats, loading, refresh };
}
