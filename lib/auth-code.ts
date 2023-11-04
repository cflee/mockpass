import { SingPassProfile, CorpPassProfile } from "./assertions"

const AUTH_CODE_TIMEOUT = 5 * 60 * 1000

export function generateAuthCode({ profile, scopes, nonce }: { profile: SingPassProfile | CorpPassProfile, scopes?: string, nonce: string}) {
  const now = Date.now()
  const data = JSON.stringify({ time: now, profile, scopes, nonce })
  return data
}

export function lookUpByAuthCode(authCode) {
  const now = Date.now()
  const { time, profile, scopes, nonce } = JSON.parse(authCode)
  if (time + AUTH_CODE_TIMEOUT < now) {
    return undefined
  }
  return { profile, scopes, nonce }
}
