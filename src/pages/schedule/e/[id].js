import { useRouter } from 'next/router';
import moment from 'moment-timezone';
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
      <Event event={event} />
    </Page>
  );
 }
