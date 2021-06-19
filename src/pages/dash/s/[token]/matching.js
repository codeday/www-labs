import { print } from 'graphql';
import { useEffect, useState, useReducer } from 'react';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Spinner from '@codeday/topo/Atom/Spinner';
import { useToasts, apiFetch } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import TagPicker from '../../../../components/Dashboard/TagPicker';
import Sorter from '../../../../components/Dashboard/MatchSorter';
import { MatchesList } from '../../../../components/Dashboard/Match';
import { useFetcher, useSwr } from '../../../../dashboardFetch';
import { LabsMatching, GetMatches, ExpressProjectPreferences } from './matching.gql';

const MIN_PROJECTS_TO_SUBMIT = 6;

export default function Matching({ allTags, student, projectPreferences }) {
  const fetch = useFetcher();
  const { success, error } = useToasts();
  const [picks, updatePicks] = useReducer((picks, { action, data }) => {
    if (action === 'add') {
      return [...picks, data];
    }
    if (action === 'delete') {
      return picks.filter((pick) => pick.id !== data.id);
    }
  }, projectPreferences.map((pref) => pref.project));
  const [tags, setTags] = useState([]);
  const [matches, setMatches] = useState([]);
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function fetchProjects() {
    setIsLoading(true);
    const result = await fetch(GetMatches, { tags: tags.map((t) => t.id) });
    setMatches(result?.labs?.projectMatches?.map((m) => m.project));
    setIsLoading(false);
  }

  const finalMinProjectsToSubmit = Math.max(3, Math.min(MIN_PROJECTS_TO_SUBMIT, matches.length));
  const finalMaxTagsToSubmit = Math.ceil(allTags.length * 0.45);

  if (isSubmitted || projectPreferences.length > 0) {
    return (
      <Page title={`Project Preferences`}>
        <Content mt={-8}>
          <Box bg="yellow.50" color="yellow.900" borderColor="yellow.100" borderWidth={2} p={4} mb={8}>
            <Text bold fontSize="lg">You already submitted your preferences.</Text>
            <Text>Below you can see your submitted choices, in order of most to least preferable.</Text>
          </Box>
          <Box>
            <MatchesList
              selectedTags={[]}
              matches={ranking.length > 0 ? ranking : picks}
              selected={ranking.length > 0 ? ranking : picks}
            />
          </Box>
        </Content>
      </Page>
    );
  }

  if (matches.length === 0) {
    return (
      <Page title={`Project Preferences`}>
        <Content mt={-8}>
          <Box p={4} mb={8} borderWidth={1} borderColor="blue.600" bg="blue.50" color="blue.900" rounded="sm">
            Select between 5 and {finalMaxTagsToSubmit} options to get your project recommendations.
           </Box>
          <Heading as="h3" mb={4} fontSize="lg">What areas of technology are you interested in?</Heading>
          <TagPicker
            onlyType="INTEREST"
            display="student"
            options={allTags}
            tags={tags}
            onChange={(newTags) => setTags(newTags)}
            mb={16}
          />

          <Heading as="h3" mb={4} fontSize="lg">What technologies do you know OR want to learn?</Heading>
          <TagPicker
            onlyType="TECHNOLOGY"
            display="student"
            options={allTags}
            tags={tags}
            onChange={(newTags) => setTags(newTags)}
            mb={16}
          />

          <Box textAlign="center">
            <Button
              onClick={fetchProjects}
              variantColor="green"
              size="lg"
              isLoading={isLoading}
              disabled={tags.length < 5 || tags.length > finalMaxTagsToSubmit}
            >
              Find my matches!
            </Button>
          </Box>
        </Content>
      </Page>
    )

  }

	return (
		<Page title={`Project Preferences`}>
			<Content mt={-8}>
				<Heading as="h2" fontSize="5xl" textAlign="center" mb={8}>
          Project Preferences for {student.name}
        </Heading>

        <Box p={4} mb={8} borderWidth={1} borderColor="blue.600" bg="blue.50" color="blue.900" rounded="sm">
          <Text bold>README</Text>
          <Text>
            Your projects are uniquely recommended to you based on the interests you selected in the previous step, as
            well as the information you provided in your application. Even if you select the same interests as a friend,
            you will likely get different results.
          </Text>
          <Text>
            Projects are shown less frequently as more students select them. If you come back to this page later, the
            list may change. We think these are the best possible matches for you, so you should lock them in now.
          </Text>
          {student.track === 'INTERMEDIATE' && (
            <Text bold>
              You're in the INTERMEDIATE track, but we may still show you some advanced-track projects that are a
              particularly good fit for your interests. You're welcome to select these as long as you're confident
              you have the skills to complete them.
            </Text>
          )}
          {student.track === 'ADVANCED' && (
            <Text bold>
              You're in the ADVANCED track, but we may still show you some intermediate-track projects that are a
              particularly good fit for your interests. You're welcome to select these, but be aware that your teammates
              may be less experienced programmers than you.
            </Text>
          )}
        </Box>

        <Box p={4} mb={8} display={{ base: 'block', md: 'none' }} bg="red.50" borderColor="red.500" borderWidth={2} color="red.900">
          <Text fontSize="xl" bold>We recommend viewing this site on a device with a larger screen.</Text>
          <Text>There's a lot of information on this page, and it's hard to see it all on a phone.</Text>
        </Box>
        <Grid templateColumns={{ base: '1fr', md: '2fr 4fr' }}>
          <Box mr={4}>
            <Heading as="h3" fontSize="xl">Rank Your Favorite Projects</Heading>
            <Text>
              Select at least {finalMinProjectsToSubmit} projects, then drag-and-drop to reorder your final preferences. The
              projects on the top of your list are the ones you're most likely to get.
            </Text>
            <Button
              disabled={ranking.length < finalMinProjectsToSubmit}
              isLoading={isSubmitting}
              variantColor="green"
              mb={4}
              onClick={async () => {
                setIsSubmitting(true);
                try {
                  await fetch(ExpressProjectPreferences, {
                    projects: Object.values(ranking).map((p) => p.id)
                  });
                  success(`Your preferences were submitted. We'll introduce you to your final match before Labs starts.`);
                } catch (ex) {
                  error(ex.toString());
                }
                setIsSubmitted(true);
                setIsSubmitting(false);
              }}
            >
              {(() => {
                if (ranking.length < finalMinProjectsToSubmit) return `Pick at least ${finalMinProjectsToSubmit}`;
                return "Submit";
              })()}
            </Button>
            <Sorter
              matches={picks}
              onDeselect={(match) => updatePicks({ action: 'delete', data: match }) }
              onUpdate={(r) => setRanking(r)}
            />
          </Box>
          <Box>
            <MatchesList
              selectedTags={tags}
              matches={matches}
              selected={picks}
              onSelect={(match) => updatePicks({ action: 'add', data: match}) }
              onDeselect={(match) => updatePicks({ action: 'delete', data: match }) }
              allowSelect
            />
          </Box>
        </Grid>
			</Content>
		</Page>
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
      projectPreferences: result?.labs?.projectPreferences,
    },
  };
}
