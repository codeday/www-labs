import { useEffect } from 'react';
import Page from '../../components/Page';

export default function MentorApplyPage () {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.location = 'https://www.codeday.org/volunteer/labs?return=labs&returnto=mentor%2Fshare%3Fapplied';
   }, [typeof window]);

  return (
    <Page slug="/mentor/apply" title="Sign Up to Mentor">
    </Page>
  );
};
