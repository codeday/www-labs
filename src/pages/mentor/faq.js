
import Box, { Grid, Content } from '@codeday/topo/Box';
import Image from '@codeday/topo/Image';
import Button from '@codeday/topo/Button';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Page from '../../components/Page';

export default () => (
  <Page title="Mentor">
    <Content>
      <Box height="300px" overflow="hidden" borderRadius="md" marginBottom={4}>
        <Image
          width="100%"
          src="https://img.codeday.org/1024x300/b/s/bsi4mxy595o46b8qufi5xa4c3oisfhz5to8x1c3t7yz9j9d4utrwdrov4zhihtdxc5.jpg"
        />
      </Box>
    </Content>
    <Content>
      <Grid templateColumns={{ base: "1fr", sm: "1fr 4fr" }} gap={6}>
        <Box>
          <Button marginBottom={2} marginRight={2} as="a" href="/mentor">Back to Info</Button>
          <Button marginBottom={2} variantColor="green" as="a" href="/mentor/apply">Apply Now</Button>
        </Box>
        <Box>
          <Heading as="h2" size="xl">Mentor FAQ</Heading>
          <Heading as="h3" size="md">Are the students being paid for this experience?</Heading>
          <Text>
            No, this program is an opportunity for students without a paid internship to gain experience to work a project
            with in a team with industry volunteers like yourselves.
          </Text>

          <Heading as="h3" size="md">Are the Mentors paid?</Heading>

          <Text>
            No, the mentors are industry professionals who want to pay forward their experiences and help current CS
            students get a taste of some of the real-world challenges faced by professionals in the tech industry. However,
            if the company you work for has a non-profit hour match donation program, matching your 30 hours for CodeDay
            will help us offset some of the cost of running this program.
          </Text>

          <Heading as="h3" size="md">How big should the projects be?</Heading>

          <Text>
            We expect each student to spend ~10 hours on this project per week, so around 60 hours per student, ~180 hours
            for your student team. Think of something you can do in approximately 1 week or so. Since every team is
            different, you can shrink or expand the scope of the project as you get to know your team.
          </Text>

          <Heading as="h3" size="md">How much CS do these students know?</Heading>

          <Text>
            Our minimum requirement for students is to have passed a 2nd semester college data structures course. They
            should be expert in an industry standard language and proficient in building a project of a few hundred lines,
            and be able to learn new things put in front of them. You might have students that are more advanced or newer
            to the CS field.
          </Text>

          <Heading as="h3" size="md">
            What if my employer or organization want to hire these students for a project or perhaps at some point in the
            future?
          </Heading>
          <Text>
            Please get in touch with us!
          </Text>

          <Heading as="h3" size="md">What if my organization would like to sponsor this program?</Heading>
          <Text>
            Please contact us! We are a nonprofit and social good organization, and have opportunities available.
          </Text>

          <Heading as="h3" size="md">What if I want to continue to mentor these students after the summer?</Heading>
          <Text>
            Mentors in Tech (MinT) will be offering a follow up program to this in the fall.
          </Text>
          </Box>
      </Grid>
    </Content>
  </Page>
);
