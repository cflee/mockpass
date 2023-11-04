#!/usr/bin/env node
import express, { Request } from 'express'
import fs from 'fs'
import morgan from 'morgan'
import path from 'path'
import 'dotenv/config'

import { configOIDC, configOIDCv2, configMyInfo, configSGID } from './lib/express'

const PORT = process.env.MOCKPASS_PORT || process.env.PORT || 5156

export interface ServiceProvider {
  cert: Buffer;
  pubKey: Buffer;
}

export interface CryptoConfig {
  signAssertion: boolean;
  signResponse: boolean;
  encryptAssertion: boolean;
  resolveArtifactRequestSigned: boolean;
}

export interface Options {
  serviceProvider: ServiceProvider;
  showLoginPage: (req: Request) => boolean;
  encryptMyInfo: boolean;
  cryptoConfig: CryptoConfig;
}

const serviceProvider: ServiceProvider = {
  cert: fs.readFileSync(
    path.resolve(
      __dirname,
      process.env.SERVICE_PROVIDER_CERT_PATH || './static/certs/server.crt',
    ),
  ),
  pubKey: fs.readFileSync(
    path.resolve(
      __dirname,
      process.env.SERVICE_PROVIDER_PUB_KEY || './static/certs/key.pub',
    ),
  ),
}

const cryptoConfig: CryptoConfig = {
  signAssertion: process.env.SIGN_ASSERTION !== 'false', // default to true to be backward compatable
  signResponse: process.env.SIGN_RESPONSE !== 'false',
  encryptAssertion: process.env.ENCRYPT_ASSERTION !== 'false',
  resolveArtifactRequestSigned:
    process.env.RESOLVE_ARTIFACT_REQUEST_SIGNED !== 'false',
}

const options: Options = {
  serviceProvider,
  showLoginPage: (req: Request) =>
    (req.header('X-Show-Login-Page') || process.env.SHOW_LOGIN_PAGE) === 'true',
  encryptMyInfo: process.env.ENCRYPT_MYINFO === 'true',
  cryptoConfig,
}

const app = express()
app.use(morgan('combined'))

configOIDC(app, options)
configOIDCv2(app, options)
configSGID(app, options)

configMyInfo.consent(app)
configMyInfo.v3(app, options)

app.enable('trust proxy')
app.use(express.static(path.join(__dirname, 'public')))

app.listen(PORT)
.on('error', (err) => console.error('Unable to start MockPass', err))
.on('listening', () => console.warn(`MockPass listening on ${PORT}`))
