import { Request } from 'express'
import { CorpPassProfile, IdP, SingPassProfile, myinfo } from '../../assertions'

export function buildAssertURL(redirectURI: string, authCode: string, state: string) {
  return `${redirectURI}?code=${encodeURIComponent(
    authCode,
  )}&state=${encodeURIComponent(state)}`
}

export const idGenerator = {
  singPass: ({ nric }: SingPassProfile) =>
    myinfo.v3.personas[nric] ? `${nric} [MyInfo]` : nric,
  corpPass: ({ nric, uen }: CorpPassProfile) => `${nric} / UEN: ${uen}`,
}

export const customProfileFromHeaders = {
  singPass: (req: Request) => {
    const customNricHeader = req.header('X-Custom-NRIC')
    const customUuidHeader = req.header('X-Custom-UUID')
    if (!customNricHeader || !customUuidHeader) {
      return false
    }
    return { nric: customNricHeader, uuid: customUuidHeader }
  },
  corpPass: (req: Request) => {
    const customNricHeader = req.header('X-Custom-NRIC')
    const customUuidHeader = req.header('X-Custom-UUID')
    const customUenHeader = req.header('X-Custom-UEN')
    if (!customNricHeader || !customUuidHeader || !customUenHeader) {
      return false
    }
    return {
      nric: customNricHeader,
      uuid: customUuidHeader,
      uen: customUenHeader,
    }
  },
}
