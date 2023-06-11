import { print } from 'graphql';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { decode, sign } from 'jsonwebtoken';
import { Box, Button, Spinner, Heading, Link } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import LockIcon from '@codeday/topocons/Icon/Lock';
import { Accordion, AccordionItem, AccordionButton as AccordionHeader, AccordionPanel, AccordionIcon, useColorMode } from '@chakra-ui/react';
import Page from '../../../../components/Page';
import { useSwr } from '../../../../dashboardFetch';
import MentorProfile from '../../../../components/Dashboard/MentorProfile';
import ProjectEditor from '../../../../components/Dashboard/ProjectEditor';
import { MentorPageQuery } from './mentor.gql';

export default function MentorDashboard({ id, mentorToken }) {
  const { query } = useRouter();
  const { loading, error, data } = useSwr(print(MentorPageQuery), { id });
  const { colorMode } = useColorMode();
  if (!data?.labs?.mentor) return <Page title="Mentor Editor"><Content textAlign="center"><Spinner /></Content></Page>
  const mentor = data.labs.mentor;
  const mentorPriorParticipation = data.labs.mentorPriorParticipation;
  return (
    <Page title={mentor.name}>
      <Content mt={-8}>
        <Button as="a" href={`/dash/mm/${query.token}`}>&laquo; Back</Button>
        <Box mb={8} mt={4}>
          <Heading as="h2" fontSize="5xl">{mentor.givenName} {mentor.surname}</Heading>
          <Link as="a" href={`/dash/m/${mentorToken}`} target="_blank">
            <LockIcon /> {mentor.givenName}'s Mentor Dashboard
          </Link>
        </Box>

        <Accordion borderWidth={1} borderTopWidth={0} defaultIndex={0} allowToggle={true}>
          <AccordionItem>
            <AccordionHeader
              borderBottomWidth={1}
              bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
              fontWeight="bold"
            >
              Mentor Profile
              <AccordionIcon />
            </AccordionHeader>
            <AccordionPanel>
              <MentorProfile
                mentor={mentor}
                priorParticipation={mentorPriorParticipation}
              />
            </AccordionPanel>
          </AccordionItem>
          {data?.labs?.mentor?.projects && data?.labs?.mentor?.projects?.map((project, i) => (
            <AccordionItem>
              <AccordionHeader
                borderBottomWidth={1}
                bg={colorMode === 'dark' ? 'gray.900' : 'gray.50'}
                fontWeight="bold"
              >
                Project {i+1}
                <AccordionIcon />
              </AccordionHeader>
              <AccordionPanel>
                <ProjectEditor tags={data.labs.tags} project={project} />
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Content>
    </Page>
  );
}

export function getServerSideProps({ query: { mentor, token } }) {
  const { serverRuntimeConfig } = getConfig();
  const { evt } = decode(token);
  const mentorToken = sign(
    { typ: 'm', tgt: 'i', sid: mentor, evt },
    serverRuntimeConfig.gql.secret,
    { audience: serverRuntimeConfig.gql.audience, expiresIn: '12w' }
  );
  return { props: {
    id: mentor,
    mentorToken,
  } };
}
