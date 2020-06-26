import getConfig from 'next/config';
import { getEvent } from '../../utils/airtable';

const { serverRuntimeConfig } = getConfig();

export default async ({ query: { id, password } }, res) => {
  let event;
  try {
    event = await getEvent(id, true);
  } catch (err) {
    return res.send(`Sorry, that event doesn't seem to exist.`);
  }

  if (!event.Public && password !== serverRuntimeConfig.joinPassword) {
    return res.send('Sorry, that password was wrong.');
  }

  console.log(event);

  let url = 'https://twitch.tv/codeday_org';
  if (event['Meeting Type'] === 'Zoom') {
    url = `https://zoom.us/j/${event['Meeting ID']}`;
  } else if (event['Meeting Type'] === 'Discord') {
    url = `https://codeday.to/discord`;
  }

  res.writeHead(302, { Location: url });
  return res.send();

}
