'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Rocket, Loader2 } from 'lucide-react';

interface HeaderProps {
  workflowName: string;
  onWorkflowNameChange: (name: string) => void;
  onSave?: () => Promise<void>;
}

export default function Header({
  workflowName,
  onWorkflowNameChange,
  onSave,
}: HeaderProps) {
  const [isSaving, setIsSaving] = useState(false);

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

  return (
    <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={workflowName}
          onChange={(e) => onWorkflowNameChange(e.target.value)}
          className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0 text-foreground"
          placeholder="Untitled Workflow"
        />
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          disabled={isSaving || !onSave}
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
        <Button size="sm" className="bg-weavy-primary hover:bg-weavy-purple-dark">
          <Rocket size={16} className="mr-2" />
          Deploy
        </Button>
      </div>
    </div>
  );
}

