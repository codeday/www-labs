import { DateTime } from 'luxon';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../components/Page';
import Header from '../components/Index/Header';
import Explainer from '../components/Index/Explainer';
import PastProjects from '../components/Index/PastProjects';
import Testimonials from '../components/Index/Testimonials';
import Calendar from '../components/Index/Calendar';
import Tracks from '../components/Index/Tracks';
import { IndexQuery } from './index.gql';

export default function Home() {
  return (
    <Page darkHeader slug="/">
      <Header mt={-40} pt={32} pb={16} mb={16} />
      <Explainer />
      <Tracks />
      <Testimonials />
      <PastProjects mt={16} />
      <Calendar mt={16} />
    </Page>
  );
}

export async function getStaticProps() {
  const data = await apiFetch(print(IndexQuery), {
    thisYearCalendarStart: DateTime.local().set({ month: 6, day: 1}).toISODate(),
    thisYearCalendarEnd: DateTime.local().set({ month: 9, day: 1}).toISODate(),
    lastYearCalendarStart: DateTime.local().plus({ years: -1 }).set({ month: 6, day: 1}).toISODate(),
    lastYearCalendarEnd: DateTime.local().plus({ years: -1 }).set({ month: 9, day: 1}).toISODate(),
  });

  return {
    props: {
      query: data || {},
      random: Math.random(),
    },
    revalidate: 240,
  };
}
