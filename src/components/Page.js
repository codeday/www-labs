import Head from 'next/head'
import { DefaultSeo } from 'next-seo';
import Theme from '@codeday/topo/Theme';
import Box, { Content } from '@codeday/topo/Box';
import Header, { SiteLogo, Menu } from '@codeday/topo/Header';
import { WithText } from '@codeday/topo/Logo';
import Text, { Link } from '@codeday/topo/Text';
import Button from '@codeday/topo/Button';
import Chatra from './Chatra';

export default ({ children, title, darkHeader, slug, ...props }) => (
  <Theme>
    <DefaultSeo
      title={`${title ? title + ' ~ ' : ''}CodeDay Labs`}
      description="CodeLabs is the 100% online tech internship for everyone. July 4 - 31, 2020."
      canonical={`https://labs.codeday.org${slug}`}
      openGraph={{
        type: 'website',
        locale: 'en_US',
        site_name: 'CodeDay Labs',
        url: `https://labs.codeday.org${slug}`,
        images: [
          {
            url: 'https://img.codeday.org/o/v/y/vyby6cz2rqr5b5x99dptzzrgbdqh9iem49qhkc71uf1vzvbgq9oskiiuym5ryxwycx.jpg',
          }
        ]
      }}
      twitter={{
        handle: '@codeday',
        site: '@codeday',
        cardType: 'summary_large_image',
      }}
    />
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
