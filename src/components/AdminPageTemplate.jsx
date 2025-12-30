"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/DataTable';
import { AdminErrorBoundary } from '@/components/AdminErrorBoundary';
import { AdminLoading, TableLoading } from '@/components/AdminLoading';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export function AdminPageTemplate({
  title,
  data,
  columns,
  isLoading,
  error,
  createPath,
  createButtonText,
  onRefresh,
  searchKey = "title",
  apiEndpoint
}) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setRefreshing(false);
    }
  };

  if (error) {
    return (
      <AdminErrorBoundary>
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading {title}</h2>
          <p className="text-gray-600 mb-4">{error.message || 'An unexpected error occurred'}</p>
          <Button onClick={handleRefresh} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </AdminErrorBoundary>
    );
  }

  return (
    <AdminErrorBoundary>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">
              Manage {title.toLowerCase()} for your application
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing || isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {createPath && (
              <Button asChild>
                <Link href={createPath}>
                  <Plus className="h-4 w-4 mr-2" />
                  {createButtonText || `Create ${title.slice(0, -1)}`}
                </Link>
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <TableLoading />
        ) : (
          <div className="bg-white rounded-lg border">
            <DataTable
              columns={columns}
              data={data || []}
              searchKey={searchKey}
              apiEndpoint={apiEndpoint}
            />
          </div>
        )}
      </div>
    </AdminErrorBoundary>
  );
}