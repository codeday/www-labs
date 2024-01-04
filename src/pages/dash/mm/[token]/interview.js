import { Box, Button, Grid, Heading, Select, Text, Textarea } from '@codeday/topo/Atom';
import { Content } from "@codeday/topo/Molecule";
import Page from "../../../../components/Page";
import { useEffect, useState } from 'react';
import { useRouter } from "next/router";
import { apiFetch, useToasts } from '@codeday/topo/utils';
import { GetInterviewNoteMutation, SetInterviewNoteMutation } from './interview.gql';
import Autocomplete from "../../../../components/Dashboard/Autocomplete";
import LiveStudentProjectDetails from '../../../../components/Dashboard/LiveStudentProjectDetails';

export default function AddInterviewNotePage() {
  const { query: { token } } = useRouter();
  const [note, setNote] = useState('');
  const [caution, setCaution] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const { success, error } = useToasts();

  useEffect(async () => {
    if (students.length === 0) return setNote('');

    const result = await apiFetch(
      GetInterviewNoteMutation,
      { student: students[0].id },
      { 'X-Labs-Authorization': `Bearer ${token}` },
    );
    setNote(result.labs.student.interviewNotes);
  }, [students]);

  return (
    <Page title="Add Note">
      <Content mt={-8}>
        <Heading as="h2" fontSize="2xl">Add Interview Note</Heading>
        <Text>
          This is for admissions interviews only.
        </Text>

        <Heading mt={8} as="h3" fontSize="md">Student(s):</Heading>
        <Autocomplete
          token={token}
          students={true}
          status={['APPLIED', 'TRACK_INTERVIEW']}
          max={1}
          onChange={setStudents}
        />
        <Grid mt={8} templateColumns={{ base: '1fr', md: '2fr 1fr' }} gap={8}>
          <Box>
            <Heading as="h3" fontSize="md">Note:</Heading>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              h={48}
            />

            <Button
              mt={8}
              isLoading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  for (const s of students) {
                    await apiFetch(
                      SetInterviewNoteMutation,
                      { student: s.id, note },
                      { 'X-Labs-Authorization': `Bearer ${token}` },
                    );
                    success(`Updated interview note for ${s.name}`);
                  }
                } catch (ex) {
                  error(ex.toString());
                }
                setIsLoading(false);
              }}
              disabled={!note || students.length === 0}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}