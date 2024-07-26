import getConfig from 'next/config';
import { apiFetch } from '@codeday/topo/utils';
import { LinkSlackMutation } from './link-slack-return.gql';

export default async function (req, res) {
  const { r, token, code } = req.query;
  const { serverRuntimeConfig } = getConfig();
  const slackClientId = serverRuntimeConfig.slack.clientId;
  const slackSecret = serverRuntimeConfig.slack.secret;
  const redirectUri = encodeURIComponent(`https://labs.codeday.org/api/link-slack-return?r=${r}&token=${token}`);

  if (r !== 's' && r !== 'm') throw new Error('r must be m or s.');

  const result = await fetch(
    `https://slack.com/api/openid.connect.token?client_id=${slackClientId}&client_secret=${slackSecret}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectUri}`,
  ).then(res => res.json());

  if (!result.id_token) throw new Error(`Invalid authentication.`);

  const { labs } = await apiFetch(
    LinkSlackMutation,
    { token: result.id_token },
    { 'X-Labs-Authorization': `Bearer ${token}` },
  );

  return res.redirect(`/dash/${r}/${token}`);
} 