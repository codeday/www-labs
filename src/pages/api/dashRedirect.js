import { print } from 'graphql';
import getConfig from 'next/config';
import { sign } from 'jsonwebtoken';
import { getSession } from 'next-auth/client';
import { apiFetch } from '@codeday/topo/utils';
import { EligibilityQuery } from './dashRedirect.gql';
import { DateTime } from 'luxon';

const { serverRuntimeConfig } = getConfig();

function makeToken ({ typ, sid, tgt, evt }) {
  return sign(
    { typ, sid, tgt, evt },
    serverRuntimeConfig.gql.secret,
    { audience: serverRuntimeConfig.gql.audience, expiresIn: '31d', noTimestamp: true }
  );
}

export default async function (req, res) {
  const session = await getSession({ req });
  if (!session?.user?.nickname) return res.send(null);

  const username = session.user.nickname;

  const labsMyToken = makeToken({ typ: '_', tgt: 'u', sid: username });
  const accountToken = sign({ scopes: `read:users` }, serverRuntimeConfig.gql.accountSecret, { expiresIn: '5m' });

  const { account, labs } = await apiFetch(
    print(EligibilityQuery),
    { username },
    {
      'Authorization': `Bearer ${accountToken}`,
      'X-Labs-Authorization': `Bearer ${labsMyToken}`,
    },
  );

  const roleIds = (account?.getUser?.roles || []).map((r) => r.id);
  const isAdmin = roleIds.includes(serverRuntimeConfig.auth0.roles.admin);
  const isManager = roleIds.includes(serverRuntimeConfig.auth0.roles.manager);
  const isReviewer = roleIds.includes(serverRuntimeConfig.auth0.roles.reviewer);
  const isOpenSourceManager = roleIds.includes(serverRuntimeConfig.auth0.roles.openSourceManager);
  
  const events = (isAdmin || isManager || isReviewer)
    ? labs.events
    : labs.myEvents;

  const result = Object.fromEntries(
    events.map((e) => [e.name, {
      a: isAdmin && makeToken({ typ: 'a', evt: e.id }),
      mm: (isAdmin || isManager) && makeToken({ typ: 'mm', sid: username, tgt: 'u', evt: e.id }),
      r: (isAdmin || isReviewer) && makeToken({ typ: 'r', sid: username, tgt: 'u', evt: e.id }),
      m: e.iAmMentor && makeToken({ typ: 'm', sid: username, tgt: 'u', evt: e.id }),
      s: e.iAmStudent && makeToken({ typ: 's', sid: username, tgt: 'u', evt: e.id }),
    }]),
  );

  res.send({
    events: result,
    osm: isOpenSourceManager && makeToken({ typ: 'osm', sid: username, tgt: 'u' }),
  });
}
