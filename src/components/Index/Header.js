import { DateTime } from 'luxon';
import { Box, Text, Heading, Button } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useQuery, useShuffled, useSlideshow, useProgramDates } from '../../providers';

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

  const studentAppsOpenEvents = useQuery('labs.studentAppsOpenEvents', []);

  const { mentorApplicationEndsAt } = useProgramDates();


  const bgs = useShuffled(themeBackgrounds?.items || []).filter(Boolean);
  const i = useSlideshow(bgs.length, 5000);

  const applicationsOpen = studentAppsOpenEvents.length > 0 || registrationsOpenAt < DateTime.local() && registrationsCloseAt > DateTime.local();
  const hearBackBy = registrationsCloseAt.plus({ days: 3 });

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
              mb={12}
            >
              CodeDay Labs is the 100% online tech internship for everyone.
            </Heading>
            <Button
              as={applicationsOpen ? "a" : undefined}
              href="/apply"
              colorScheme={applicationsOpen ? 'green' : 'gray'}
              {...!applicationsOpen ? {backgroundColor: 'black'} : {}}
              mr={4}
              shadow="md"
            >
              {applicationsOpen ? 'Apply Now' : 'Public Application Closed'}
            </Button>
            {mentorApplicationEndsAt > DateTime.local() ? (
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
            ) : (
              <Button
                as="a"
                href="/volunteer"
                variant="outline"
                color="white"
                textShadow="0 0 5px rgba(0,0,0,0.7)"
                shadow="md"
              >
                Volunteer
              </Button>
            )}
            {(registrationsCloseAt && registrationsCloseAt > DateTime.local()) ? (
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
                <br />Last decisions: {hearBackBy.toLocaleString({
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  hour: 'numeric',
                  minute: '2-digit',
                  timeZoneName: 'short',
                })} (most will be earlier)
              </Text>
            ) : (
              <Text fontSize="md" mt={2}>
                <strong>Students from partner colleges:</strong><br />
                Dates may vary. Use your invitation link to apply.
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
