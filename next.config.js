module.exports = {
  redirects: () => [
    {
      source: '/volunteer',
      destination: 'https://www.codeday.org/volunteer/labs',
      permanent: false,
    }
  ],
  serverRuntimeConfig: {
    auth0: {
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      domain: process.env.AUTH0_DOMAIN,
      roles: {
        admin: process.env.AUTH0_ADMIN_ROLE,
        manager: process.env.AUTH0_MANAGER_ROLE,
        reviewer: process.env.AUTH0_REVIEWER_ROLE,
        openSourceManager: process.env.AUTH0_OPEN_SOURCE_MANAGER_ROLE,
      },
    },
    gql: {
      accountSecret: process.env.GQL_ACCOUNT_SECRET,
      secret: process.env.GQL_SECRET,
      audience: process.env.GQL_AUDIENCE,
    },
    slack: {
      clientId: process.env.SLACK_CLIENT_ID,
      secret: process.env.SLACK_CLIENT_SECRET,
    }
  },
  publicRuntimeConfig: {
    appUrl: process.env.APP_URL,
  },
};
