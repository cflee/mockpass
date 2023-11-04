import _ from 'lodash';
import qs from 'node:querystring';

export interface Context {
  client_secret?: string;
  redirect_uri?: string;
}

export function pki(authHeader, req, context: Context = {}) {
  const authHeaderFieldPairs = _(authHeader)
    .replace(/"/g, '')
    .split(',')
    .map((v) => v.replace('=', '~').split('~'))

  const authHeaderFields = Object.fromEntries(authHeaderFieldPairs)

  const url = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`

  const { method: httpMethod, query, body } = req

  const { signature, app_id, nonce, timestamp } = authHeaderFields

  const params = Object.assign(
    {},
    query,
    body,
    {
      nonce,
      app_id,
      signature_method: 'RS256',
      timestamp,
    },
    context.client_secret && context.redirect_uri ? context : {},
  )

  const sortedParams = Object.fromEntries(
    Object.entries(params).sort(([k1], [k2]) => k1.localeCompare(k2)),
  )

  const baseString =
    httpMethod.toUpperCase() +
    '&' +
    url +
    '&' +
    qs.unescape(qs.stringify(sortedParams as { [k: string]: string }))

  return { signature, baseString }
}
