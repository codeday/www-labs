import moment from 'moment-timezone';
import { Content } from '@codeday/topo/Box';
import Text, { Link } from '@codeday/topo/Text';
import Page from '../../components/Page';
import Calendar from '../../components/index/calendar';
import { getCalendar } from '../../utils/airtable';

export const getServerSideProps = async () => {
  let calendar;
  try {
    calendar = await getCalendar();
  } catch (err) {
    console.error('airtable is down (again) and the cache is empty.');
  }
  return {
    props: {
      calendar,
    },
  };
};

export default function Home({ calendar }) {
  const calendarHydrated = calendar.map((e) => ({ ...e, Date: moment.utc(e.Date).tz('America/Los_Angeles') }));

  return (
    <Page slug="/schedule" title="Schedule">
      <Content>
        <Text mb={16}>
          You can add these events to your calender using this link: <Link href="/api/ics">ICS Format</Link><br />
          (In Google Calendar, find "Other calendars," click +, choose "From URL", and copy-paste that link.)
        </Text>
      </Content>
      <Calendar calendar={calendarHydrated} />
    </Page>
  );
}
