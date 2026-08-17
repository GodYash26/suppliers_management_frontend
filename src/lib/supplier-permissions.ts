import { AuthUser } from '@/services/auth.service';
import { Supplier, SupplierRole, SupplierStatus } from '@/types/supplier';

export const SUPPLIER_STATUS: Record<SupplierStatus, SupplierStatus> = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export function normalizeSupplierRole(role?: string | null): SupplierRole | null {
  const normalized = role?.trim().toUpperCase();
  if (normalized === 'REQUESTOR') return 'REQUESTER';
  if (normalized === 'REQUESTER' || normalized === 'APPROVER') return normalized;
  return null;
}

export function getSupplierPermissions(
  supplier: Supplier,
  user: Pick<AuthUser, 'id' | 'role'> | null,
) {
  const role = normalizeSupplierRole(user?.role);
  const isCreator = Boolean(user?.id && supplier.createdById === user.id);
  const isDraft = supplier.status === SUPPLIER_STATUS.DRAFT;
  const isPending = supplier.status === SUPPLIER_STATUS.PENDING_APPROVAL;
  const canView = role === 'REQUESTER' || role === 'APPROVER';

  return {
    canView,
    canCreate: canView,
    canSubmit: canView && isDraft,
    canApprove: role === 'APPROVER' && isPending && !isCreator,
    canReject: role === 'APPROVER' && isPending && !isCreator,
    isCreator,
    selfApprovalBlocked: role === 'APPROVER' && isPending && isCreator,
  };
}
