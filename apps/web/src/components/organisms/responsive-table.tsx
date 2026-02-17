'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/lib/hooks/use-media-query';

interface Column<T> {
  id: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  mobileCard?: (item: T) => React.ReactNode;
  loading?: boolean;
  emptyMessage?: string;
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  mobileCard,
  loading,
  emptyMessage = 'No data available',
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4">
            <div className="h-20 bg-gray-200 rounded animate-pulse" />
          </Card>
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="p-8">
        <p className="text-center text-gray-500">{emptyMessage}</p>
      </Card>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((item, index) => (
          <Card key={index} className="p-4">
            {mobileCard ? (
              mobileCard(item)
            ) : (
              <div className="space-y-2">
                {columns.map((col) => (
                  <div key={col.id} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-500">{col.label}:</span>
                    <span className="text-sm">
                      {col.render ? col.render(item) : item[col.id]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.id}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index}>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  {col.render ? col.render(item) : item[col.id]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
