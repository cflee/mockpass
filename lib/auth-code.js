const AUTH_CODE_TIMEOUT = 5 * 60 * 1000

const generateAuthCode = ({ profile, scopes, nonce }) => {
  const now = Date.now()
  const data = JSON.stringify({ time: now, profile, scopes, nonce })
  return data
}

const lookUpByAuthCode = (authCode) => {
  const now = Date.now()
  const { time, profile, scopes, nonce } = JSON.parse(authCode)
  if (time + AUTH_CODE_TIMEOUT < now) {
    return undefined
  }
  return { profile, scopes, nonce }
}

module.exports = { generateAuthCode, lookUpByAuthCode }
