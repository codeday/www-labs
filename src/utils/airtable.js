import getConfig from 'next/config';
import Airtable from 'airtable';

const { serverRuntimeConfig } = getConfig();

export const fetchAll = async (select) => {
  let allRecords = [];

  await select.eachPage((records, fetchNextPage) => {
    allRecords = [...allRecords, ...records];
    fetchNextPage();
  });

  return allRecords;
};

export const getCalendar = async () => {
 const table = new Airtable({ apiKey: serverRuntimeConfig.airtable.key })
  .base(serverRuntimeConfig.airtable.base)
  .table(serverRuntimeConfig.airtable.table);

  return await fetchAll(table.select({ fields: ['Title', 'Date', 'Type', 'Speakers'] }));
}
