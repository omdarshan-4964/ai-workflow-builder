'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BaseNodeProps {
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  selected?: boolean;
}

export default function BaseNode({ title, icon: Icon, children, selected = false }: BaseNodeProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border-2 shadow-lg min-w-[280px] transition-all duration-200',
        selected ? 'border-weavy-primary shadow-xl' : 'border-gray-200'
      )}
    >
      {/* Header */}
      <div className="bg-purple-50 px-4 py-3 rounded-t-xl border-b border-purple-100 flex items-center gap-2">
        <div className="flex items-center justify-center w-5 h-5 text-weavy-primary">
          <Icon size={18} />
        </div>
        <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

