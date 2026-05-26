import { useReducer, useState } from 'react';
import { useToasts } from '@codeday/topo/utils';
import { useFetcher } from '../../dashboardFetch';
import { GetMatches, ExpressProjectPreferences } from '../../pages/dash/s/[token]/matching.gql';

function picksReducer(picks, { action, data }) {
  if (action === 'add') return [...picks, data];
  if (action === 'delete') return picks.filter((pick) => pick.id !== data.id);
  return picks;
}

export default function useMatchingState(projectPreferences) {
  const fetch = useFetcher();
  const { success, error } = useToasts();
  const [picks, dispatch] = useReducer(
    picksReducer,
    projectPreferences,
    (prefs) => prefs.map((pref) => pref.project),
  );
  const [tags, setTags] = useState([]);
  const [matches, setMatches] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPick = (data) => dispatch({ action: 'add', data });
  const removePick = (data) => dispatch({ action: 'delete', data });

  async function fetchProjects() {
    setIsLoading(true);
    const result = await fetch(GetMatches, { tags: tags.map((t) => t.id) });
    setMatches(result?.labs?.projectMatches?.map((m) => m.project));
    setIsLoading(false);
  }

  async function submit() {
    setIsSubmitting(true);
    try {
      await fetch(ExpressProjectPreferences, {
        projects: Object.values(ranking).map((p) => p.id),
      });
      success(`Your preferences were submitted. We'll introduce you to your final match before Labs starts.`);
      setIsSubmitted(true);
    } catch (ex) {
      error(ex.toString());
    }
    setIsSubmitting(false);
  }

  return {
    picks,
    tags,
    matches,
    ranking,
    isLoading,
    isSubmitted,
    isSubmitting,
    setTags,
    setRanking,
    addPick,
    removePick,
    fetchProjects,
    submit,
  };
}
