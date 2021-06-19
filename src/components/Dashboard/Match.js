import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Box from '@codeday/topo/Atom/Box';
import Button from '@codeday/topo/Atom/Button';
import truncate from 'truncate';
import { TagList } from './Tag'
import ordinal from '../../ordinal';

const nl2br = (str) => str && str
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\n/g, '<br />')
  .replace(/(https?:\/\/[^\s\(\)]+)/g, (url) => `<a href="${url}" style="text-decoration: underline" target="_blank">${url}</a>`);

function MentorHeading(mentor) {
  if (mentor.profile?.company && mentor.profile?.role) return `${mentor.name}, ${mentor.profile.role} @ ${mentor.profile.company}`;
  if (mentor.profile?.company) return `${mentor.name} @ ${mentor.profile.company}`;
  if (mentor.profile?.role) return `${mentor.name}, ${mentor.profile.role}`;
  return mentor.name;
}

function TrackBadge({ track }) {
  const color = {
    BEGINNER: 'green',
    INTERMEDIATE: 'yellow',
    ADVANCED: 'red'
  }[track];
  return (
    <Box color={`${color}.800`} fontWeight="bold" fontSize="md">
      {track.toLowerCase()}-track
    </Box>
  )
}

export function Match ({ match, selectedTags, onSelect, onDeselect, isSelected, allowSelect }) {
  return (
    <Box mb={8} borderColor="gray.200" borderWidth={2} borderRadius={2}>
        <Heading p={4} as="h3" fontSize="xl" mb={2} backgroundColor="gray.100" borderBottomColor="gray.200" borderBottomWidth={2} mb={4}>
          {match.mentors.map(MentorHeading).join(' / ')}
          <Text mb={0} fontSize="md" bold>Timezone: {match.mentors.map((m) => m.profile?.timezone)}</Text>
          <TrackBadge track={match.track} />
        </Heading>

        {/* Tags */}
        <Box mb={8} ml={4} mr={4}>
          <TagList tags={match.tags.filter((t) => t.type === 'INTEREST')} featured={selectedTags} />
        </Box>

        {/* Description */}
        <Box mb={8} mr={4} ml={4}>
          <Heading as="h4" fontSize="md" mb={2}>About the project</Heading>
          <Text pl={2} ml={2} borderLeftColor="gray.100" borderLeftWidth={2}>
            <div dangerouslySetInnerHTML={{ __html: nl2br(match.description) }} />
          </Text>
        </Box>

        {/* Deliverables */}
        {match.deliverables && (
          <Box mb={8} mr={4} ml={4}>
            <Heading as="h4" fontSize="md" mb={2}>By the end of labs</Heading>
            <Text pl={2} ml={2} borderLeftColor="gray.100" borderLeftWidth={2}>
              <div dangerouslySetInnerHTML={{ __html: nl2br(match.deliverables) }} />
            </Text>
          </Box>
        )}

        {match.tags.filter((t) => t.type === 'TECHNOLOGY').length > 0 && (
          <Box mb={8} mr={4} ml={4}>
            <Heading as="h4" fontSize="md" mb={2}>Tech stack</Heading>
            <Text pl={2} ml={2} borderLeftColor="gray.100" borderLeftWidth={2}>
              {match.tags.filter((t) => t.type === 'TECHNOLOGY').map((t) => t.studentDisplayName).join(', ')}
            </Text>
          </Box>
        )}

        {/* Mentor Info */}
        {match.mentors.filter((m) => m.profile?.bio).map((mentor) => (
          <Box mb={8} mr={4} ml={4}>
            <Heading as="h4" fontSize="md" mb={2}>About {mentor.name}</Heading>
            <Text><div dangerouslySetInnerHTML={{ __html: nl2br(mentor.profile.bio) }} /></Text>
          </Box>
        ))}

        {/* Select button */}
        {allowSelect && (
          <Box mb={8} mr={4} ml={4}>
            <Button
              onClick={() => isSelected ? onDeselect(match) : onSelect(match)}
              variantColor={isSelected ? 'red' : 'green'}
              variant={isSelected ? 'outline' : 'solid'}
            >
              {isSelected ? 'Undo Selection' : 'Add to My Ranking'}
            </Button>
          </Box>
        )}
    </Box>
  );
}

export function MiniMatch ({ match, index, onDeselect }) {
  return (
    <Box p={4} mb={1} borderColor="gray.200" borderWidth={2} borderRadius={2} bg="white">
      <Text fontSize="lg" bold mb={0}>{index+1}<sup>{ordinal(index+1)}</sup> choice: {match.mentors[0].name}</Text>
      <TrackBadge track={match.track} />
      <Text fontStyle="italic" mb={0}>{truncate(match.description, 140)}</Text>
      <Link onClick={() => onDeselect(match)}>Undo Selection</Link>
    </Box>
  );
}

export const MatchesList = ({ matches, selectedTags, selected, onSelect, onDeselect, allowSelect }) => matches
  .filter((match) => match.score !== 0)
  .map((match) => (
    <Match
      match={match}
      key={match.id}
      selectedTags={selectedTags}
      isSelected={selected.map((e) => e.id).includes(match.id)}
      onSelect={onSelect}
      onDeselect={onDeselect}
      allowSelect={allowSelect}
    />
  ));
