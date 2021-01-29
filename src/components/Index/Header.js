import { DateTime } from 'luxon';
import Box from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button';
import { useQuery, useShuffled, useSlideshow } from '../../providers';

const wrapDt = (keys, dict) => Object.keys(dict)
  .reduce((accum, k) => ({ ...accum, [k]: keys.includes(k) ? DateTime.fromISO(dict[k]) : dict[k] }), {});

export default function Header(props) {
  const {
    themeBackgrounds,
    startsAt,
    endsAt,
    registrationsOpenAt,
    registrationsCloseAt
  } = wrapDt(
    ['startsAt', 'endsAt', 'registrationsOpenAt', 'registrationsCloseAt'],
    useQuery('cms.headerEvents.items.0', {})
  );

  const bgs = useShuffled(themeBackgrounds?.items || []).filter(Boolean);
  const i = useSlideshow(bgs.length, 5000);

  const applicationsOpen = registrationsOpenAt < DateTime.local() && registrationsCloseAt > DateTime.local();

  return (
    <Box position="relative" {...props}>
      <Box
        position="relative"
        zIndex={100}
      >
        <Content>
          <Box
            maxWidth="md"
            color="white"
          >
            <Heading
              as="h2"
              fontSize="5xl"
              fontWeight="bold"
              textShadow="0 0 5px rgba(0,0,0,0.7)"
              mb={2}
            >
              CodeDay Labs is the 100% online tech internship for everyone.
            </Heading>
            <Text fontSize="xl" fontWeight="bold" mb={12}>
              {startsAt && endsAt ? (
                <>
                  {startsAt.toLocaleString({ weekday: 'long', day: 'numeric', month: 'long' })}
                  {' '}&mdash;{' '}
                  {endsAt.toLocaleString({ weekday: 'long', day: 'numeric', month: 'long' })}
                </>
              ) : (
                <>Dates TBA</>
              )}
            </Text>
            <Button
              as={applicationsOpen ? "a" : undefined}
              href="/apply"
              variantColor={applicationsOpen ? 'green' : 'gray'}
              bg={!applicationsOpen ? 'black' : 'undefined'}
              mr={4}
              shadow="md"
            >
              {applicationsOpen ? 'Apply Now' : 'Applications Not Open'}
            </Button>
            <Button
              as="a"
              href="/mentor"
              variant="outline"
              color="white"
              textShadow="0 0 5px rgba(0,0,0,0.7)"
              shadow="md"
            >
              Mentor
            </Button>
            {registrationsCloseAt && registrationsCloseAt > DateTime.local() && (
              <Text fontSize="md" mt={2}>
                {registrationsOpenAt > DateTime.local() && (
                  <>
                    Applications open:{' '}
                    {registrationsOpenAt.toLocaleString({ weekday: 'long', day: 'numeric', month: 'long'})}
                    <br />
                  </>
                )}
                Deadline: {registrationsCloseAt.toLocaleString({
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZoneName: 'short',
                })}
                <br />Rolling admissions
              </Text>
            )}
          </Box>
        </Content>
      </Box>
      <Box
        zIndex={55}
        opacity={0.5}
        position="absolute"
        top={0}
        left={0}
        right={0}
        height="100%"
        bg="#000"
      />
      {bgs.map((bg, j) => (
        <Box
          zIndex={50}
          key={bg?.url}
          opacity={i === j ? 1 : 0}
          transition="all 1s ease-in-out"
          position="absolute"
          top={0}
          left={0}
          right={0}
          height="100%"
          backgroundImage={`url(${bg?.url})`}
          backgroundSize="cover"
          backgroundPosition="50% 50%"
          backgroundRepeat="no-repeat"
        />
      ))}
    </Box>
  )
}
