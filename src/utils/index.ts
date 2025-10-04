import type { IncomingHttpHeaders } from 'http'
import { Response, Request, NextFunction } from 'express'

type UTRequiredHeaders = {
  workspaceId: string
  accountId: string
  permissionList: string
  userId: string
  userEmail?: string
}

export enum ReportStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export const extractUTHeaders = (headers: IncomingHttpHeaders): UTRequiredHeaders => {
  const workspaceId = headers.workspaceuuid
  const accountId = headers.accountuuid
  const permissionList = headers['x-utz-permission-list']
  const userId = headers['x-utz-user-uuid']
  const userEmail = headers['x-utz-user-email']

  if (
    typeof workspaceId !== 'string' ||
    typeof accountId !== 'string' ||
    typeof permissionList !== 'string' ||
    typeof userId !== 'string' ||
    (userEmail && typeof userEmail !== 'string')
  ) {
    throw new Error('Unexpected header types received')
  }

  return { workspaceId, accountId, permissionList, userId, userEmail }
}

export const getPermissionsListFromHeaders = (permissionsList: string): Permissions[] =>
  (permissionsList?.split(',').map((permission) => permission.trim()) as Permissions[]) ?? []

export enum Permissions {
  CONTENT_EDIT = 'ihub_report_content_edit',
  CREATE = 'ihub_report_create',
  DELETE = 'ihub_report_delete',
  DRAFT_READ = 'ihub_report_draft_read',
  PUBLISHED_READ = 'ihub_report_published_read',
  LINK_SHARE = 'ihub_report_link_share',
  STATUS_EDIT = 'ihub_report_status_edit',
}

export const draftAndPublishedReadPermissions = new Set<string>([Permissions.DRAFT_READ, Permissions.PUBLISHED_READ])
export const contentEditPermissions = new Set<string>([Permissions.CONTENT_EDIT])
export const deletePermissions = new Set<string>([Permissions.DELETE])
export const createPermissions = new Set<string>([Permissions.CREATE])
export const shareLinkPermissions = new Set<string>([Permissions.LINK_SHARE])
export const statusEditPermissions = new Set<string>([Permissions.STATUS_EDIT])

type CommonObject = { [key: string]: string }

const headerPermissions = (headers: CommonObject): string[] => {
  const { 'x-utz-permission-list': permissionsString } = headers
  return permissionsString ? permissionsString?.split(',') : []
}

/**
 * Middleware to check user permissions dynamically.
 * @param permissionsAllowed - A set of permissions required to access the endpoint.
 */
export const permissionMiddleware = (permissionsAllowed: Set<string>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userPermissions: string[] = headerPermissions(req.headers as CommonObject)

    if (userPermissions.some((perm) => permissionsAllowed.has(perm))) {
      next()
    } else {
      res.status(403).json({
        reason: 'Insufficient permissions',
      })
    }
  }
}
