import { print } from 'graphql';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import { decode, sign } from 'jsonwebtoken';
import { Box, Button, Spinner, Heading, Link } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import LockIcon from '@codeday/topocons/Icon/Lock';
import { Accordion, AccordionItem, AccordionButton as AccordionHeader, AccordionPanel, AccordionIcon} from '@chakra-ui/react';
import Page from '../../../../components/Page';
import CenteredMessagePage from '../../../../components/Dashboard/CenteredMessagePage';
import { useSwr, useFetcher } from '../../../../dashboardFetch';
import MentorProfile from '../../../../components/Dashboard/MentorProfile';
import ProjectEditor from '../../../../components/Dashboard/ProjectEditor';
import { MentorPageQuery, ProjectAddMutation } from './mentor.gql';
import { useColorModeValue } from '@codeday/topo/Theme';

export default function MentorDashboard({ id, mentorToken }) {
  const { query } = useRouter();
  const { loading, error, data, revalidate } = useSwr(print(MentorPageQuery), { id });
  const fetch = useFetcher();
  const { success, error: errorToast } = useToasts();
  const headerBg = useColorModeValue('gray.50', 'gray.900');

  if (!data?.labs?.mentor || loading || error) return <CenteredMessagePage title="Mentor Editor"><Spinner /></CenteredMessagePage>;
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
              bg={headerBg}
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
            <AccordionItem key={project.id || i}>
              <AccordionHeader
                borderBottomWidth={1}
                bg={headerBg}
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
          <AccordionItem>
            <AccordionHeader
              borderBottomWidth={1}
              bg={headerBg}
              fontWeight="bold"
            >
              Create Project
              <AccordionIcon />
            </AccordionHeader>
            <AccordionPanel>
              {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((e) => (
                <Button
                  key={e}
                  mr={2}
                  onClick={async () => {
                    try {
                      await fetch(ProjectAddMutation, {
                        mentor: mentor.id,
                        data: { track: e }
                      });
                      success('Project added.');
                      revalidate();
                    } catch(ex) {
                      errorToast(ex.toString());
                      revalidate();
                    }
                  }}
                >
                  New {e[0]}{e.slice(1).toLowerCase()} Project
                </Button>
              ))}
            </AccordionPanel>
          </AccordionItem>
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
