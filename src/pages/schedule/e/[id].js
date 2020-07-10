import React from 'react';
import { useRouter } from 'next/router';
import { NextSeo } from 'next-seo';
import absoluteUrl from 'next-absolute-url';
import { Content } from '@codeday/topo/Box';
import Text, { Link } from '@codeday/topo/Text';
import Page from '../../../components/Page';
import { getEvent } from '../../../utils/airtable';
import Event from '../../../components/Event';

export const getServerSideProps = async ({ req, params: { id } }) => ({
  props: {
    event: await getEvent(id),
    origin: absoluteUrl(req, 'localhost:3000').origin,
  },
});

export default function Home({ event, origin }) {
  const { id } = useRouter().query;

  return (
    <Page slug={`/schedule/e/${id}`} title={event.Title}>
      <NextSeo
        description={event.Description}
        openGraph={{
          images: [
            {
              url: `${origin}/api/social?id=${event.id}`,
            },
          ],
        }}
      />
      <Content>
        <Text fontSize="lg">
          <Link href="/schedule">&laquo; Schedule</Link>
        </Text>
      </Content>
      <Event event={event} />
    </Page>
  );
}
