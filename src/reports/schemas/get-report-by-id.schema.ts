import { IsUUID, IsOptional, IsString, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer'
import { NextFunction, Request, Response } from 'express'

class UtAuthHeaders {
  @IsUUID()
  workspaceuuid!: string

  @IsUUID()
  accountuuid!: string

  @IsUUID()
  'x-utz-user-uuid'!: string

  'x-utz-permission-list'!: string
}

export class GetReportByIdParamsDto {
  @IsUUID()
  reportId!: string
}

export class GetReportByIdHeadersDto {
  @IsOptional()
  @IsString()
  permissionList?: string

  @IsOptional()
  @IsString()
  workspaceId?: string

  @IsOptional()
  @IsString()
  accountId?: string
}

export type GetReportByIdParamsType = InstanceType<
  typeof GetReportByIdParamsDto
>
export type GetReportByIdHeadersType = InstanceType<
  typeof GetReportByIdHeadersDto
>

export const validateClassAndHeaders = <T extends object>(baseClass: new () => T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const headers = plainToInstance(UtAuthHeaders, req.headers)
    const headerErrors = await validate(headers)

    if (headerErrors.length > 0) {
      return res.status(400).json(headerErrors)
    }

    const params = plainToInstance(baseClass, req.params)
    const paramErrors = await validate(params)

    if (paramErrors.length > 0) {
      return res.status(400).json(paramErrors)
    }

    next()
  }
}

