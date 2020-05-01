import Box, { Grid, Content } from '@codeday/topo/Box';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Image, { Slideshow } from '@codeday/topo/Image';
import Button from '@codeday/topo/Button';
import FaceVeryHappy from '@codeday/topocons/Icon/FaceVeryHappy';
import BuildingOffice from '@codeday/topocons/Icon/BuildingOffice';
import Keyboard from '@codeday/topocons/Icon/Keyboard';
import FoodMeat from '@codeday/topocons/Icon/FoodMeat';
import Experiment from '@codeday/topocons/Icon/Experiment';
import Trophy from '@codeday/topocons/Icon/Trophy';

const eventSchedule = [
  ['Kickoff', 'Career Panel', 'Tech Talk', 'Expert Lunch', 'Tech Talk'],
  ['Tech Talk', 'Expert Lunch', 'Tech Talk', 'Career Panel', 'Prototype Day'],
  ['Tech Talk', 'Career Panel', 'Tech Talk', 'Expert Lunch', 'Tech Talk'],
  ['Tech Talk', 'Expert Lunch', 'Tech Talk', 'Career Panel', 'Presentations'],
];

const weekStarts = 6;

const eventConfig = {
  'Kickoff': {
    icon: FaceVeryHappy,
    color: 'gray.300',
  },
  'Prototype Day': {
    icon: Experiment,
    color: 'gray.300',
  },
  'Presentations': {
    icon: Trophy,
    color: 'gray.300',
  },
  'Career Panel': {
    icon: BuildingOffice,
    color: 'purple.300',
  },
  'Expert Lunch': {
    icon: FoodMeat,
    color: 'blue.300',
  },
  'Tech Talk': {
    icon: Keyboard,
    color: 'orange.300',
  },
};

export default () => (
  <Content>
    <Heading paddingBottom={3} textAlign="center">A full calendar of events.</Heading>
    <Text textAlign="center" paddingBottom={6}>
      It's not all project work, you'll get to talk to leaders from the tech industry.
    </Text>
    <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(5, 1fr)" }} borderWidth={1} borderColor="gray.100">
      {eventSchedule.map((wk, wkNumber) => wk.map((event, dayNumber) => {
        const Icon = eventConfig[event].icon;
        return (
          <Box margin={0} borderColor="gray.100" borderWidth={1} padding={4} paddingLeft={2}>
            <Grid templateColumns="1fr 3fr">
              <Box>
                <Box
                  borderRadius="full"
                  width="3rem"
                  height="3rem"
                  bg={eventConfig[event].color}
                  color="white"
                  fontSize="2rem"
                  textAlign="center"
                >
                  <Icon/>
                </Box>
              </Box>
              <Box paddingLeft={2}>
                <Text margin={0} color="gray.500">7/{weekStarts + (wkNumber * 7) + dayNumber}</Text>
                <Text margin={0} fontWeight="700">{event}</Text>
              </Box>
            </Grid>
          </Box>
        )
      }))}
    </Grid>
  </Content>
);
