import { Heading, Link, Text } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../../../../components/Page';
import Calendly from '../../../../components/Calendly';
import { useRouter } from 'next/router';

export default function Help() {
  const { query } = useRouter();
  return (
    <Page title="Help">
      <Content mt={-6} maxW="container.lg">
        <Heading as="h2" mb={0}>Book Coding Help Meeting</Heading>
        <Text>(You may attend on your own, or with teammates.)</Text>
        <Link href={`/dash/s/${query?.token}`}>&laquo; Back to dashboard</Link>
        <Calendly
          slug="codeday-student-support"
          meeting="pair-programming-meeting"
          w="100%"
        />
      </Content>
    </Page>
  );
}
