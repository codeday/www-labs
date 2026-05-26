import { Spinner, Text } from '@codeday/topo/Atom';
import CenteredMessagePage from './CenteredMessagePage';

export default function DashboardStateGate({ title, error, isLoading, children }) {
  if (error?.message && error.message.includes('{')) {
    return (
      <CenteredMessagePage title={title}>
        <Text>{error.message.split('{')[0]}</Text>
      </CenteredMessagePage>
    );
  }
  if (isLoading) {
    return (
      <CenteredMessagePage title={title}>
        <Spinner />
      </CenteredMessagePage>
    );
  }
  return children;
}
