module.exports = {
  serverRuntimeConfig: {
    airtable: {
      key: process.env.AIRTABLE_KEY,
      base: process.env.AIRTABLE_BASE,
      table: process.env.AIRTABLE_TABLE,
    },
  },
};
