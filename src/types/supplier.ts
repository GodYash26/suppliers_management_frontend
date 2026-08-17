export type SupplierStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED';

export type SupplierRole = 'REQUESTER' | 'APPROVER';

export interface Supplier {
  id: string;
  companyName: string;
  vatId: string;
  country: string;
  contactEmail: string;
  status: SupplierStatus;
  createdBy: string;
  createdById: string;
  createdAt: string;
  approvedBy?: string;
  approvedById?: string;
  rejectedBy?: string;
  rejectedById?: string;
  rejectionReason?: string;
}

export interface ApiError {
  code: string;
  message: string;
}

export const USERS = {
  anna: { id: 'anna', name: 'Anna', role: 'Requester' },
  max: { id: 'max', name: 'Max', role: 'Approver' },
} as const;

export type UserId = keyof typeof USERS;
