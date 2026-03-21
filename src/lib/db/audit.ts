// src/lib/db/audit.ts
import { prisma } from "@/lib/prisma";
import { AuditAction } from "@prisma/client";

interface CreateAuditLogParams {
  entity: string;
  entityId: string;
  action: AuditAction;
  performedById?: string | null;
  changes?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  ipAddress?: string;
  userAgent?: string;
}

export async function createAuditLog(params: CreateAuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        entity: params.entity,
        entityId: params.entityId,
        action: params.action,
        performedById: params.performedById ?? null,
        changes: params.changes ? (params.changes as any) : undefined,
        ipAddress: params.ipAddress ?? null,
        userAgent: params.userAgent ?? null,
      },
    });
  } catch (error) {
    // El audit log no debe interrumpir el flujo principal
    console.error("[createAuditLog] Error:", error);
  }
}
