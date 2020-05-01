import Head from 'next/head'
import Theme from '@codeday/topo/Theme';
import Box, { Content } from '@codeday/topo/Box';
import Header, { SiteLogo, Menu } from '@codeday/topo/Header';
import { WithText } from '@codeday/topo/Logo';
import Text, { Link } from '@codeday/topo/Text';
import Button from '@codeday/topo/Button';
import Chatra from './Chatra';

export default ({ children, title, darkHeader, ...props }) => (
  <Theme>
    <Head>
      <title>{title && title + ' ~ '}CodeDay Labs</title>
    </Head>
    <Box position="relative">
      <Header darkBackground={darkHeader} gradAmount={darkHeader && 'lg'} underscore position="relative" zIndex="1000">
        <SiteLogo>
          <a href="/">
            <WithText text="CodeLabs" />
          </a>
        </SiteLogo>
        <Menu>
          <Link display={{base: 'none', sm: 'initial'}} href="/companies">Companies</Link>
          <Button variant="outline" variantColor="green" as="a" href="/mentor">Mentor</Button>
          <Button variantColor="green" as="a" href="/apply">Apply</Button>
        </Menu>
      </Header>
      {children}
      <Content paddingTop={4}>
        <Text fontSize="sm" color="gray.200">&copy; 2020 CodeDay, in partnership with MinT.</Text>
      </Content>
    </Box>
    <Chatra />
  </Theme>
);
