import path from 'path';
import jimp from 'jimp';
import moment from 'moment-timezone';
import gen from 'random-seed';
import { getEvent } from '../../utils/airtable';

const fileNames = ['black', 'green', 'orange', 'pink'];

export default async function makeSocial({ query: { id } }, res) {
  res.writeHead(200, {
    'Content-type': 'image/png',
  });

  const { Date: StartDate, Title, Speakers } = await getEvent(id);
  const randomBg = fileNames[gen(id)(fileNames.length)];

  const image = await jimp.read(path.join('resources/social/', `${randomBg}.png`));
  const fonts = {
    large: await jimp.loadFont('resources/fonts/sofia-64.ttf.fnt'),
    small: await jimp.loadFont('resources/fonts/sofia-48.ttf.fnt'),
  };

  const centeredText = (text) => ({
    text,
    alignmentX: jimp.HORIZONTAL_ALIGN_CENTER,
    alignmentY: jimp.VERTICAL_ALIGN_MIDDLE,
  });

  const padding = {
    x: 0.04 * image.getHeight(),
    y: 0.02 * image.getWidth(),
  };

  const width = image.getWidth() - (2 * padding.y);

  const heights = {
    date: 0.08 * image.getHeight(),
    title: 0.61 * image.getHeight(),
    speakers: 0.08 * image.getHeight(),
  };

  const y = {
    date: 2 * padding.y,
    title: (3 * padding.y) + heights.date,
    speakers: (4 * padding.y) + heights.date + heights.title,
  };

  const TextSpeakers = Speakers.split('\n').filter((a) => a).join(', ');
  const TextDate = `${moment.utc(StartDate).tz('America/Los_Angeles').format('MMMM D @ hh:mma')} PT / ${
    moment.utc(StartDate).tz('America/New_York').format('hh:mma')} ET`;

  await image.print(fonts.small, padding.x, y.date, centeredText(TextDate), width, heights.date);
  await image.print(fonts.large, padding.x, y.title, centeredText(Title), width, heights.title);
  await image.print(fonts.small, padding.x, y.speakers, centeredText(TextSpeakers), width, heights.speakers);

  res.write(await image.getBufferAsync('image/png'));
  res.end();
}
