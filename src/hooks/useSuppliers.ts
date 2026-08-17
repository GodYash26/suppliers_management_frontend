import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { supplierService } from '@/services/supplier.service';
import { Supplier } from '@/types/supplier';
import { parseApiError, getErrorMessage, NormalizedApiError } from '@/lib/api-error';

export { parseApiError, getErrorMessage };
export type { NormalizedApiError };

export const SUPPLIER_KEYS = {
  all: ['suppliers'] as const,
  one: (id: string) => ['supplier', id] as const,
};

/**
 * Fetch all suppliers.
 */
export function useSuppliers(options?: Partial<UseQueryOptions<Supplier[], unknown>>) {
  return useQuery<Supplier[], unknown>({
    queryKey: SUPPLIER_KEYS.all,
    queryFn: supplierService.getAll,
    ...options,
  });
}

/**
 * Fetch a single supplier by ID.
 */
export function useSupplier(
  id: string,
  options?: Partial<UseQueryOptions<Supplier, unknown>>
) {
  return useQuery<Supplier, unknown>({
    queryKey: SUPPLIER_KEYS.one(id),
    queryFn: () => supplierService.getOne(id),
    enabled: Boolean(id),
    ...options,
  });
}

/**
 * Create a new supplier (DRAFT).
 * Global error handling automatically toasts any backend errors.
 */
export function useCreateSupplier(
  options?: UseMutationOptions<
    Supplier,
    unknown,
    { companyName: string; vatId: string; country: string; contactEmail: string }
  >
) {
  const qc = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: supplierService.create,
    onSuccess: (data, variables, context, meta) => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      onSuccess?.(data, variables, context, meta);
    },
    ...restOptions,
  });
}

/**
 * Submit a supplier for approval (DRAFT -> PENDING_APPROVAL).
 */
export function useSubmitSupplier(
  options?: UseMutationOptions<Supplier, unknown, string>
) {
  const qc = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: (id: string) => supplierService.submit(id),
    onSuccess: (data, id, context, meta) => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.one(id) });
      onSuccess?.(data, id, context, meta);
    },
    ...restOptions,
  });
}

/**
 * Approve a supplier (PENDING_APPROVAL -> APPROVED).
 */
export function useApproveSupplier(
  options?: UseMutationOptions<Supplier, unknown, string>
) {
  const qc = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: (id: string) => supplierService.approve(id),
    onSuccess: (data, id, context, meta) => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.one(id) });
      onSuccess?.(data, id, context, meta);
    },
    ...restOptions,
  });
}

/**
 * Reject a supplier (PENDING_APPROVAL -> REJECTED).
 */
export function useRejectSupplier(
  options?: UseMutationOptions<Supplier, unknown, { id: string; reason: string }>
) {
  const qc = useQueryClient();
  const { onSuccess, ...restOptions } = options || {};

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      supplierService.reject(id, reason),
    onSuccess: (data, variables, context, meta) => {
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.all });
      qc.invalidateQueries({ queryKey: SUPPLIER_KEYS.one(variables.id) });
      onSuccess?.(data, variables, context, meta);
    },
    ...restOptions,
  });
}
