import React from 'react';
import { DefaultSeo } from 'next-seo';
import Box from '@codeday/topo/Atom/Box';
import Text, { Link } from '@codeday/topo/Atom/Text';
import Header, { SiteLogo, Menu } from '@codeday/topo/Organism/Header';
import Image from '@codeday/topo/Atom/Image';
import Footer from '@codeday/topo/Organism/Footer';
import { CodeDay } from '@codeday/topo/Atom/Logo';
import Button from '@codeday/topo/Atom/Button';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default ({
  children, title, darkHeader, slug, ...props
}) => (
  <>
    <DefaultSeo
      title={`${title ? `${title} ~ ` : ''}CodeDay Labs`}
      description="Online internship-like experience working on open source projects."
      canonical={`https://labs.codeday.org${slug}`}
      openGraph={{
        type: 'website',
        locale: 'en_US',
        site_name: 'CodeDay Labs',
        url: `https://labs.codeday.org${slug}`,
        images: [
          {
            url: 'https://img.codeday.org/w=1104;h=736;fit=crop;crop=faces,edges/q/p/qp1wmuzr9knezo9vtymbcc3ytopxv3fnzr6kdzvmh34wjamjd8dstokuj1sqae749j.jpg',
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
          <a href="https://www.codeday.org/">
            <CodeDay withText />
          </a>
          <a href="/">
            <Text
              as="span"
              d="inline"
              letterSpacing="-2px"
              fontFamily="heading"
              position="relative"
              top={1}
              ml={1}
              textDecoration="underline"
              bold
            >
              Labs
            </Text>
          </a>
        </SiteLogo>
        <Menu>
          <Button variant="ghost" as="a" href="/schools">For Schools</Button>
          <Button variant="ghost" as="a" href="/mentor">Mentor</Button>
          <Button variant="solid" variantColor="green" as="a" href="/apply">Student Application</Button>
        </Menu>
      </Header>
      {children}
      <Box mb={16} />
      <Footer />
    </Box>
  </>
);
