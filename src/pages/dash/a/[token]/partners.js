import { useEffect, useState } from 'react';
import {
  PartnersQuery
} from './partners.gql';
import { apiFetch } from '@codeday/topo/utils';
import Page from '../../../../components/Page';
import { Content } from '@codeday/topo/Molecule';
import { Button, Heading, List, ListItem, Select } from '@chakra-ui/react';
import { Link } from '@codeday/topo/Atom';
import { useRouter } from 'next/router';

export default function AdminActivities({ partners }) {
  const { query } = useRouter();

  return (
    <Page title="Partners">
      <Content mt={-8}>
        <Button as="a" href={`/dash/a/${query.token}`}>&laquo; Back</Button>
        <Heading as="h2" fontSize="5xl" mb={8} mt={4}>Partners</Heading>
        <List>
          {partners.map(p => (
            <ListItem k={p.partnerCode}>
              <Link
                href={`/dash/p/${p.token}`}
                target="_blank"
              >
                {p.partnerCode}
              </Link>
              &mdash; {p.studentCount} students
            </ListItem>
          ))}
        </List>
      </Content>
    </Page>
  );
}

export async function getServerSideProps({ params: { token }}) {
  const res = await apiFetch(PartnersQuery, {}, { 'X-Labs-Authorization': `Bearer ${token}` });
  return {
    props: {
      partners: res.labs.partners,
    },
  };
}