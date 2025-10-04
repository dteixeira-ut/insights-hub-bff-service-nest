import {
  Controller,
  Get,
  Param,
  Headers,
  Res,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import type { Response } from 'express'
import { GetReportByIdUseCase } from '../use-cases/get-report-by-id.use-case'
import { GetReportByIdParamsDto } from '../schemas/get-report-by-id.schema'
import { extractUTHeaders, getPermissionsListFromHeaders } from '@/utils'
import { NotFoundError } from '@usertestingenterprise/grpc-client'
import type { IncomingHttpHeaders } from 'http'

@Controller('reports')
export class GetReportByIdController {
  constructor(
    private readonly getReportByIdUseCase: GetReportByIdUseCase,
  ) {}

  @Get(':reportId')
  @UsePipes(new ValidationPipe({ transform: true }))
  async handle(
    @Param() params: GetReportByIdParamsDto,
    @Headers() headers: IncomingHttpHeaders,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const { permissionList, workspaceId, accountId } = extractUTHeaders(headers)
      const permissions = getPermissionsListFromHeaders(permissionList)

      const { status, reason, grpcResponse } = await this.getReportByIdUseCase.getReportById(
        params.reportId,
        accountId,
        workspaceId,
        permissions,
      )

      res.status(status).json(reason ? { reason } : grpcResponse)
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new HttpException({ reason: 'Report not found' }, HttpStatus.NOT_FOUND)
      }

      // eslint-disable-next-line no-console -- Temporarily using console until centralized logger is integrated
      console.error(`could_not_get_report_by_id: ${error}`)

      throw new HttpException(
        {
          reason: 'Invalid response from reports-service',
          errorCode: 'GRBI-500',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}