'use client';

import { useSuppliers } from '@/hooks/useSuppliers';
import { useAuth } from '@/context/auth-context';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, RefreshCw, PackageOpen } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import CreateSupplierDialog from './supplier.form';
import { SupplierActions } from './supplier-actions';

export default function SuppliersTable() {
    const { data: suppliers, isLoading, isError, refetch } = useSuppliers();
    const { user } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">Suppliers</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage and track supplier approvals
                    </p>
                </div>
                <Button onClick={() => setDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Supplier
                </Button>
            </div>

            {/* Dialog */}
            <CreateSupplierDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            />

            {/* Error */}
            {isError && (
                <Alert variant="destructive">
                    <AlertDescription className="flex items-center justify-between">
                        <span>Failed to load suppliers.</span>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Table */}
            <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50">
                            <TableHead>Company Name</TableHead>
                            <TableHead>VAT ID</TableHead>
                            <TableHead>Country</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created By</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Decision</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Loading */}
                        {isLoading &&
                            Array.from({ length: 4 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <TableCell key={j}>
                                            <Skeleton className="h-4 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}

                        {/* Empty */}
                        {!isLoading && !isError && suppliers?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7}>
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
                                        <PackageOpen className="w-8 h-8" />
                                        <p className="text-sm">No suppliers yet.</p>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-1"
                                            onClick={() => setDialogOpen(true)}
                                        >
                                            Create your first supplier
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Data */}
                        {!isLoading &&
                            suppliers?.map((supplier) => (
                                <TableRow key={supplier.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">
                                        {supplier.companyName}
                                    </TableCell>
                                    <TableCell className="text-gray-600 font-mono text-sm">
                                        {supplier.vatId}
                                    </TableCell>
                                    <TableCell>{supplier.country}</TableCell>
                                    <TableCell>
                                        <StatusBadge status={supplier.status} />
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-gray-600">
                                        {supplier.createdBy}
                                    </TableCell>
                                    <TableCell className="text-gray-500 text-sm">
                                        {format(new Date(supplier.createdAt), 'dd MMM yyyy, HH:mm')}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {supplier.approvedBy && (
                                            <span>Approved by {supplier.approvedBy}</span>
                                        )}
                                        {supplier.rejectedBy && (
                                            <span>
                                                Rejected by {supplier.rejectedBy}
                                                {supplier.rejectionReason
                                                    ? `: ${supplier.rejectionReason}`
                                                    : ''}
                                            </span>
                                        )}
                                        {!supplier.approvedBy && !supplier.rejectedBy && (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <SupplierActions supplier={supplier} user={user} />
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
