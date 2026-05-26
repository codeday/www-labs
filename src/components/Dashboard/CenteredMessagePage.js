import { Content } from '@codeday/topo/Molecule';
import Page from '../Page';

export default function CenteredMessagePage({ title, children }) {
  return (
    <Page title={title}>
      <Content textAlign="center">{children}</Content>
    </Page>
  );
}
