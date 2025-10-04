import 'dotenv/config'

interface GlobalSearchConfig {
  url: string
  clientId: string
}

interface GrpcClientConfig {
  protoFileName: string
  address: string
  package: string
  service: string
  channelOptions?: {
    'grpc.max_send_message_length': number
  }
}

interface ServerConfig {
  globalSearch: GlobalSearchConfig
  grpc: { embeds: GrpcClientConfig; reports: GrpcClientConfig; exports: GrpcClientConfig }
  launchDarklyKey: string | null
  logger: {
    level: string
  }
  protoBase: string
  server: {
    host: string
    port: number
  }
  swagger: boolean
  uploadCare: { signSecret: string }
}

export const setConfig = (configFile: ServerConfig): ServerConfig => {
  const originalConfig = configFile

  const uploadCareSignSecret = process.env.UPLOADCARE_SIGN_SECRET || originalConfig.uploadCare?.signSecret
  if (!uploadCareSignSecret) {
    throw new Error('UploadCare Sign Secret variable not defined')
  }

  const launchDarklyKey = process.env.LAUNCHDARKLY_SDK_KEY || originalConfig?.launchDarklyKey
  return {
    ...originalConfig,
    uploadCare: {
      signSecret: uploadCareSignSecret,
    },
    launchDarklyKey,
  }
}
