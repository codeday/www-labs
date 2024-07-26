import getConfig from 'next/config';
import { apiFetch } from '@codeday/topo/utils';
import { SlackWorkspaceIdQuery } from './link-slack.gql';

export default async function (req, res) {
  const { r, token } = req.query;
  const { serverRuntimeConfig } = getConfig();
  const slackClientId = serverRuntimeConfig.slack.clientId;

  const { labs } = await apiFetch(
    SlackWorkspaceIdQuery,
    {},
    { 'X-Labs-Authorization': `Bearer ${token}` },
  );

  const team = labs.event.slackWorkspaceId;

  const redirectUri = encodeURIComponent(`https://labs.codeday.org/api/link-slack-return?r=${r}&token=${token}`);
  return res.redirect(`https://slack.com/openid/connect/authorize?response_type=code&scope=openid%20profile%20email&client_id=${slackClientId}&team=${team}&redirect_uri=${redirectUri}`)
} 