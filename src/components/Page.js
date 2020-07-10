import React from 'react';
import { DefaultSeo } from 'next-seo';
import Box, { Content } from '@codeday/topo/Box';
import Header, { SiteLogo, Menu } from '@codeday/topo/Header';
import { WithText } from '@codeday/topo/Logo';
import Text, { Link } from '@codeday/topo/Text';
import Button from '@codeday/topo/Button';

export default ({
  children, title, darkHeader, slug, ...props
}) => (
  <>
    <DefaultSeo
      title={`${title ? `${title} ~ ` : ''}CodeDay Labs`}
      description="CodeLabs is the 100% online tech internship for everyone. July 6 - 31, 2020."
      canonical={`https://labs.codeday.org${slug}`}
      openGraph={{
        type: 'website',
        locale: 'en_US',
        site_name: 'CodeDay Labs',
        url: `https://labs.codeday.org${slug}`,
        images: [
          {
            url: 'https://img.codeday.org/o/s/h/sh1wzznzdvcwuu23rosvieifnabsfiaemvf6ejk5a65wjxguvgnzbkk1axjhg6p5je.png',
          },
        ],
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
          <Link href="/volunteer">Volunteer</Link>
          <Button variant="outline" variantColor="brand" as="a" href="/schedule">Schedule</Button>
          <Button variant="outline" variantColor="brand" as="a" href="/gallery">Projects</Button>
        </Menu>
      </Header>
      {children}
      <Content paddingTop={4}>
        <Text fontSize="sm" color="gray.400">
          &copy; 2020 CodeDay, in partnership with <Link target="_blank" href="https://mentorsintech.com">MinT</Link>.
        </Text>
      </Content>
    </Box>
  </>
);
