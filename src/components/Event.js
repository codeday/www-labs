import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box, { Content } from '@codeday/topo/Box';
import Text, { Heading, Link } from '@codeday/topo/Text';
import { default as Input } from '@codeday/topo/Input/Text';
import Form from '@codeday/topo/CognitoForm';
import Button from '@codeday/topo/Button';
import moment from 'moment-timezone';
import axios from 'axios';
import { eventColors } from './index/calendar';

const renderMultiline = (str) => str && str
  .replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\n/g, '<br />')
  .replace(/(https?:\/\/[^\s]+)/g, (url) => `<a href="${url}" style="text-decoration: underline" target="_blank">${url}</a>`);

export default function Event({ event }) {
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [fromNow, setFromNow] = useState('');
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [error, setError] = useState(null);

  const timezone = 'America/Los_Angeles';
  const localTimezone = typeof window !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone || timezone
    : timezone;

  const localStart = moment.utc(event.Date).tz(localTimezone);
  const start = moment.utc(event.Date).tz(timezone);

  const dateFormat = 'MMMM DD, YYYY';
  const timeFormat = 'h:mma';
  const combinedFormat = `${dateFormat} @ ${timeFormat}`;

  const localIdentical = localStart.format(combinedFormat) === start.format(combinedFormat);
  const localDateMatches = localStart.format(dateFormat) === start.format(dateFormat);

  const baseColor = eventColors[event.Type || ''] || 'gray';
  const speakers = (event.Speakers || '').split('\n').filter((a) => a);

  const calendarEventStart = moment.utc(event.Date);
  const calendarEventFormat = "YYYYMMDDTHHmmSS"
  const calendarDescription = 
    `With ${speakers.join(', ')}%0D%0A${event.Description}`
  const calendarInviteURL = 
    `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event.Title}` + 
    `&dates=${calendarEventStart.format(calendarEventFormat)}Z/${calendarEventStart.add(1, "hour").format(calendarEventFormat)}Z` + 
    `&details=${calendarDescription}&location=Discord&sprop=website:www.santa.org`;

  const momentRefreshInterval = null;
  useEffect(() => {
    setFromNow(start.fromNow());
    setInterval(() => setFromNow(start.fromNow()), 60000);
    return () => clearInterval(momentRefreshInterval);
  }, [start.format(combinedFormat)]);

  return (
    <Content>
      <Box>
        <Box
          d="inline-block"
          borderRadius={2}
          bg={`${baseColor}.100`}
          borderColor={`${baseColor}.300`}
          borderWidth={2}
          color={`${baseColor}.900`}
          p={1}
          pl={2}
          pr={2}
          mb={4}
          fontSize="sm"
        >
          {event.Type}
        </Box>
        {event['Confirmed Time'] ? (
          <Text>
            {localStart.format(combinedFormat)}
            {!localIdentical && ` (${start.format(localDateMatches ? timeFormat : combinedFormat)} Pacific)`}
            {fromNow && ` - ${fromNow}`}
          </Text>
        ) : (
          <Text>TBA</Text>
        )}
        <Heading as="h2" fontSize="4xl">{event.Title || 'TBA'}</Heading>
        <Text fontSize="xl" mb={8} fontStyle="italic">{speakers.join(', ')}</Text>

        {!event.Public && (
          <Box bg="red.50" borderColor="red.200" borderWidth={2} borderRadius={2} color="red.800" p={4} mb={4}>
            This event is only for registered CodeLabs community members.
          </Box>
        )}
        <Text fontSize="xl" mb={8} dangerouslySetInnerHTML={{ __html: renderMultiline(event.Description) }} />
        {/* <Link href={calendarInviteURL}>test</Link> */}

        {(
          start.clone().subtract(1, 'hours').isBefore(moment.now())
          && start.clone().add(2, 'hours').isAfter(moment.now())
        ) ? (
          <Box mb={12}>
            {!event.Public && (
              <Input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                size="lg"
                d="inline-block"
                w="md"
                verticalAlign="top"
                borderTopRightRadius={0}
                borderBottomRightRadius={0}
                borderRightWidth={0}
              />
            )}
            <Button
              as="a"
              variantColor="green"
              href={`/api/join?id=${event.id}&password=${password || ''}`}
              size="lg"
              borderTopLeftRadius={event.Public ? null : 0}
              borderBottomLeftRadius={event.Public ? null : 0}
            >
              Join{event['Meeting Type'] ? ` on ${event['Meeting Type']}` : ''}
            </Button>
          </Box>
          ) : (start.clone().add(2, 'hours').isAfter(moment.now()) && (
          <Box mb={12}>
            <Input
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              size="lg"
              d="inline-block"
              w="md"
              verticalAlign="top"
              borderTopRightRadius={0}
              borderBottomRightRadius={0}
              borderRightWidth={0}
            />
            <Button
              variantColor="green"
              variant="outline"
              onClick={async () => {
                try {
                  const response = (await axios({
                    method: 'POST',
                    url: '/api/notify',
                    headers: { 'Content-type': 'application/json' },
                    data: JSON.stringify({ id: event.id, phone }),
                    responseType: 'json',
                  })).data;
                  if (response.error) {
                    setError(response.error);
                    setHasSubscribed(false);
                  } else {
                    setHasSubscribed(true);
                    setPhone('');
                    setError(null);
                  }
                } catch (err) {
                  setError(err);
                  setHasSubscribed(false);
                }
              }}
              size="lg"
              borderTopLeftRadius={0}
              borderBottomLeftRadius={0}
            >
              Text Me When This Starts
            </Button>
            {error && <Text color="red.700" bold mt={2}>{error.toString()}</Text>}
            {hasSubscribed && <Text color="green.700" bold mt={2}>We&apos;ll text you when this starts!</Text>}
          </Box>
          ))}

        {event.Type === 'Expert Lunch' && (
          <Box mb={8}>
            <Heading as="h3" fontSize="xl" mb={2} bold>Submit a Question</Heading>
            <Form
              formId={70}
              prefill={{ Title: event.Title }}
            />
          </Box>
        )}

        <Heading as="h3" fontSize="xl" mb={2} bold>
          {event['Speaker Bios'] && `About the Speaker${speakers.length > 1 ? 's' : ''}`}
        </Heading>
        <Text dangerouslySetInnerHTML={{ __html: renderMultiline(event['Speaker Bios']) }} />
      </Box>
    </Content>
  );
}
Event.propTypes = {
  event: PropTypes.object.isRequired,
};
