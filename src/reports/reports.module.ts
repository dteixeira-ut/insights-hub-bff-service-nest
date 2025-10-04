import { Module } from '@nestjs/common';
import { GetReportByIdController } from './controllers/get-report-by-id.controller';
import { ReportsService } from './services/reports.service';
import { GetReportByIdUseCase } from './use-cases/get-report-by-id.use-case';
import { GrpcInfraModule } from '@/infra/grpc/grpc.module';

@Module({
  imports: [GrpcInfraModule],
  controllers: [GetReportByIdController],
  providers: [ReportsService, GetReportByIdUseCase],
})
export class ReportsModule {}
