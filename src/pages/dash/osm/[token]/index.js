import { useRouter } from 'next/router';
import { Content } from '@codeday/topo/Molecule';
import { Box, Button, Grid, Heading, Link, List, ListItem, Spinner } from '@codeday/topo/Atom';
import { useSwr } from '../../../../dashboardFetch';
import Page from '../../../../components/Page';
import { GetRepositoryProjects } from './index.gql';
import { print } from 'graphql';
import { Accordion, AccordionItem, AccordionButton as AccordionHeader, AccordionPanel, AccordionIcon, } from '@chakra-ui/react';
import ProjectEditor from '../../../../components/Dashboard/ProjectEditor';
import { useColorModeValue } from '@codeday/topo/Theme';

export default function AdminDashboard() {
  const { query } = useRouter();
  const { isValidating, data } = useSwr(print(GetRepositoryProjects), {});

  if (!data) return <Page><Content><Spinner /></Content></Page>

  return (
    <Page title="Open Source Manager Dashboard">
      <Content>
        <Accordion borderWidth={1} borderTopWidth={0} defaultIndex={0} allowToggle={true}>
          <AccordionItem>
            <AccordionHeader
              borderBottomWidth={1}
              bg={useColorModeValue('gray.50', 'gray.900')}
              fontWeight="bold"
            >
              Create Project
              <AccordionIcon />
            </AccordionHeader>
            <AccordionPanel>
              <ProjectEditor
                tags={data.labs.tags}
                repositories={data.labs.repositories}
                hideStatus={true}
                project={{
                  tags: [],
                  maxStudents: 4,
                }}
              />
            </AccordionPanel>
          </AccordionItem>
          {data.labs.repositories.map(r => (
            <AccordionItem>
              <AccordionHeader
                borderBottomWidth={1}
                bg={useColorModeValue('gray.50', 'gray.900')}
                fontWeight="bold"
              >
                {r.name} - {r.url}
                <AccordionIcon />
              </AccordionHeader>
              <AccordionPanel>
                <Box as="table" w="100%">
                  <Box as="thead">
                    <Box as="tr">
                      <Box as="th">State</Box>
                      <Box as="th">Link</Box>
                      <Box as="th">Team</Box>
                    </Box>
                  </Box>
                  {r.projects.map(p => (
                    <Box as="tr">
                      <Box as="td">
                        {p.complete ? 'DONE' : p.status}
                      </Box>
                      <Box as="td">
                        <Link as="a" href={p.issueUrl} target="_blank">
                          {p.issueUrl}
                        </Link>
                      </Box>
                      <Box as="td">
                        <List>
                          {p.mentors.map(m => (
                            <ListItem>
                              <Link as="a" href={`mailto:${m.email}`}>{m.name} (mentor)</Link>
                            </ListItem>
                          ))}
                          {p.students.map(s => (
                            <ListItem>
                              <Link as="a" href={`mailto:${s.email}`}>{s.name}</Link>
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Content>
    </Page>
  );
}