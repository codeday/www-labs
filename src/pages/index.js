import { DateTime } from 'luxon';
import { print } from 'graphql';
import { apiFetch } from '@codeday/topo/utils';
import { sign } from 'jsonwebtoken';
import Page from '../components/Page';
import getConfig from 'next/config';
import Header from '../components/Index/Header';
import Explainer from '../components/Index/Explainer';
import PastProjects from '../components/Index/PastProjects';
import Testimonials from '../components/Index/Testimonials';
import ProjectSlider from '../components/Index/ProjectSlider';
import Tracks from '../components/Index/Tracks';
import { useProgramDates } from '../providers/programDates'
import { IndexQuery } from './index.gql';
import TAs from '../components/Index/TAs';

const { serverRuntimeConfig } = getConfig();

export default function Home() {
  const { startsAt, endsAt } = useProgramDates();
  const now = DateTime.local();
  return (
    <Page darkHeader slug="/">
      <Header mt={-40} pt={32} pb={16} mb={16} />
      <Explainer />
      <ProjectSlider mt={24} />
      <Tracks />
      <TAs />
      <Testimonials />
      <PastProjects mt={16} />
    </Page>
  );
}

export async function getStaticProps() {
  const accountToken = sign({ scopes: `read:users` }, serverRuntimeConfig.gql.accountSecret, { expiresIn: '5m' });
  const data = await apiFetch(
    print(IndexQuery),
    {},
    { Authorization: `Bearer ${accountToken}` },
  );

  return {
    props: {
      query: data || {},
      random: Math.random(),
    },
    revalidate: 240,
  };
}
