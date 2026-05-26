import { Box, Button, Grid, Heading, Text } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../Page';
import Sorter from './MatchSorter';
import { MatchesList } from './Match';

function TrackNotice({ track }) {
  if (track === 'INTERMEDIATE') {
    return (
      <Text bold>
        You're in the INTERMEDIATE track, but we may still show you some advanced-track projects that are a
        particularly good fit for your interests. You're welcome to select these as long as you're confident
        you have the skills to complete them.
      </Text>
    );
  }
  if (track === 'ADVANCED') {
    return (
      <Text bold>
        You're in the ADVANCED track, but we may still show you some intermediate-track projects that are a
        particularly good fit for your interests. You're welcome to select these, but be aware that your teammates
        may be less experienced programmers than you.
      </Text>
    );
  }
  return null;
}

export default function MatchingRankStep({
  student,
  tags,
  picks,
  matches,
  ranking,
  onRankingChange,
  onAddPick,
  onRemovePick,
  onSubmit,
  isSubmitting,
  minProjects,
}) {
  const canSubmit = ranking.length >= minProjects;
  return (
    <Page title="Project Preferences">
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
          <TrackNotice track={student.track} />
        </Box>

        <Box p={4} mb={8} display={{ base: 'block', md: 'none' }} bg="red.50" borderColor="red.500" borderWidth={2} color="red.900">
          <Text fontSize="xl" bold>We recommend viewing this site on a device with a larger screen.</Text>
          <Text>There's a lot of information on this page, and it's hard to see it all on a phone.</Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', md: '2fr 4fr' }}>
          <Box mr={4}>
            <Heading as="h3" fontSize="xl">Rank Your Favorite Projects</Heading>
            <Text>
              Select at least {minProjects} projects, then drag-and-drop to reorder your final preferences. The
              projects on the top of your list are the ones you're most likely to get.
            </Text>
            <Button
              disabled={!canSubmit}
              isLoading={isSubmitting}
              colorScheme="green"
              mb={4}
              onClick={onSubmit}
            >
              {canSubmit ? 'Submit' : `Pick at least ${minProjects}`}
            </Button>
            <Sorter
              matches={picks}
              onDeselect={onRemovePick}
              onUpdate={onRankingChange}
            />
          </Box>
          <Box>
            <MatchesList
              selectedTags={tags}
              matches={matches}
              selected={picks}
              onSelect={onAddPick}
              onDeselect={onRemovePick}
              allowSelect
            />
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}
