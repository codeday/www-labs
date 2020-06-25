
import Box, { Grid, Content } from '@codeday/topo/Box';
import Text, { Heading, Link } from '@codeday/topo/Text';
import List, { Item as ListItem, Icon as ListIcon } from '@codeday/topo/List';
import Page from '../../components/Page';

export default () => (
  <Page slug="/info/speaker" title="Information For Speakers">
    <Content maxWidth="lg">
      <Heading as="h2" size="xl" mb={4}>Information for Speakers</Heading>
        <Box mb={12}>
          <Text>
            Thanks for speaking at CodeLabs! This page will let you know what to expect, but if you have any additional
            questions just reach out to your contact.
          </Text>
        </Box>
        <Box mb={12}>
          <Heading as="h3" size="lg" mb={2}>The Audience</Heading>
          <Text>
            CodeLabs is divided into two tracks. You're welcome to write your presentation with either/both audience in
            mind, however <Text bold as="span">most people write their talk with the Advanced Track in mind.</Text>
          </Text>
          <List styleType="disc">
            <ListItem mb={4}>
              <Text bold as="span">Advanced Track:</Text>{' '}
              Mostly college juniors/seniors. This track is for more advanced students who are committed to a career in
              tech, have experience in upper-level courses, and have worked on advanced projects. Most of our
              participants are in this track.
            </ListItem>
            <ListItem>
              <Text bold as="span">Beginner Track:</Text>{' '}
              Mostly high school seniors and college freshman/juniors. This track is for students with CS101/102-level
              experience, who've worked on relatively simple projects.
            </ListItem>
          </List>
        </Box>

        <Box mb={12}>
          <Heading as="h3" size="lg" mb={2}>Talk Formats</Heading>
          <Text>
            <Text bold as="span">Tech talks</Text> provide a deep-dive into a technical subject. This could focus on a
            specific technology you use (e.g. &ldquo;How NewCo Uses Kubernetes&rdquo;), a problem you've solved in the
            past (e.g. &ldquo;How NewCo Rolled Out Feature Y for 10M Users&rdquo;), something you wish all new-hires
            knew (e.g. &ldquo;An Introduction to Edge Computing&rdquo;), or anything else you'd like!
          </Text>
          <Text>
            <Text bold as="span">Career talks/panels</Text> focus on teaching &ldquo;soft skills&rdquo;, exploring
            career paths in tech, and helping students find their way after graduation. You can structure your talk
            using slides, or just have a casual conversation. If you don't plan to use slides, we recommend you create
            a set of bullet points to help you structure your talk.
          </Text>
          <Text>
            <Text bold as="span">Expert lunches</Text> follow a casual Q&amp;A format. Questions are submitted in
            advance by our students, and a member of our staff will facilitate the conversation. You shouldn't need to
            do much to prepare for these talks.
          </Text>
          <Text>
            (If none of these formats perfectly describes what you'd like to do, that's ok too! Just let us know what
            you're planning and we'll work with you to set it up!)
          </Text>
        </Box>

        <Box mb={12}>
          <Heading as="h3" size="lg" mb={2}>Broadcasting/Recording Your Talk</Heading>
          <Text>
            Once your talk is scheduled, all speakers will get an e-signing request for our speaker release form.
            We'll ask you to make two choices on that form:
          </Text>
          <List styleType="disc" mb={4}>
            <ListItem>Can we record your talk for those who couldn't make it?</ListItem>
            <ListItem>Can we share your talk with the public, or only our registered community members?</ListItem>
          </List>
          <Text>
            (If you're hosting a panel with multiple speakers, please make sure everyone's on the same page!)
          </Text>
        </Box>

        <Box mb={12}>
          <Heading as="h3" size="lg" mb={2}>Tech Setup</Heading>
          <Text>
            Your session will be held using Zoom's Webinar feature. Please make sure you have a recent version of Zoom
            installed on the computer you plan to use, as well as a good microphone and webcam.
          </Text>
          <Text>
            We'll need the names and email address of all panelists at least 3 days in advance to invite them.
          </Text>
          <Text>
            We ask that you join 30 minutes before the start of your panel; you'll be placed into a practice session
            where we can check your microphone, video, and screen share (if applicable).
          </Text>
        </Box>
    </Content>
  </Page>
);
