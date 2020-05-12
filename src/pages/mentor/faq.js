
import Box, { Grid, Content } from '@codeday/topo/Box';
import Image from '@codeday/topo/Image';
import Button from '@codeday/topo/Button';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Page from '../../components/Page';
import MentorSeo from '../../components/MentorSeo';

export default () => (
  <Page slug="/mentor/faq" title="Mentor FAQ">
    <MentorSeo />
    <Content>
      <Image
        width="100%"
        maxHeight="300px"
        borderRadius="md"
        marginBottom={4}
        src="https://img.codeday.org/w=1024;h=300;fit=crop;crop=faces,edges/b/s/bsi4mxy595o46b8qufi5xa4c3oisfhz5to8x1c3t7yz9j9d4utrwdrov4zhihtdxc5.jpg"
      />
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
            with in a team with industry volunteers like yourselves. (The only exception is for students matched with a
            specific company offering a stipend, but these students will not be matched with our volunteer mentors.)
          </Text>

          <Heading as="h3" size="md">Are the Mentors paid?</Heading>

          <Text>
            No, our mentors are industry professionals who want to pay forward their experiences and help current CS
            students get a taste of some of the real-world challenges faced by professionals in the tech industry. However,
            if the company you work for has a non-profit hour match donation program, matching your 20 hours for CodeDay
            will help us offset some of the cost of running this program.
          </Text>

          <Heading as="h3" size="md">Do mentors propose the projects? What is the deadline for proposals?</Heading>
          <Text>
            Mentors are responsible for proposing the projects. We will follow up with any mentors who did not propose
            a project in June.
          </Text>

          <Heading as="h3" size="md">Can students select their own project?</Heading>
          <Text>
            No, this year mentors will be selecting all the projects. In past years we have found that most students
            have difficulty thinking of real-world problems to solve.
          </Text>

          <Heading as="h3" size="md">How big should the projects be?</Heading>

          <Text>
            We expect each student to spend ~10 hours on this project per week, so around 40 hours per student, ~120 hours
            for your student team. Think of something you can do in approximately 1 week or so. Since every team is
            different, you can shrink or expand the scope of the project as you get to know your team.
          </Text>

          <Heading as="h3" size="md">How much CS do these students know?</Heading>

          <Text>
            Our minimum requirement for students is to have passed a 2nd semester college data structures course or have
            equivalent projects-based experience. They should have a high level of proficiency in an industry standard
            language, have experience in building a project of a few hundred lines, and be able to learn new things put
            in front of them. You might have students that are more advanced or newer to the CS field.
          </Text>

          <Heading as="h3" size="md">How are teams created?</Heading>
          <Text>
            Students will be shown a list of 20+ mentors/projects based on the matching criteria and interests provided
            in the application, and will be asked to rank their top five picks. We'll use these rankings to create the
            final teams.
          </Text>

          <Heading as="h3" size="md">When will I know who my team is? Do I need to do anything before the start?</Heading>
          <Text>
            We do not expect to know the final teams until a few days before the program. You won't need to do anything
            until the event kicks off.
          </Text>

          <Heading as="h3" size="md">Is this entirely virtual? Can I meet with my students in-person?</Heading>
          <Text>
            Because of COVID-19, we are not planning on any in-person meetings. It is very likely your student team
            will be located in several different, distant cities.
          </Text>

          <Heading as="h3" size="md">How will this work with different timezones?</Heading>
          <Text>
            We will match you with students in a time-zone similar to yours, unless you specifically request otherwise
            in our application.
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
