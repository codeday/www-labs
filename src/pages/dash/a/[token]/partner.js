import { useReducer, useState } from 'react';
import { print } from 'graphql';
import { useRouter } from 'next/router';
import { Box, Button, Heading, TextInput as Input } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import { useToasts } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { useFetcher } from '../../../../dashboardFetch';
import SelectStudentStatus from '../../../../components/Dashboard/SelectStudentStatus';
import { SaveStudentStatus, FindByPartnerCode } from './partner.gql';
import { useColorMode } from '@chakra-ui/react';

function Entry({ student, ...rest }) {
  const [status, setStatus] = useState(student.status);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToasts();
  const fetch = useFetcher();
  return (
    <Box as="tr" {...rest}>
      <Box as="td" pt={4} pb={4}>
        {student.givenName} {student.surname}<br />
        #{student.id}<br />
        {student.weeks} weeks
      </Box>
      <Box as="td">{student.email}</Box>
      <Box as="td">{student.track}</Box>
      <Box as="td" bg={{'ACCEPTED': 'green.700', 'REJECTED': 'red.700', 'CANCELED': 'red.700', 'OFFERED': 'yellow.500'}[status]}>
        <SelectStudentStatus status={status} onChange={(e) => setStatus(e.target.value)} />
      </Box>
      <Box as="td">
        <Button
          isLoading={loading}
          disabled={loading}
          colorScheme="purple"
          onClick={async () => {
            setLoading(true);
            try {
              await fetch(SaveStudentStatus, { id: student.id, status: status });
              success('Saved!');
            } catch (ex) {
              error(ex.toString());
            }
            setLoading(false);
          }}
        >
          Save
        </Button>
      </Box>
    </Box>
  )
}

export default function AdminPartner() {
  const { query } = useRouter();
  const [partnerCode, setPartnerCode] = useState();
  const { success, error } = useToasts();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { colorMode } = useColorMode();
  const fetch = useFetcher();

  return (
    <Page title="Partner Students">
      <Content mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mt={4}>Partner Students</Heading>
        <Box mb={8}>
          <Box d="inline-block">
            <Input placeholder="Partner Code" value={partnerCode} onChange={(e) => setPartnerCode(e.target.value)} />
          </Box>
          <Button
            ml={1}
            isLoading={loading}
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const res = await fetch(FindByPartnerCode, { code: partnerCode });
                setStudents(res.labs.students);
              } catch (ex) {
                error(ex.toString());
              }
              setLoading(false);
            }}
          >
            Search
          </Button>
        </Box>

        <Box mb={8}>
          total {students.length}{' / '}
          accepted {students.filter(({ status }) => status === 'ACCEPTED').length}{' / '}
          offered {students.filter(({ status }) => status === 'OFFERED').length}
        </Box>

        <Box as="table" w="100%">
          <Box as="tr" fontWeight="bold" borderBottomColor="black" borderBottomWidth={1}>
            <Box as="td">Name</Box>
            <Box as="td">Email</Box>
            <Box as="td">Track</Box>
            <Box as="td">Status</Box>
            <Box as="td">&nbsp;</Box>
          </Box>
          {students.map((s, i) => (
            <Entry
              key={s.id}
              student={s}
              bg={i % 2 === 1 ? (colorMode === 'dark' ? 'gray.800' : 'gray.100') : undefined}
            />
          ))}
        </Box>
      </Content>
    </Page>
  );
}
