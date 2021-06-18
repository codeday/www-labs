import { useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';
import { useRouter } from 'next/router';
import Content from '@codeday/topo/Molecule/Content';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Page from '../../../../components/Page';

export default function AdminDashboard() {
  const { query } = useRouter();
  return (
    <Page title="Admin Dashboard">
      <Content>
        <Link as="a" href={`/dash/a/${query.token}/add`}>Add Mentor</Link><br />
        <Link as="a" href={`/dash/a/${query.token}/delete`}>Delete Mentor</Link><br />
        <Link as="a" href={`/dash/a/${query.token}/partner`}>Partner Students</Link><br />
        <Link as="a" href={`/dash/a/${query.token}/admit`}>Admissions</Link><br />
        <Link as="a" href={`/dash/a/${query.token}/csv`}>CSVs</Link><br />
      </Content>
    </Page>
  );
}
