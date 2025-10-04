import { Inject } from '@nestjs/common'
import { GrpcClients } from '@/infra/grpc'
import { Reports } from '@usertestingenterprise/insights-hub-protos'


export interface IReportsService {
  getReportById(request: Reports.ReportByIdRequest): Promise<Reports.GetReportByIdResponse>
}

export class ReportsService implements IReportsService {
  constructor(
    @Inject('REPORTS_GRPC_CLIENT')
    private readonly client: typeof GrpcClients,
  ) {}
  
  async getReportById(request: Reports.ReportByIdRequest): Promise<Reports.GetReportByIdResponse> {
    return this.client.reports.GetReportById({}, request)
  }

}
