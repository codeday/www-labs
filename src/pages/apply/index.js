
import { print } from 'graphql';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import List, { Item } from '@codeday/topo/Atom/List';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../components/Page';
import Header from '../../components/Index/Header';
import Explainer from '../../components/Index/Explainer';
import CheckApplicationsOpen from '../../components/CheckApplicationsOpen';
import { IndexQuery } from './index.gql';

export default function ApplyHome() {
  return (
    <Page slug="/apply" title="Apply">
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl" marginBottom={12}>Student Application</Heading>
        <CheckApplicationsOpen>
          <Grid textAlign="center" templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap={8}>
            <Box>
              <Heading as="h3" fontSize="lg">Beginner Track</Heading>
              <Text>For most high school students.</Text>
              <List textAlign="left" styleType="disc" stylePos="outside" pl={4} mb={8}>
                <Item mb={4}>
                  Your mentor will be an older student who has been an intern at a tech company and is knowledgeable
                  in their field.
                </Item>
                <Item mb={4}>
                  The beginner track is designed to give you a jump start into the tech industry and set you
                  up for success in future education and internship searches. The project you complete will inform your
                  insight into the different subsets of CS and engineering, and you will be able to use it on your resumé.
                </Item>
                <Item mb={4}>
                  Your mentor will provide a lot of guidance on how to structure your project and help you debug
                  problems as they come up. They will provide you with the tools to succeed in the program, and teach
                  you how to work collaboratively with industry technologies.
                </Item>
                <Item mb={4}>
                  You must have taken AP CS, more advanced HS engineering course, a college CS or
                  Engineering 1/101 course, or be able to demonstrate similar knowledge or interest in tech.
                  (If you have significant project-based experience, the intermediate track may be a better fit.)
                </Item>
                <Item mb={4}>
                  There is a <Text as="span" mb={0} bold>$250 fee</Text> if accepted to confirm your spot, which helps
                  pay your mentor for the hands-on help they provide. Recognizing this is a barrier for many students,{' '}
                  <Text as="span" mb={0} bold>many scholarships are available</Text> for students who need them.
                </Item>
              </List>
              <Button as="a" href="/apply/beginner" variantColor="green">Apply for the Beginner Track</Button>
            </Box>
            <Box>
              <Heading as="h3" fontSize="lg">Intermediate/Advanced Track</Heading>
              <Text>For most college students.</Text>
              <List textAlign="left" styleType="disc" stylePos="outside" pl={4} mb={8}>
                <Item mb={4}>
                  Your mentor will be a current/retired professional software developer from a tech company.
                </Item>
                <Item mb={4}>
                  The intermediate and advanced tracks are designed for you to get a feel for what working at
                  a real company on real projects is like. The project you complete may be used by others in the
                  industry, and you will be able to use it on your resumé.
                </Item>
                <Item mb={4}>
                  Styled after a traditional internship experience, your mentor will provide some guidance,
                  but you'll need to work independently to plan your proejct, complete tasks, and debug most issues 
                  as they come up.
                </Item>
                <Item mb={4}>
                  You need to know how to work collaboratively and be willing to pick up a tech stack
                  you haven't used before. Intermediate track requires a college-level intro series and some project
                  experience. Advanced track
                  requires upper-level college courses. We'll recommend which track you are qualified for after you apply.
                </Item>
                <Item mb={4}>
                  There is no fee to participate. This is not a paid internship; you&apos;ll be working on open-source
                  software which doesn't directly benefit your mentor.
                </Item>
              </List>
              <Button as="a" href="/apply/advanced" variantColor="green">Apply for the Intermediate/Advanced Tracks</Button>
            </Box>
          </Grid>
        </CheckApplicationsOpen>
      </Content>
    </Page>
  );
}

export async function getStaticProps() {
  const data = await apiFetch(print(IndexQuery));

  return {
    props: {
      query: data || {},
      random: Math.random(),
    },
    revalidate: 240,
  };
}
