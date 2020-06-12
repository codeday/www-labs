import getConfig from 'next/config';
import Airtable from 'airtable';
import moment from 'moment-timezone';

const { serverRuntimeConfig } = getConfig();

export const fetchAll = async (select) => {
  let allRecords = [];

  await select.eachPage((records, fetchNextPage) => {
    allRecords = [...allRecords, ...records];
    fetchNextPage();
  });

  return allRecords;
};

let cachedCalendar = null;
let lastCachedAt = null;
export const getCalendar = async () => {
 const table = new Airtable({ apiKey: serverRuntimeConfig.airtable.key })
  .base(serverRuntimeConfig.airtable.base)
  .table(serverRuntimeConfig.airtable.table);

  if (!lastCachedAt || moment().subtract(1, 'minute').isAfter(lastCachedAt)) {
    lastCachedAt = moment();
    try {
      cachedCalendar = await fetchAll(table.select({ fields: ['Title', 'Date', 'Type', 'Speakers'] }));
    } catch (err) { return }
  };

  return cachedCalendar;
}
