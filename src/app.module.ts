import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes config available everywhere
    }),
    ReportsModule,
  ],
})
export class AppModule {}
