import { Injectable } from '@nestjs/common'
import { ReportsService } from '@/reports/services/reports.service'
import { Reports } from '@usertestingenterprise/insights-hub-protos'
import { Permissions, ReportStatus } from '@/utils'

interface GetReportByIdRepsonseFormatted extends Omit<Reports.GetReportByIdResponse, 'headerImage' | 'deletedAt'> {
  headerImage: string | null
}

interface GetReportByIdResponse {
  status: number
  reason?: string
  grpcResponse?: GetReportByIdRepsonseFormatted
}

@Injectable()
export class GetReportByIdUseCase {
  constructor(private readonly reportsService: ReportsService) {}

async getReportById(
    reportId: string,
    accountId: string,
    workspaceId: string,
    permissions: Permissions[],
  ): Promise<GetReportByIdResponse> {
    const grpcResponse = await this.reportsService.getReportById({ reportId, accountId, workspaceId })

    if (!permissions.includes(Permissions.DRAFT_READ) && grpcResponse.status === ReportStatus.DRAFT) {
      return {
        status: 403,
        reason: 'Insufficient permissions',
      }
    }

    return {
      status: 200,
      grpcResponse: {
        ...grpcResponse,
        headerImage: grpcResponse.headerImage ? grpcResponse.headerImage : null,
      },
    }
  }
}