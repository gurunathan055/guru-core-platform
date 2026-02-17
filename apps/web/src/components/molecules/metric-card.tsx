'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    trend: 'up' | 'down';
  };
  icon?: React.ReactNode;
  loading?: boolean;
}

export function MetricCard({ title, value, change, icon, loading }: MetricCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {icon && <div className="opacity-50">{icon}</div>}
        </CardHeader>
        <CardContent>
          <div className="h-8 bg-gray-200 rounded animate-pulse" />
          {change && <div className="h-4 bg-gray-200 rounded mt-2 w-20 animate-pulse" />}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon && (
          <div className="h-8 w-8 flex items-center justify-center rounded-full bg-primary-50 text-primary">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p
            className={cn(
              'text-xs flex items-center gap-1 mt-1',
              change.trend === 'up' ? 'text-green-600' : 'text-red-600'
            )}
          >
            <span>{change.trend === 'up' ? '↑' : '↓'}</span>
            <span>{Math.abs(change.value)}%</span>
            <span className="text-gray-500">from last period</span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
