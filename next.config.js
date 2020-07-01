module.exports = {
  serverRuntimeConfig: {
    airtable: {
      key: process.env.AIRTABLE_KEY,
      base: process.env.AIRTABLE_BASE,
      table: process.env.AIRTABLE_TABLE,
      tableNotify: process.env.AIRTABLE_TABLE_NOTIFY,
      tableMentors: process.env.AIRTABLE_TABLE_MENTORS,
      tableStudents: process.env.AIRTABLE_TABLE_STUDENTS,
      tableProjects: process.env.AIRTABLE_TABLE_PROJECTS,
      tableCareerAdvisors: process.env.AIRTABLE_TABLE_CAREER_ADVISORS,
      tableAdvisingRequests: process.env.AIRTABLE_TABLE_ADVISING_REQUESTS,
    },
    joinPassword: process.env.JOIN_PASSWORD,
    uploader: {
      base: process.env.UPLOADER_BASE,
    },
    postmark: {
      key: process.env.POSTMARK_KEY,
    },
  },
};
