import moment from 'moment-timezone';
import { getCalendar } from '../../utils/airtable';
const ics = require('ics'); // Somehow this doesn't work with import

export default async (req, res) => {
  let error, value;
  try {
    ({ error, value } = ics.createEvents((await getCalendar()).map((event) => ({
      title: event.Title || 'TBA',
      description: event.Description || '',
      busyStatus: 'FREE',
      start: moment.utc(event.Date).format('YYYY-M-D-H-m').split("-"),
      startInputType: 'utc',
      location: `https://labs.codeday.org/schedule/e/${event.id}`,
      url: `https://labs.codeday.org/schedule/e/${event.id}`,
      status: 'CONFIRMED',
      uid: `${event.id}@labs.codeday.org`,
      productId: 'CodeLabs',
      alarms: [ {action: 'display', trigger: {minutes: 15, before: true}, description: `CodeLabs Event - ${event.Title || 'TBA'}` } ],
      duration: { minutes: 60 },
    }))));
  } catch (err) {
    console.error(err);
    return res.send('error');
  }

  if (error) {
    console.error(error);
    return res.send('error');
  }

  value = value.replace('BEGIN:VCALENDAR', `BEGIN:VCALENDAR\r\nX-WR-CALNAME: CodeLabs\r\nNAME: CodeLabs`);

  res.writeHead(200, {'Content-Type': 'text/calendar;charset=utf-8'})
  res.write(value);
  res.close();
}
