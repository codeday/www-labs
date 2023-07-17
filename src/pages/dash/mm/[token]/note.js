import { Box, Button, Grid, Heading, Select, Text, Textarea } from '@codeday/topo/Atom';
import { Content } from "@codeday/topo/Molecule";
import Page from "../../../../components/Page";
import { useState } from 'react';
import { useRouter } from "next/router";
import { apiFetch, useToasts } from '@codeday/topo/utils';
import { AddNoteMutation } from './note.gql';
import Autocomplete from "../../../../components/Dashboard/Autocomplete";
import LiveStudentProjectDetails from '../../../../components/Dashboard/LiveStudentProjectDetails';

export default function AddNotePage() {
  const { query: { token } } = useRouter();
  const [note, setNote] = useState('');
  const [caution, setCaution] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const { success, error } = useToasts();

  return (
    <Page title="Add Note">
      <Content mt={-8}>
        <Heading as="h2" fontSize="2xl">Add Student Note</Heading>
        <Text>
          Notes are visible to managers, mentors, and partner programs but
          NOT to students.
        </Text>

        <Heading mt={8} as="h3" fontSize="md">Student(s):</Heading>
        <Autocomplete
          token={token}
          students={true}
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

            <Heading mt={8} as="h3" fontSize="md">Concern level:</Heading>
            <Select
              onChange={(e) => setCaution(Number.parseFloat(e.target.value))}
              value={caution.toString()}
            >
              <option value="0">No concern / positive note</option>
              <option value="0.5">Moderate concern</option>
              <option value="1">Very concerned</option>
            </Select>

            <Button
              mt={8}
              isLoading={isLoading}
              onClick={async () => {
                setIsLoading(true);
                try {
                  for (const s of students) {
                    await apiFetch(
                      AddNoteMutation,
                      { student: s.id, caution, note },
                      { 'X-Labs-Authorization': `Bearer ${token}` },
                    );
                    success(`Added note for ${s.name}`);
                  }
                  setNote('');
                  setCaution(0);
                } catch (ex) {
                  error(ex.toString());
                }
                setIsLoading(false);
              }}
              disabled={!note || students.length === 0}
            >
              Add note to {students.length} students
            </Button>
          </Box>
          <Box>
            <Heading as="h3" fontSize="md">Projects:</Heading>
            <LiveStudentProjectDetails
              token={token}
              studentIds={students.map(s => s.id)}
              fontSize="sm"
            />
          </Box>
        </Grid>
      </Content>
    </Page>
  );
}