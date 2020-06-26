import { useRouter } from 'next/router';
import moment from 'moment-timezone';
import { Content } from '@codeday/topo/Box';
import Text, { Link } from '@codeday/topo/Text';
import Page from '../../../components/Page';
import { getEvent } from '../../../utils/airtable';
import Event from '../../../components/Event';

export const getServerSideProps = async ({ params: { id } }) => {
  return {
    props: {
      event: await getEvent(id),
    },
  };
}

export default function Home({ event }) {
  const { id } = useRouter().query;

  return (
    <Page slug={`/schedule/e/${id}`} title="Schedule">
      <Content>
        <Text fontSize="lg">
          <Link href="/schedule">&laquo; Schedule</Link>
        </Text>
      </Content>
      <Event event={event} />
    </Page>
  );
 }
