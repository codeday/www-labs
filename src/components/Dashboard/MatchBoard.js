import { Table, Th, Tr, Td, Tbody, Thead, Grid } from '@chakra-ui/react';
import { Box, Text, Link, Heading, Checkbox } from '@codeday/topo/Atom';
import IconShipped from '@codeday/topocons/Icon/Shipped';
import { memo, useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SurveyFields from '../SurveyFields';
import randomColor from 'randomcolor';
import { overlapBitmasks, timeManagementPlanToBitmask } from '../../utils';

const CONDENSE_FACTOR = 4;

function MentorDetails({ mentor, ...rest }) {
  return <Box mb={2} mt={2} p={2} borderWidth={1} borderRadius={4} d="inline-block" {...rest}>
    <Text>{mentor.name} ({mentor.maxWeeks} weeks)</Text>
    <Text fontSize="xs"><b>Timezone:</b> {mentor.timezone}</Text>
  </Box>
}

function ProjectDetails({ project, displayDescription, displayDeliverables, ...rest }) {
  const maxWeeks = useMemo(
    () => Math.max(...(project.mentors || []).map(m => m.maxWeeks)),
    [project.mentors]
  );
  return <Box {...rest}>
    {project.status === 'MATCHED' && <Box pl={1} pr={1} mb={1} display="inline-block" borderWidth={1} borderRadius={2} backgroundColor="red.400" color="red.900" fontSize="xs" fontWeight="900">WARNING: INTRO ALREADY SENT</Box>}
    {(project.issueUrl || project.repository?.name) && (
      <Text>
          {project.issueUrl && <Link href={project.issueUrl} target="_blank"><IconShipped /></Link>}
          {project.repository?.name ?
            <Link href={project.repository.url} target="_blank">{project.repository.name}</Link> :
            <Link href={project.issueUrl} target="_blank">{project.issueUrl.split('/').slice(3,5).join('/')}</Link>
          }
        </Text>
      )}
      <Text>{maxWeeks} weeks</Text>
      {displayDescription && <Text>{project.description}</Text>}
      {displayDeliverables && <Text>{project.deliverables}</Text>}
      {project.mentors.map(m => (
        <MentorDetails key={m.id} mentor={m} />
      ))}
    </Box>
}

function shrink(arr, chunkSize) {
  const out = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    let found = 0;
    for (let j = 0; j < chunkSize; j++) {
      if (arr[i+j]) found = 1;
      break;
    }
    out.push(found);
  }
  return out;
}

const WeekActivity = memo(function WeekActivity({ divs, barWidth }) {
  return <Box display="flex" flexDirection="row" borderWidth={1} width={`${(divs.length * barWidth) + 6}px`} height={2}>
    {[0,1,2,3,4,5,6].map(i => [...(i === 0 ? [] : [<Box borderLeftWidth={1} />]), ...divs.slice(i * (divs.length/7), (i+1) * (divs.length/7))])}
  </Box>
})

const TimeDisplayOverlap = memo(function TimeDisplayOverlap({ brightness }) {
  console.log(brightness)
  const divs = useMemo(() => 
    brightness.map((b, i) => <Box backgroundColor="green.500" opacity={b} w={`${CONDENSE_FACTOR}px`} h="100%" />
  ), [brightness]);
  return <WeekActivity divs={divs} barWidth={CONDENSE_FACTOR} />
})

const TimeDisplay = memo(function TimeDisplay({ bitmask }) {
  const divs = useMemo(() => bitmask.map(b => <Box backgroundColor={b ? 'green.500' : 'transparent'} w={`${CONDENSE_FACTOR}px`} h="100%" />), [bitmask]);
  return <WeekActivity divs={divs} barWidth={CONDENSE_FACTOR} />
})

function StudentDetails({ student, displayPartnerContractData, displayTimeOverlap, bitmask, ...rest }) {
  return <Box borderWidth={1} borderRadius={4} mb={2} d="inline-block" {...rest}>
    <Box display="flex" flexDirection="row" justifyContent="space-between">
      <Box
        backgroundColor={randomColor({ luminosity: 'bright', seed: student.partnerCode || 'DIRECT' })}
        color="black"
        lineHeight="1"
        pr="2px"
        fontSize="8px"
        style={{ writingMode: 'vertical-rl' }}
        maxHeight="100%"
        overflow="hidden"
        textAlign="center"
        textTransform="uppercase"
        fontWeight="900"
        borderLeftRadius={4}
      >
        {student.partnerCode || 'DIRECT'}
      </Box>
      <Box p={2} pl={1}>
        <Text>{student.name} ({student.minHours}hr/{student.weeks}wk)</Text>
        <Text fontSize="xs"><b>Timezone:</b> {student.timezone}</Text>
        {displayPartnerContractData ? <Text fontSize="xs"><SurveyFields inline content={student.partnerContractData} /></Text> : null}
        {displayTimeOverlap ? <TimeDisplay bitmask={bitmask} /> : null}
      </Box>
    </Box>
  </Box>
}

export default function MatchBoard({ projects, students, onChange, ...rest }) {
  const [displayDescription, setDisplayDescription] = useState(false);
  const [displayDeliverables, setDisplayDeliverables] = useState(false);
 
  const [displayPartnerContractData, setDisplayPartnerContractData] = useState(false);
  const [displayTimes, setDisplayTimes] = useState(false);

  const [windowReady, setWindowReady] = useState(false);
  useEffect(() => {
    setWindowReady(true);
  }, []);

  const studentsById = useMemo(
    () => Object.fromEntries(students.map(s => [s.id, s])),
    [students]
  );

  const studentBitmasks = useMemo(
    () => Object.fromEntries(students.map(s => [s.id, shrink(timeManagementPlanToBitmask(s.timeManagementPlan, s.timezone, true), CONDENSE_FACTOR)])),
    [students]
  );

  const [ projectAssignments, updateProjectAssignments ] = useReducer(
    (state, { projectId, studentId }) => ({
      ...Object.fromEntries(Object.entries(state).map(([id, sIds]) => [id, sIds.filter(sId => sId !== studentId)])),
      ...(projectId !== 'unassigned' ? {[projectId]: [...state[projectId].filter(sId => sId !== studentId), studentId]} : {}),
    }),
    Object.fromEntries(projects.map(p => [p.id, p.students.map(s => s.id)]))
  );

  const projectOverlapBitmasks = useMemo(
    () => Object.fromEntries(
      Object.entries(projectAssignments).map(([projectId, studentIds]) => [projectId, overlapBitmasks(studentIds.map(sId => studentBitmasks[sId]), 1)])
    ),
    [projectAssignments, studentBitmasks]
  );

  const assignedStudentIds = useMemo(
    () => Object.entries(projectAssignments).flatMap(([_, studentIds]) => studentIds),
    [projectAssignments]
  );

  const visibleStudents = useMemo(() => students.filter(s => s.status === 'ACCEPTED' || assignedStudentIds.includes(s.id)), [students, assignedStudentIds]);
  const visibleProjects = useMemo(() => projects.filter(p => p.status === 'ACCEPTED' || p.status === 'MATCHED' || projectAssignments[p.id]?.length > 0), [projects]);

  const unassignedStudentIds = useMemo(
    () => (visibleStudents || []).filter(s => !assignedStudentIds.includes(s.id)).map(s => s.id),
    [assignedStudentIds, visibleStudents]
  );

  const onDragEnd = useCallback((result) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    updateProjectAssignments({ projectId: destination.droppableId, studentId: draggableId });
  }, []);

  useEffect(() => {
    onChange(projectAssignments);
  }, [projectAssignments, onChange]);
  
  if (!windowReady) return null;
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Box {...rest}>
        <Grid templateColumns="2fr 1fr" gap={4}>
 
          <Table>
            <Thead>
              <Tr>
                <Th w="50%">Project</Th>
                <Th w="50%">Student</Th>
              </Tr>
            </Thead>
            <Tbody verticalAlign="top">
              {visibleProjects.map(p => (
                <Tr key={p.id}>
                  <Td>
                    <ProjectDetails
                      project={p}
                      displayDescription={displayDescription}
                      displayDeliverables={displayDeliverables}
                    />
                    {projectAssignments[p.id].length > 1 && (
                      <TimeDisplayOverlap brightness={projectOverlapBitmasks[p.id]} />
                    )}
                  </Td>
                  <Td>
                    <Droppable droppableId={p?.id || 'unassigned'}>
                      {(provided, snapshot) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                          <Box borderWidth={1} borderRadius={4} borderColor={snapshot.isDraggingOver ? 'green.500' : 'default'} p={4} minHeight={32} width="100%">
                            {(p ? projectAssignments[p.id] : unassignedStudentIds).map((s, index) => (
                              <Draggable key={s} draggableId={s} index={index}>
                                {(provided) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps}>
                                    <div {...provided.dragHandleProps}>
                                      <StudentDetails
                                        key={s}
                                        student={studentsById[s]}
                                        displayPartnerContractData={displayPartnerContractData}
                                        displayTimeOverlap={displayTimes}
                                        bitmask={studentBitmasks[s]}
                                      />
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                          </Box>
                        </div>
                      )}
                    </Droppable>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Box>
            <Box position="sticky" top={0} height="100vh">
              <Box borderWidth={1} borderRadius={4} p={4} mb={4}>
                <Heading as="h3" fontSize="md">Display</Heading>
                <Text>
                  Project: 
                  <Checkbox ml={2} mr={6} onChange={(e) => setDisplayDescription(e.target.checked)} checked={displayDescription}>description</Checkbox>
                  <Checkbox ml={2} mr={6} onChange={(e) => setDisplayDeliverables(e.target.checked)} checked={displayDeliverables}>deliverables</Checkbox>
                </Text>
                <Text>
                  Student: 
                  <Checkbox ml={2} mr={6} onChange={(e) => setDisplayPartnerContractData(e.target.checked)} checked={displayPartnerContractData}>partner contract</Checkbox>
                  <Checkbox ml={2} mr={6} onChange={(e) => setDisplayTimes(e.target.checked)} checked={displayTimes}>availability</Checkbox>
                </Text>
              </Box>
              <Heading as="h3" fontSize="lg">{unassignedStudentIds.length} unassigned students</Heading>
              <Box overflow="auto" maxHeight="60%" pb="50vh">
                <Droppable droppableId="unassigned">
                  {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <Box borderWidth={1} borderRadius={4} borderColor={snapshot.isDraggingOver ? 'green.500' : 'transparent'} p={4} minHeight={32} width="100%">
                        {unassignedStudentIds.map((s, index) => (
                          <Draggable key={s} draggableId={s} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps}>
                                <div {...provided.dragHandleProps}>
                                  <StudentDetails
                                    key={s}
                                    student={studentsById[s]}
                                    displayPartnerContractData={displayPartnerContractData}
                                    displayTimeOverlap={displayTimes}
                                    bitmask={studentBitmasks[s]}
                                  />
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </Box>
                    </div>
                  )}
                </Droppable>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
    </DragDropContext>
  )
}
