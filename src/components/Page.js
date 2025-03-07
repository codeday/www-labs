import React, { useEffect, useState } from 'react';
import { DefaultSeo } from 'next-seo';
import { Box, Text, Link, Button, CodeDay, Select } from '@codeday/topo/Atom';
import { Header, Menu, SiteLogo, Announcement, Footer, CustomLinks } from '@codeday/topo/Organism';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { Container } from '@chakra-ui/react';
import { apiFetch } from '@codeday/topo/utils';
import { LabsEventInfo } from './Page.gql';
import { DateTime } from 'luxon';

const { publicRuntimeConfig } = getConfig();

export default ({
  children, title, darkHeader, slug, ...props
}) => {
  const { query } = useRouter();
  const [eventTokens, setEventTokens] = useState([])
  useEffect(() => {
    if (typeof window === 'undefined' || !query?.token) return;
    (async () => {
      const data = await apiFetch(LabsEventInfo, {}, { 'X-Labs-Authorization': `Bearer ${query.token}` });
      setEventTokens([
        {event: data?.labs?.event, token: query.token},
        ...data?.labs?.otherEventTokens.filter(e => e.event.id !== data?.labs?.event.id),
      ]);
    })();
  }, [typeof window, query]);

  return (
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
      <Announcement zIndex={7000} position="relative" />
      <Box position="relative">
        <Header
          darkBackground={darkHeader}
          gradAmount={darkHeader && 'lg'}
          underscore
          position="relative"
          zIndex="1000"
          color={darkHeader && 'white'}
        >
          <SiteLogo>
            <a href="https://www.codeday.org/">
              <CodeDay color={darkHeader && 'white'} withText />
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
            {query?.token && eventTokens.length > 0 ? (
              <Select
                defaultValue={eventTokens[0].token}
                onChange={(e) => {
                  const route = document.location.pathname.split('/')?.[2] || 's';
                  document.location.href = `/dash/${route}/${e.target.value}`;
                }}
              >
                {eventTokens.sort((a, b) => DateTime.fromISO(b.event.startsAt).toSeconds() - DateTime.fromISO(a.event.startsAt).toSeconds()).map(({ event, token }) => (
                  <option key={event.id} value={token}>{event.name}</option>
                ))}
              </Select>
            ) : (
              <>
                <Button variant="ghost" as="a" href="/schools">Colleges</Button>
                <Button variant="ghost" as="a" href="/mentor">Mentors</Button>
                <Button variant="ghost" as="a" href="/oss">OSS Maintainers</Button>
                <Button variant="solid" colorScheme="green" as="a" href="/apply">Student Application</Button>
              </>
            )}
          </Menu>
        </Header>
        {children}
        <Footer mt={16} repository="www-labs" branch="master">
          <CustomLinks>
            <Link as="a" href="/dash">Participant Dashboard</Link>
          </CustomLinks>
        </Footer>
      </Box>
    </>
  );
};
