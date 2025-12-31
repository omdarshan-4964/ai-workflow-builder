'use client';

import { ReactNode } from 'react';
import { ReactFlowProvider } from '@xyflow/react';

interface WorkflowLayoutProps {
  children: ReactNode;
}

export default function WorkflowLayout({ children }: WorkflowLayoutProps) {
  return (
    <ReactFlowProvider>
      <div className="w-full h-screen overflow-hidden">
        {children}
      </div>
    </ReactFlowProvider>
  );
}

