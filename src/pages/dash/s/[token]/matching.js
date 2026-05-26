import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { MatchesList } from '../../../../components/Dashboard/Match';
import MatchingNotice from '../../../../components/Dashboard/MatchingNotice';
import MatchingTagStep from '../../../../components/Dashboard/MatchingTagStep';
import MatchingRankStep from '../../../../components/Dashboard/MatchingRankStep';
import useMatchingState from '../../../../components/Dashboard/useMatchingState';
import { LabsMatching } from './matching.gql';

const MIN_PROJECTS_TO_SUBMIT = 8;

export default function Matching({ allTags, event, student, projectPreferences }) {
  const state = useMatchingState(projectPreferences);

  if (!event.matchPreferenceSubmissionOpen) {
    return (
      <MatchingNotice
        title="Match preference submission is not open."
        message="We'll contact you when you're eligible to submit matches."
      />
    );
  }

  if (student.skipPreferences) {
    return (
      <MatchingNotice
        title="You're not eligible to submit project preferences."
        message="You'll be matched manually to the best fit for you."
      />
    );
  }

  if (state.isSubmitted || projectPreferences.length > 0) {
    const submitted = state.ranking.length > 0 ? state.ranking : state.picks;
    return (
      <MatchingNotice
        title="You already submitted your preferences."
        message="Below you can see your submitted choices, in order of most to least preferable."
      >
        <MatchesList selectedTags={[]} matches={submitted} selected={submitted} />
      </MatchingNotice>
    );
  }

  if (state.matches.length === 0) {
    return (
      <MatchingTagStep
        allTags={allTags}
        tags={state.tags}
        onTagsChange={state.setTags}
        maxTags={Math.ceil(allTags.length * 0.45)}
        onFindMatches={state.fetchProjects}
        isLoading={state.isLoading}
      />
    );
  }

  return (
    <MatchingRankStep
      student={student}
      tags={state.tags}
      picks={state.picks}
      matches={state.matches}
      ranking={state.ranking}
      onRankingChange={state.setRanking}
      onAddPick={state.addPick}
      onRemovePick={state.removePick}
      onSubmit={state.submit}
      isSubmitting={state.isSubmitting}
      minProjects={Math.min(MIN_PROJECTS_TO_SUBMIT, state.matches.length)}
    />
  );
}

export async function getServerSideProps({ params: { token } }) {
  const result = await apiFetch(print(LabsMatching), {}, {
    'X-Labs-Authorization': `Bearer ${token}`,
  });

  return {
    props: {
      allTags: result?.labs?.tags,
      student: result?.labs?.student,
      event: result?.labs?.event,
      projectPreferences: result?.labs?.projectPreferences,
    },
  };
}
