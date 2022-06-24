import { useEffect, useState } from 'react';
import { decode } from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { Content } from '@codeday/topo/Molecule';
import { Link } from '@codeday/topo/Atom';
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
        <Link as="a" href={`/dash/a/${query.token}/email`}>Send Email</Link><br />
        <Link as="a" href={`/api/matchingPrefs?token=${query.token}`}>Matching Prefs</Link><br />
        <Link as="a" href={`/api/projectCapacities?token=${query.token}`}>Project Capacities</Link><br />
      </Content>
    </Page>
  );
}
