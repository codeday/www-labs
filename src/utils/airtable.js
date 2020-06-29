import getConfig from 'next/config';
import Airtable from 'airtable';
import moment from 'moment-timezone';
import LruCache from 'lru-cache';

const cache = new LruCache({ max: 60 });
const { serverRuntimeConfig } = getConfig();

const base = new Airtable({ apiKey: serverRuntimeConfig.airtable.key })
.base(serverRuntimeConfig.airtable.base);

export const calendarTable = base.table(serverRuntimeConfig.airtable.table);
const calendarPublicFields = ['Title', 'Date', 'Type', 'Track', 'Public', 'Description', 'Speakers', 'Speaker Bios', 'Meeting Type', 'Confirmed Time'];

export const notifyTable = base.table(serverRuntimeConfig.airtable.tableNotify);

export const projectsTable = base.table(serverRuntimeConfig.airtable.tableProjects);
export const mentorsTable = base.table(serverRuntimeConfig.airtable.tableMentors);
export const studentsTable = base.table(serverRuntimeConfig.airtable.tableStudents);

export const fetchAll = async (select) => {
  let allRecords = [];

  await select.eachPage((records, fetchNextPage) => {
    allRecords = [...allRecords, ...records];
    fetchNextPage();
  });

  return allRecords;
};

const toFields = (item) => ({ id: item.id || null, ...item.fields, Public: item.fields.Public !== 'No', ['Confirmed Time']: Boolean(item.fields['Confirmed Time']) });

export const getProjects = async () => {
  if (!cache.has('projects')) {
    const rawProjects = await fetchAll(projectsTable.select({
      fields: ['Description', 'Team', 'Mentors', 'Track'],
      filterByFormula: `OR({Mentor Status} = "Finalized", {Mentor Status} = "Matched", {Mentor Status} = "Introduced")`,
      sort: [{ field: "Track", direction: "asc"}, { field: "Mentor Status", direction: "desc"}],
    }));

    const students = (await fetchAll(studentsTable.select({
      fields: ['Display Name'],
      filterByFormula: `OR({Status} = "Confirmed", {Status} = "Accepted - Normal", {Status} = "Accepted - Early")`
    })))
    .reduce((accum, student) => ({ ...accum, [student.id]: student.fields }), {});


    const mentors = (await fetchAll(mentorsTable.select({
      fields: ['Name', 'Role', 'Company'],
    }))).reduce((accum, mentor) => ({ ...accum, [mentor.id]: mentor.fields }), {});

    const projects = rawProjects.map((project) => ({
      id: project.id,
      ...project.fields,
      Team: project.fields.Team ? project.fields.Team.map((id) => students[id] || null).filter((a) => a) : null,
      Mentors: project.fields.Mentors ? project.fields.Mentors.map((id) => mentors[id] || null).filter((a) => a) : null,
    }));

    cache.set('projects', projects);
  }
  return cache.get('projects');
}

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
