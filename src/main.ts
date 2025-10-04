import path from 'path'

import moduleAlias from 'module-alias'
moduleAlias.addAliases({
  '@': __dirname,
  '#': path.resolve(__dirname, '../test'),
})

import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, Logger } from '@nestjs/common'
import { GrpcClients } from '@/infra/grpc'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))
  GrpcClients.init()
  await app.listen(process.env.PORT ?? 3000)
  Logger.log(`BFF listening on ${await app.getUrl()}`)
}
bootstrap()