import getConfig from 'next/config';
import { sign } from 'jsonwebtoken';

const { serverRuntimeConfig } = getConfig();

export function makeToken ({ typ, sid, tgt, evt }) {
  return sign(
    { typ, sid, tgt, evt },
    serverRuntimeConfig.gql.secret,
    { audience: serverRuntimeConfig.gql.audience, expiresIn: '120d', noTimestamp: true }
  );
}
