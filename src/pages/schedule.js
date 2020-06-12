import moment from 'moment-timezone';
import Page from '../components/Page';
import Calendar from '../components/index/calendar';
import { getCalendar } from '../utils/airtable';


export const getServerSideProps = async () => ({
  props: {
    calendar: (await getCalendar()).map((item) => item.fields),
  }
})

export default function Home({ calendar }) {
  const calendarHydrated = calendar.map((e) => ({ ...e, Date: moment.utc(e.Date).tz('America/Los_Angeles') }));
  return (
    <Page slug="/schedule" title="Schedule">
      <Calendar calendar={calendarHydrated} />
    </Page>
  );
 }
