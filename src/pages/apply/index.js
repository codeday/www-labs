
import { print } from 'graphql';
import Box, { Grid } from '@codeday/topo/Atom/Box';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import List, { Item } from '@codeday/topo/Atom/List';
import Button from '@codeday/topo/Atom/Button';
import Content from '@codeday/topo/Molecule/Content';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../components/Page';
import Comparison from '../../components/Comparison';
import TrackRecommender from '../../components/TrackRecommender';
import CheckApplicationsOpen from '../../components/CheckApplicationsOpen';
import { IndexQuery } from './index.gql';

const TRACK_COMPARISON_FACTORS = [
  {
    title: `Your Mentor`,
    left: `Your mentor will be an older student with deep technical knowledge who has been an intern at a tech company.`,
    right: `Your mentor will be a current/retired professional software developer from a tech company.`,
  },
  {
    title: `The Goal`,
    left: `The beginner track is designed to give you a jump start into the tech industry and set you up for success in`
          + ` future education and internship searches. It's a hands-on summer program.`,
    right: `The intermediate and advanced tracks are designed for you to get a feel for what working at a real company`
          + ` on real projects is like. It's modeled after an internship.`,
  },
  {
    title: `The Project`,
    left: `The project you complete will give you insight into the different subsets of CS and engineering. It will`
          + ` look good on a resumé when applying for colleges or internships.`,
    right: `The project you complete may be used by others in the industry. It will look similar to a traditional`
          + ` internship project on your resumé when applying for internships or full-time jobs.`,
  },
  {
    title: `Guidance`,
    left: `Your mentor will provide a lot of guidance on how to structure your project and help you debug problems as`
          + ` they come up. They will also help you learn to work on a large project collaboratively.`,
    right: `Styled after a traditional internship experience, your mentor will provide some guidance, but you'll need`
          + ` to work independently to plan your proejct, complete tasks, and debug simple issues as they come up.`,
  },
  {
    title: `Prerequisites`,
    left:  `You must have taken AP CS, more advanced HS engineering course, a college CS or Engineering 1/101 course,`
          + ` or be able to demonstrate similar knowledge or interest in tech. (If you have significant project-based`
          + ` experience outside of calss, the intermediate track may be a better fit.)`,
    right: `All applicants should be comfortable with solving problems without step-by-step guidance. Intermediate`
          + ` track requires a college-level intro series and some project experience. Advanced track requires`
          + ` upper-level college courses. We'll recommend which track you are qualified for after you apply.`,
  },
  {
    title: `Cost`,
    left: `If accepted, there is a $250 fee to confirm your spot (which helps pay your mentor). We know this is a`
          + ` barrier for many students, and many scholarships are available for those who need them.`,
    right: `There is no fee to participate.`,
  },
  {
    title: `Not A Paid Internship`,
    left: `Not a paid internship; you will be working on an open-source project which does not benefit your mentor.`,
    right: `Not a paid internship; you will be working on an open-source project which does not benefit your mentor.`,
  },
]

export default function ApplyHome() {
  return (
    <Page slug="/apply" title="Apply">
      <Content mt={-8}>
        <Heading as="h2" fontSize="4xl" textAlign="center" marginBottom={12}>
          Choose which track you'd like to apply for:
        </Heading>
        <CheckApplicationsOpen>
          <Comparison
            leftTop={(
              <Box textAlign="center">
                <Heading as="h3" fontSize="xl">Beginner Track</Heading>
                <Text>For most high school students.</Text>
              </Box>
            )}
            rightTop={(
              <Box textAlign="center">
                <Heading as="h3" fontSize="xl">Intermediate/Advanced Track</Heading>
                <Text>For most college students.</Text>
              </Box>
            )}
            leftBottom={(
              <Box textAlign="center">
                <Button as="a" href="/apply/beginner" variantColor="green">Apply for the Beginner Track</Button>
              </Box>
            )}
            rightBottom={(
              <Box textAlign="center">
                <Button as="a" href="/apply/advanced" variantColor="green">Apply for the Intermediate/Advanced Tracks</Button>
              </Box>
            )}
            factors={TRACK_COMPARISON_FACTORS}
          />
          <TrackRecommender mt={16} />
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
