import { print } from 'graphql';
import getConfig from 'next/config';
import { sign } from 'jsonwebtoken';
import { getSession } from 'next-auth/client';
import { apiFetch } from '@codeday/topo/utils';
import { StudentMentorQuery } from './dashRedirect.gql';

const { serverRuntimeConfig } = getConfig();

function makeToken ({ typ, sid, tgt }) {
  return sign(
    { typ, sid, tgt },
    serverRuntimeConfig.gql.secret,
    { audience: serverRuntimeConfig.gql.audience, expiresIn: '31d', noTimestamp: true }
  );
}

export default async function (req, res) {
  const session = await getSession({ req });
  if (!session?.user?.nickname) return res.send(null);

  const username = session.user.nickname;
  const adminToken = makeToken({ typ: 'a' });
  const accountToken = sign({ scopes: `read:users` }, serverRuntimeConfig.gql.accountSecret, { expiresIn: '5m' });

  const { labs, account } = await apiFetch(
    print(StudentMentorQuery),
    { username },
    {
      'X-Labs-Authorization': `Bearer ${adminToken}`,
      'Authorization': `Bearer ${accountToken}`,
    },
  );

  const roleIds = (account?.getUser?.roles || []).map((r) => r.id);
  const isAdmin = roleIds.includes(serverRuntimeConfig.auth0.roles.admin);
  const isManager = roleIds.includes(serverRuntimeConfig.auth0.roles.manager);
  const isReviewer = roleIds.includes(serverRuntimeConfig.auth0.roles.reviewer);

  const tokens = {
    a: isAdmin && adminToken,
    mm: (isAdmin || isManager) && makeToken({ typ: 'mm', sid: username, tgt: 'u' }),
    r: (isAdmin || isReviewer) && makeToken({ typ: 'r', sid: username, tgt: 'u' }),
    m: labs?.mentor?.id && makeToken({ typ: 'm', sid: labs.mentor.id, tgt: 'i' }),
    s: labs?.student?.id && makeToken({ typ: 's', sid: labs.student.id, tgt: 'i' }),
  };

  return res.send(Object.keys(tokens)
    .filter((k) => tokens[k])
    .reduce((accum, k) => ({ ...accum, [k]: tokens[k] }), {}));
}
