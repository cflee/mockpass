import controllers from './controllers'
import { pki } from '../../crypto/myinfo-signature'

export { config as consent } from './consent'
export const v3 = controllers('v3', pki)
