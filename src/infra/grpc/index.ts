import { GrpcClient , createGrpcClient } from '@usertestingenterprise/grpc-client'
import { protoBase } from '@usertestingenterprise/insights-hub-protos'

import config from '@/sys/config'
import logger from '@/sys/logger'

const clientKeys = ['reports']
type ClientKey = (typeof clientKeys)[number]
type ClientMap = Record<ClientKey, GrpcClient | null>

const grpcClients: ClientMap = {
  reports: null,
}

const init = () => {
  for (const key of clientKeys) {
    const { protoFileName, channelOptions, ...clientCfg } = config.grpc.clients[key]
    const protoPath = `${protoBase}/${protoFileName}`

    logger.info({
      message: `initializing_${key}_services_grpc_client`,
      config: clientCfg,
    })

    grpcClients[key] = createGrpcClient({
      ...clientCfg,
      protoPath,
    },channelOptions)

    logger.info({
      message: `created_${key}_grpc_client`,
      ok: !!grpcClients[key],
    })

  }
}

export const GrpcClients = {
  init,

  get reports(): GrpcClient {
    if (!grpcClients.reports) {
      throw new Error('gRPC reports service not initialized')
    }
    return grpcClients.reports
  },

}
