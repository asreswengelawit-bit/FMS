import { fmsFetch } from "./fms-client";
import type { AuditLog, PagedResponse } from "../types/fms";

export async function listAuditLogs(params?: { entityType?: string; entityId?: string; performedBy?: string; action?: string; page?: number; size?: number }): Promise<PagedResponse<AuditLog>> {
  const sp = new URLSearchParams();
  if (params?.entityType) sp.set("entityType", params.entityType);
  if (params?.entityId) sp.set("entityId", params.entityId);
  if (params?.performedBy) sp.set("performedBy", params.performedBy);
  if (params?.action) sp.set("action", params.action);
  sp.set("page", String(params?.page ?? 0));
  sp.set("size", String(params?.size ?? 50));
  return fmsFetch<PagedResponse<AuditLog>>(`/api/v1/audit-logs?${sp.toString()}`);
}

export async function getAuditLog(id: string): Promise<AuditLog> {
  return fmsFetch<AuditLog>(`/api/v1/audit-logs/${id}`);
}
