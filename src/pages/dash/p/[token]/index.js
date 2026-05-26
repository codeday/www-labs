import { useMemo, useState } from 'react';
import { apiFetch } from '@codeday/topo/utils';
import { Box, Checkbox, Grid, Heading } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { Select } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import Page from '../../../../components/Page';
import { PartnerStudentsAbout, PartnerStudentsAboutLimited } from './index.gql';
import StudentList from '../../../../components/Dashboard/StatusOverview/StudentList';
import { StudentCsv } from '../../../../components/Dashboard/StudentCsv';
import AssociateStudentForm from '../../../../components/Dashboard/AssociateStudentForm';
import PartnerStudentEntry from '../../../../components/Dashboard/PartnerStudentEntry';

const FILTER_OPTIONS = [
  { value: 'all', label: 'Show all' },
  { value: 'peer', label: 'Show peer reflections' },
  { value: 'self', label: 'Show self-reflections' },
  { value: 'other', label: 'Show assigned reflections' },
  { value: 'notes', label: 'Show notes' },
  { value: 'meta', label: 'Show metadata' },
];

function useStudentsWithTrainingInfo(students) {
  return useMemo(() => students
    .filter((s) => s.status !== 'CANCELED')
    .sort((a, b) => {
      const mentorA = a.projects?.[0]?.mentors?.[0]?.name || '';
      const mentorB = b.projects?.[0]?.mentors?.[0]?.name || '';
      return mentorA.localeCompare(mentorB);
    })
    .map((s) => {
      const trainingSubmissions = (s.projects || []).flatMap((p) => p.tags)
        .filter((t) => t.trainingLink)
        .map((t) => ({
          submission: s.tagTrainingSubmissions.filter((ts) => ts.tag.id === t.id)[0]?.url,
          createdAt: s.tagTrainingSubmissions.filter((ts) => ts.tag.id === t.id)[0]?.createdAt,
          ...t,
        }));
      return { ...s, trainingSubmissions };
    }), [students]);
}

function FilterControls({ filter, onFilterChange, showAll, onShowAllChange }) {
  return (
    <>
      <Select onChange={(e) => onFilterChange(e.target.value)} value={filter}>
        {FILTER_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </Select>
      <Checkbox isChecked={!showAll} onChange={() => onShowAllChange(!showAll)} mb={4}>
        Only active students
      </Checkbox>
    </>
  );
}

export default function PartnerPage({ students, event, hidePartner }) {
  const { query } = useRouter();
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState('all');
  const studentsWithTrainingInfo = useStudentsWithTrainingInfo(students);
  const visibleStudents = studentsWithTrainingInfo.filter((s) => showAll || s.status === 'ACCEPTED');

  return (
    <Page>
      <Content>
        <Heading as="h3" fontSize="3xl" mt={-8} mb={4}>{event.name}</Heading>

        <Grid templateColumns={{ base: '1fr', md: '1fr 3fr' }} gap={8}>
          <Box>
            <FilterControls
              filter={filter}
              onFilterChange={setFilter}
              showAll={showAll}
              onShowAllChange={setShowAll}
            />

            <Heading as="h3" fontSize="md" bold>
              Students
              <StudentCsv
                pl={2}
                textColor="current.textLight"
                students={studentsWithTrainingInfo}
                onlyAccepted={!showAll}
              />
            </Heading>
            <StudentList students={studentsWithTrainingInfo} onlyAccepted={!showAll} />

            {!hidePartner && <AssociateStudentForm />}
          </Box>
          <Box>
            {visibleStudents.map((s) => (
              <PartnerStudentEntry
                key={s.id}
                student={s}
                event={event}
                token={query.token}
                filter={filter}
                hidePartner={hidePartner}
              />
            ))}
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ params: { token } }) {
  const result = await apiFetch(PartnerStudentsAbout, {}, {
    'X-Labs-Authorization': `Bearer ${token}`,
  });

  return {
    props: {
      students: result?.labs?.students,
      event: result?.labs?.event,

    },
  };
}

export async function getServerSidePropsLimited({ params: { token } }) {
  const result = await apiFetch(PartnerStudentsAboutLimited, {}, {
    'X-Labs-Authorization': `Bearer ${token}`,
  });

  return {
    props: {
      students: result?.labs?.students,
      event: result?.labs?.event,

    },
  };
}
