import getConfig from 'next/config';
import Airtable from 'airtable';
import moment from 'moment-timezone';
import LruCache from 'lru-cache';

const cache = new LruCache({ max: 60 });
const { serverRuntimeConfig } = getConfig();

const base = new Airtable({ apiKey: serverRuntimeConfig.airtable.key })
.base(serverRuntimeConfig.airtable.base);

const calendarTable = base.table(serverRuntimeConfig.airtable.table);
const calendarPublicFields = ['Title', 'Date', 'Type', 'Track', 'Public', 'Description', 'Speakers', 'Speaker Bios', 'Meeting Type'];

const notifyTable = base.table(serverRuntimeConfig.airtable.tableNotify);

export const fetchAll = async (select) => {
  let allRecords = [];

  await select.eachPage((records, fetchNextPage) => {
    allRecords = [...allRecords, ...records];
    fetchNextPage();
  });

  return allRecords;
};

const toFields = (item) => ({ id: item.id || null, ...item.fields, Public: item.fields.Public !== 'No' });

export const getCalendar = async () => {
  if (!cache.has('calendar')) {
    cache.set('calendar', (await fetchAll(calendarTable.select({ fields: calendarPublicFields }))).map(toFields), 30);
  }

  return cache.get('calendar');
}

export const getEvent = async (eventId, withPrivate) => {
  const wantedKeys = ['id', ...calendarPublicFields, ...(!withPrivate ? [] : ['Meeting ID', 'Recording URL'])];
  const key = `calendar-${eventId}`;
  if (!cache.has(key)) {
    cache.set(key, toFields(await calendarTable.find(eventId)));
  }

  const raw = cache.get(key);
  var filtered = {}
  Object.keys(raw).forEach( key => {
    if(wantedKeys.includes(key)){
        filtered[key] = raw[key]
    }
  });

  return filtered;
}

export const addNotification = async (eventId, phone) => {
  return notifyTable.create([
    {
      fields: {
        Phone: phone,
        Event: [ eventId ],
      },
    },
  ]);
}
