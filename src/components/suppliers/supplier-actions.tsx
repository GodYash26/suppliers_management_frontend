'use client';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  useApproveSupplier,
  useRejectSupplier,
  useSubmitSupplier,
} from '@/hooks/useSuppliers';
import { getErrorMessage } from '@/lib/api-error';
import { getSupplierPermissions } from '@/lib/supplier-permissions';
import { AuthUser } from '@/services/auth.service';
import { Supplier } from '@/types/supplier';
import {
  rejectSupplierSchema,
  RejectSupplierFormValues,
} from '@/validations/supplier.validations';
import { useState } from 'react';

interface SupplierActionsProps {
  supplier: Supplier;
  user: AuthUser | null;
  showView?: boolean;
  align?: 'left' | 'right';
}

export function SupplierActions({
  supplier,
  user,
  showView = true,
  align = 'right',
}: SupplierActionsProps) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const permissions = getSupplierPermissions(supplier, user);
  const submitMutation = useSubmitSupplier();
  const approveMutation = useApproveSupplier();
  const rejectMutation = useRejectSupplier();
  const pending =
    submitMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending;

  const form = useForm<RejectSupplierFormValues>({
    resolver: zodResolver(rejectSupplierSchema),
    defaultValues: { reason: '' },
  });

  const handleSubmitSupplier = async () => {
    try {
      await submitMutation.mutateAsync(supplier.id);
      toast.success('Supplier submitted for approval');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleApprove = async () => {
    try {
      await approveMutation.mutateAsync(supplier.id);
      toast.success('Supplier approved');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleReject = async (values: RejectSupplierFormValues) => {
    try {
      await rejectMutation.mutateAsync({
        id: supplier.id,
        reason: values.reason,
      });
      toast.success('Supplier rejected');
      form.reset();
      setRejectOpen(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const hasWorkflowAction =
    permissions.canSubmit || permissions.canApprove || permissions.canReject;

  return (
    <div
      className={
        align === 'right'
          ? 'flex flex-wrap items-center justify-end gap-2'
          : 'flex flex-wrap items-center gap-2'
      }
    >
      {showView && (
        <Link href={`/suppliers/${supplier.id}`}>
          <Button variant="outline" size="sm">
            View
          </Button>
        </Link>
      )}

      {permissions.canSubmit && (
        <Button
          size="sm"
          variant="secondary"
          disabled={pending}
          onClick={handleSubmitSupplier}
        >
          {submitMutation.isPending && <Loader2 className="animate-spin" />}
          Submit
        </Button>
      )}

      {permissions.canApprove && (
        <Button size="sm" disabled={pending} onClick={handleApprove}>
          {approveMutation.isPending && <Loader2 className="animate-spin" />}
          Approve
        </Button>
      )}

      {permissions.canReject && (
        <Button
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() => setRejectOpen(true)}
        >
          Reject
        </Button>
      )}

      {!hasWorkflowAction && permissions.selfApprovalBlocked && (
        <span className="max-w-56 text-xs text-muted-foreground">
          You cannot approve or reject a supplier you created.
        </span>
      )}

      {!showView && !hasWorkflowAction && !permissions.selfApprovalBlocked && (
        <span className="text-sm text-muted-foreground">No actions available</span>
      )}

      <Dialog
        open={rejectOpen}
        onOpenChange={(open) => {
          setRejectOpen(open);
          if (!open) form.reset();
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Supplier</DialogTitle>
            <DialogDescription>
              Provide a reason for rejecting {supplier.companyName}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(handleReject)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`reject-reason-${supplier.id}`}>
                Rejection reason
              </Label>
              <Textarea
                id={`reject-reason-${supplier.id}`}
                placeholder="VAT information could not be verified."
                aria-invalid={!!form.formState.errors.reason}
                {...form.register('reason')}
              />
              {form.formState.errors.reason && (
                <p className="text-xs text-destructive">
                  {form.formState.errors.reason.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={rejectMutation.isPending}
                onClick={() => setRejectOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={rejectMutation.isPending}
              >
                {rejectMutation.isPending && (
                  <Loader2 className="animate-spin" />
                )}
                Reject Supplier
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
