import { print } from 'graphql';
import { useRouter } from 'next/router';
import { Content } from '@codeday/topo/Molecule';
import { Link, Spinner, Text } from '@codeday/topo/Atom';
import Page from '../../../../components/Page';
import CenteredMessagePage from '../../../../components/Dashboard/CenteredMessagePage';
import OfferAgreement from '../../../../components/Dashboard/OfferAgreement';
import useOfferAcceptForm from '../../../../components/Dashboard/useOfferAcceptForm';
import { useSwr } from '../../../../dashboardFetch';
import { OfferAcceptStatus } from './offerAccept.gql';

export default function OfferAccept() {
  const { isValidating, data } = useSwr(print(OfferAcceptStatus), {}, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  const form = useOfferAcceptForm();
  const { query } = useRouter();

  if (isValidating || !data?.labs?.student) {
    return (
      <CenteredMessagePage title="Accept Offer">
        <Spinner />
      </CenteredMessagePage>
    );
  }

  const student = data.labs.student;

  if (!student.hasValidAdmissionOffer || form.isAccepted) {
    return (
      <CenteredMessagePage title="Accept Offer">
        <Text>
          {student.status === 'ACCEPTED' || form.isAccepted
            ? 'You have accepted your offer.'
            : 'You have no offer to accept.'}
        </Text>
      </CenteredMessagePage>
    );
  }

  return (
    <Page title="Accept Offer">
      <Content display={{ base: 'block', sm: 'none' }}>
        <Text>Please visit this page on a desktop web browser.</Text>
      </Content>
      <Content display={{ base: 'none', sm: 'block' }} textAlign="center" color="current.textLight" mb={4} mt={-8}>
        Complete the admissions agreement below to accept your offer or{' '}
        <Link as="a" href={`/dash/s/${query.token}/withdraw`} color="current.textLight">
          click here to withdraw your application.
        </Link>
      </Content>
      <OfferAgreement student={student} form={form} />
    </Page>
  );
}
