import { Box, Button, Heading } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../Page';
import TagPicker from './TagPicker';

export default function MatchingTagStep({
  allTags,
  tags,
  onTagsChange,
  maxTags,
  onFindMatches,
  isLoading,
}) {
  const canSubmit = tags.length >= 5 && tags.length <= maxTags;
  return (
    <Page title="Project Preferences">
      <Content mt={-8}>
        <Box p={4} mb={8} borderWidth={1} borderColor="blue.600" bg="blue.50" color="blue.900" rounded="sm">
          Select between 5 and {maxTags} options to get your project recommendations.
        </Box>
        <Heading as="h3" mb={4} fontSize="lg">What areas of technology are you interested in?</Heading>
        <TagPicker
          onlyType="INTEREST"
          display="student"
          options={allTags}
          tags={tags}
          onChange={onTagsChange}
          mb={16}
        />

        <Heading as="h3" mb={4} fontSize="lg">What technologies do you know OR want to learn?</Heading>
        <TagPicker
          onlyType="TECHNOLOGY"
          display="student"
          options={allTags}
          tags={tags}
          onChange={onTagsChange}
          mb={16}
        />

        <Box textAlign="center">
          <Button
            onClick={onFindMatches}
            colorScheme="green"
            size="lg"
            isLoading={isLoading}
            disabled={!canSubmit}
          >
            Find my matches!
          </Button>
        </Box>
      </Content>
    </Page>
  );
}
