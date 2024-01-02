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
  const labsMyToken = makeToken({ typ: 'as', tgt: 'u', sid: username, evt: req.query.e });
  res.send(labsMyToken);
}
