'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Rocket, Loader2, Download, Upload, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export interface ExportWorkflowData {
  name: string;
  nodes: unknown[];
  edges: unknown[];
  version: string;
}

interface HeaderProps {
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
  onSave?: () => Promise<void>;
  onExport?: () => void;
  onImport?: (data: ExportWorkflowData) => void;
}

export default function Header({
  workflowName,
  onWorkflowNameChange,
  onSave,
  onExport,
  onImport,
}: HeaderProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!onSave) return;

    setIsSaving(true);
    try {
      await onSave();
    } catch (error) {
      console.error('Error saving workflow:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (onExport) {
      onExport();
    }
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !onImport) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text) as ExportWorkflowData;

        // Validate the imported data
        if (!data.name || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
          throw new Error('Invalid workflow file format');
        }

        // Call parent handler
        onImport(data);
      } catch (error: any) {
        console.error('Error importing workflow:', error);
        toast.error('Failed to Import Workflow', {
          description: error.message || 'Invalid workflow file format',
        });
      }
    };
    reader.readAsText(file);

    // Reset input so the same file can be selected again
    event.target.value = '';
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/')}
          className="text-gray-400 hover:text-white hover:bg-neutral-800"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Dashboard
        </Button>
        <input
          type="text"
          value={workflowName}
          onChange={(e) => onWorkflowNameChange(e.target.value)}
          className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0 text-gray-200 placeholder:text-gray-500"
          placeholder="Untitled Workflow"
        />
      </div>
      <div className="flex items-center gap-3">
        {/* Export Button */}
        {onExport && (
          <Button
            size="sm"
            onClick={handleExport}
            className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 shadow-sm"
          >
            <Download size={16} className="mr-2" />
            ⬇️ Export
          </Button>
        )}

        {/* Import Button */}
        {onImport && (
          <>
            <Button
              size="sm"
              onClick={handleImport}
              className="bg-neutral-800 border border-neutral-700 text-white hover:bg-neutral-700 shadow-sm"
            >
              <Upload size={16} className="mr-2" />
              ⬆️ Import
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </>
        )}

        {/* Save Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isSaving || !onSave}
          className="bg-neutral-800 border-neutral-700 text-white hover:bg-neutral-700"
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save'
          )}
        </Button>

        {/* Deploy Button */}
        <Button size="sm" className="bg-weavy-primary hover:bg-weavy-purple-dark text-white">
          <Rocket size={16} className="mr-2" />
          Deploy
        </Button>
      </div>
    </div>
  );
}

