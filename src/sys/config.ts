import 'dotenv/config'
import { readFileSync } from 'fs'
import path from 'path'

export type ServerConfig = {
  server: {
    host: string
    port: number
  }
  logger: {
    level: string
    service: string
  }
  grpc: {
    clients: {
      [key: string]: {
        address: string
        package: string
        protoFileName: string
        service: string
        channelOptions?: {
    'grpc.max_send_message_length': number
      }
  }
    }
  }
  launchDarklyKey: string
  smartApi: {
    host: string
    userAuthToken: string
    apiToken: string
    paths: {
      requireAccountMembershipToViewAssets: string
      updateClipsAndReelsPrivacySettings: string
    }
  }
  swagger: boolean
}

const rawConfig = readFileSync(path.resolve(__dirname, '../../config/config.json'))
const originalConfig: ServerConfig = JSON.parse(rawConfig.toString())

const config: ServerConfig = {
  ...originalConfig,
  launchDarklyKey: process.env.LAUNCHDARKLY_SDK_KEY as string,
  smartApi: {
    ...originalConfig.smartApi,
    userAuthToken: process.env.SMART_API_USER_AUTH_TOKEN as string,
    apiToken: process.env.SMART_API_API_TOKEN as string,
  },
}

export default config
