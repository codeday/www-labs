
import Box, { Grid, Content } from '@codeday/topo/Box';
import Image from '@codeday/topo/Image';
import Button from '@codeday/topo/Button';
import Text, { Heading, Link } from '@codeday/topo/Text';
import Deck from '@codeday/topo/Deck';
import Page from '../components/Page';

export default () => (
  <Page slug="/companies" title="For Companies">
    <Content>
      <Deck src="https://f1.srnd.org/labs/virtual-internship-2020-companies.pdf?v2" allowDownload />
    </Content>
    <Content>
      <Heading as="h2" size="md">Ready to get started?</Heading>
      <Text>We're excited to work with you.</Text>
      <Button variantColor="green" as="a" href="mailto:labs@codeday.org">Contact Us</Button>
    </Content>
  </Page>
);
