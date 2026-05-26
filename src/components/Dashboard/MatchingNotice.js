import { Box, Text } from '@codeday/topo/Atom';
import { Content } from '@codeday/topo/Molecule';
import Page from '../Page';

export default function MatchingNotice({ title, message, children }) {
  return (
    <Page title="Project Preferences">
      <Content mt={-8}>
        <Box bg="yellow.50" color="yellow.900" borderColor="yellow.100" borderWidth={2} p={4} mb={8}>
          <Text bold fontSize="lg">{title}</Text>
          <Text>{message}</Text>
        </Box>
        {children}
      </Content>
    </Page>
  );
}
