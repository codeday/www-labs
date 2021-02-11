import Box from '@codeday/topo/Atom/Box';
import Content from '@codeday/topo/Molecule/Content';
import Button from '@codeday/topo/Atom/Button';
import Deck from '@codeday/topo/Molecule/Deck';
import Text, { Heading, Link } from '@codeday/topo/Atom/Text';
import Page from '../components/Page';

export default function Edu() {
  return (
    <Page slug="/schools" title="Colleges and High Schools">
      <Content>
        <Heading as="h2">CodeDay Labs for Colleges and High Schools</Heading>
        <Text>
          CodeDay Labs is designed to help students connect in-class learning to software industry practices, and
          provide students with an internship-like experience.
        </Text>
        <Text>
          For more info, email us at <Link href="mailto:labs@codeday.org">labs@codeday.org</Link> or call 888-607-7763.
          (Deadlines vary from March - May depending on number of students.)
        </Text>
        <Box textAlign="center" mt={8}>
          <Button as="a" href="/deck-schools.pdf" variantColor="green" m={2}>Download Slide Deck</Button>
          <Button as="a" href="mailto:labs@codeday.org" variantColor="green" m={2}>Email Us</Button>
        </Box>
      </Content>
      <Content wide>
        <Deck allowDownload src="/deck-schools.pdf" />
      </Content>
    </Page>
  );
}
