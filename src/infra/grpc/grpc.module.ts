import { Module, OnModuleInit, Global } from '@nestjs/common'
import { GrpcClients } from '@/infra/grpc'  // your file

@Global() // optional: makes the client available app-wide
@Module({
  providers: [
    {
      provide: 'REPORTS_GRPC_CLIENT',
      useFactory: async (): Promise<typeof GrpcClients> => {
        // Initialize all clients once
        GrpcClients.init()
        return GrpcClients
      },
    },
  ],
  exports: ['REPORTS_GRPC_CLIENT'],
})

export class GrpcInfraModule implements OnModuleInit {
  onModuleInit() {
    // Safe to call init here if you prefer Nest lifecycle
    GrpcClients.init()
  }
}