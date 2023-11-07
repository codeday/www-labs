import { DateTime } from 'luxon';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../components/Page';
import Header from '../components/Index/Header';
import Explainer from '../components/Index/Explainer';
import PastProjects from '../components/Index/PastProjects';
import Testimonials from '../components/Index/Testimonials';
import ProjectSlider from '../components/Index/ProjectSlider';
import Tracks from '../components/Index/Tracks';
import { useProgramDates } from '../providers/programDates'
import { IndexQuery } from './index.gql';

export default function Home() {
  const { startsAt, endsAt } = useProgramDates();
  const now = DateTime.local();
  return (
    <Page darkHeader slug="/">
      <Header mt={-40} pt={32} pb={16} mb={16} />
      <Explainer />
      <ProjectSlider mt={24} />
      <Tracks />
      <Testimonials />
      <PastProjects mt={16} />
    </Page>
  );
}

export async function getStaticProps() {
  const data = await apiFetch(print(IndexQuery));

  return {
    props: {
      query: data || {},
      random: Math.random(),
    },
    revalidate: 240,
  };
}
