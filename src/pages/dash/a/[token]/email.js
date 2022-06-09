import { useReducer, useState } from 'react';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { Box, Button, Heading, TextInput as Input, Textarea, Select } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { useFetcher } from '../../../../dashboardFetch';
import { SendMentorEmail, SendStudentEmail } from './email.gql';

export default function AdminSendEmail() {
  const { query } = useRouter();
  const [studentWeeks, setStudentWeeks] = useState();
  const [track, setTrack] = useState();
  const [target, setTarget] = useState();
  const [subject, setSubject] = useState();
  const [body, setBody] = useState();
  const [isLoading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const fetch = useFetcher();

  return (
    <Page title="Send Email">
      <Content mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mb={8} mt={4}>Send Email</Heading>
        <Select placeholder="To" onChange={(e) => setTarget(e.target.value)}>
          <option></option>
          <option value="students">Students</option>
          <option value="mentors">Mentors</option>
        </Select>
        <Select placeholder="Track" onChange={(e) => setTrack(e.target.value)}>
          <option></option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </Select>
        <Input
          placeholder="Weeks GTE"
          onChange={(e) => setStudentWeeks(e.target.value && Number.parseInt(e.target.value))}
          value={studentWeeks || ''}
        />
        <Input onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
        <Textarea onChange={(e) => setBody(e.target.value)} placeholder="Body" />
        <Button
          isLoading={isLoading}
          disabled={isLoading || !subject || !body || !target}
          colorScheme="red"
          onClick={async () => {
            const query = target === 'students' ? SendStudentEmail : SendMentorEmail;
            setLoading(true);
            try {
              const where = {
                track,
                [target === 'students' ? 'weeks' : 'studentWeeks']: studentWeeks ? { gte: studentWeeks } : undefined };
              await fetch(query, { subject, body, where });
              success('Email sent!');
            } catch (ex) {
              error(ex.toString());
            }
            setLoading(false);
          }}
        >
          Send
        </Button>
      </Content>
    </Page>
  );
}
