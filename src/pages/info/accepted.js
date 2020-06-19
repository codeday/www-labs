
import Box, { Grid, Content } from '@codeday/topo/Box';
import Image from '@codeday/topo/Image';
import Button from '@codeday/topo/Button';
import Text, { Heading, Link } from '@codeday/topo/Text';
import List, { Item as ListItem, Icon as ListIcon } from '@codeday/topo/List';
import Page from '../../components/Page';
import MentorSeo from '../../components/MentorSeo';

export default () => (
  <Page slug="/info/accepted" title="Information For Accepted Students">
    <MentorSeo />
    <Content>
      <Heading as="h2" size="xl">Information for Accepted Students</Heading>
      <Grid templateColumns={{ base: "1fr", sm: "3fr 1fr" }}>
        <Box>
          <Box mb={12} mt={8}>
            <Heading as="h3" size="lg" mb={2}>Share your acceptance!</Heading>
            <Text>You can use the following text and your choice of image to share that you've been accepted on LinkedIn:</Text>
            <Text ml={4} pl={4} mr={4} pr={4} borderLeftColor="gray" borderLeftWidth={2} fontStyle="italic">
              I'm excited to share that I'll be working on a tech project at @CodeDay's CodeLabs program this summer!<br /><br />
              CodeLabs is a part of the non-profit group CodeDay, and pairs up students like me with mentors from leading
              tech companies to work on free/open-source projects for a summer.
            </Text>
            <Grid templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)" }} gap={6} mb={4}>
                {['lime', 'orange', 'black'].map((color) => (
                  <a href={`https://f1.codeday.org/labs/2020-accepted-${color}.png`} target="_blank" download={`${color}.png`}>
                    <img
                      src={`https://f1.codeday.org/labs/2020-accepted-${color}.png`}
                      alt={`Labs acceptance message in ${color}`}
                    />
                  </a>
                ))}
            </Grid>
            <Text>If you choose to list CodeLabs on your LinkedIn or resume, we request that you use the following format:</Text>
            <List>
              <ListItem>
                <Text as="span" bold>Company: </Text>
                <Link href="https://www.linkedin.com/company/512973/" target="_blank">CodeDay</Link>
              </ListItem>
              <ListItem><Text as="span" bold>Title:</Text> CodeLabs Intern</ListItem>
              <ListItem><Text as="span" bold>Description:</Text> Worked on (your project description) with (mentor details).</ListItem>
            </List>
            <Text mt={4}>You can also join the <Link href="https://www.linkedin.com/groups/4732099/">CodeDay Alums group.</Link></Text>
          </Box>


          <Box mb={12}>
            <Heading as="h3" size="lg" mb={2}>Your Project Team</Heading>
            <Text>
              We will pair you with two other students (with a similar skill level and complimentary interests). You'll
              work together, as a group, to create a project under the guidance of a mentor.
            </Text>
            <Text>
              Your project will be proposed and led by your mentor. Because you're not being paid, your mentors aren't
              able to benefit from your work. Most projects are working on open-source software, creating a totally new
              app, or working with a non-profit.
            </Text>
            <Text>
              To match you with a project, we'll show you a list of projects we think are a good fit, and ask you to
              rank your favorites. (We can't promise any specific project.)
            </Text>
          </Box>



          <Box
            mb={12}
            backgroundColor="yellow.50"
            borderRadius={2}
            padding={4}
            color="yellow.900"
            borderColor="yellow.500"
            borderWidth={2}
          >
            <Heading as="h3" size="lg">Your Commitment To Your Team</Heading>
            <Text>
              If you aren't able to meet these commitments, please let us know as soon as possible. We may remove
              students who regularly fail to meet their commitments.
            </Text>
            <List styleType="decimal" mt={2}>
              <ListItem mb={2}>
                <Text as="span" bold>You must plan to stay the course.</Text> You're part of a team, and can't plan to
                leave early.
              </ListItem>
              <ListItem mb={2}>
                <Text as="span" bold>You must meet your minimum time commitment each week.</Text> (You selected an amount of
                time, between 10-30hrs per week, as part of your application.)
              </ListItem>
              <ListItem mb={2}>
                <Text as="span" bold>You must make yourself reasonably available for meetings during the day.</Text>{' '}
                CodeLabs won't work if you're only available at odd hours, or for only a few hours a week.
              </ListItem>
              <ListItem mb={2}>
                <Text as="span" bold>You must make progress on your own and with your group.</Text> This is not a workshop,
                and mentors are here for guidance and supervision, not to pair-program with you.
              </ListItem>
              <ListItem mb={2}>
                <Text as="span" bold>You must deliver on the commitments you make to your team.</Text>
              </ListItem>
            </List>
          </Box>


          <Box mb={12}>
            <Heading as="h3" size="lg" mb={2}>Scheduled Meetings</Heading>
            <Text>During CodeLabs you can expect the following meetings:</Text>
            <List styleType="disc" mb={4}>
              <ListItem>Two group meetings with your mentor each week.</ListItem>
              <ListItem>Three one-on-one meetings with your mentor over the course of CodeLabs.</ListItem>
              <ListItem>Additional meetings with your teammates as needed.</ListItem>
            </List>
            <Text>
              <Text as="span" bold>There are no standardized meeting times.</Text> It's up to you, your teammates, and
              your mentor to find a time that works for everyone. (That's why it's important that you're flexible
              with meeting times.)
            </Text>
          </Box>


          <Box mb={12}>
            <Heading as="h3" size="lg" mb={2}>Getting Help Outside of Meetings</Heading>
            <Text>
              We have a team of technical mentors available to help you with specific technical issues during the
              work-week. While your mentor is there for high-level guidance, this team is here to help with specific
              issues as they arise.
            </Text>
            <Text>
              You can receive help with minor issues in the #help-desk channel on the{' '}
              <Link href="https://codeday.to/discord" target="_blank">CodeDay Discord</Link>{' '}
              or book a pair-programming session using a link which will be emailed to you.
            </Text>
            <Text>Remember, too, that you're part of a team! Be sure to ask for help from your group mentors too!</Text>
          </Box>


          <Box mb={12}>
            <Heading as="h3" size="lg" mb={2}>Events</Heading>
            <Text>
              You can view the published schedule <Link href="/schedule">here.</Link> We'll likely continue to add
              events even once CodeLabs starts. There are four event types:
            </Text>
            <List styleType="disc" mb={4}>
              <ListItem mb={2}>
                <Text as="span" bold>Career Talks:</Text>{' '}
                Find out what it's like to work in tech, and find the right path for yourself.
              </ListItem>
              <ListItem mb={2}>
                <Text as="span" bold>Tech Talks:</Text>{' '}
                Tech changes fast, and sometimes schools can't keep up. This is your chance to learn about the
                practices and technologies used in industry.
              </ListItem>
              <ListItem mb={2}>
                <Text as="span" bold>Expert Lunches:</Text>{' '}
                Your chance to ask candid questions in our series of casual conversations with tech leaders and domain
                experts.
              </ListItem>
              <ListItem mb={2}>
                <Text as="span" bold>Watch Parties:</Text>{' '}
                Watch a curated selection of conference talks, with a Q&amp;A/guided discussion with our team following.
              </ListItem>
              <ListItem mb={2}>
                <Text as="span" bold>Prototype/Demo Day:</Text>{' '}
                This is your chance to show the world what you made.
              </ListItem>
            </List>
          </Box>
        </Box>
      </Grid>
    </Content>
  </Page>
);
