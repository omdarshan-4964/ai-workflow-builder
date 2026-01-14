'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Rocket, Loader2, Download, Upload, ArrowLeft, X, ExternalLink, Copy, Check } from 'lucide-react';
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
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
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
        <Button 
          size="sm" 
          className="bg-weavy-primary hover:bg-weavy-purple-dark text-white"
          onClick={() => setShowDeployModal(true)}
        >
          <Rocket size={16} className="mr-2" />
          <span className="hidden sm:inline">Deploy</span>
        </Button>
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="deploy-modal-overlay" onClick={() => setShowDeployModal(false)}>
          <div className="deploy-modal" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Rocket size={20} className="text-purple-400" />
                Deploy to Vercel
              </h2>
              <button
                onClick={() => setShowDeployModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Step 1 */}
              <div className="bg-neutral-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-400 mb-2">Step 1: Set Environment Variables</h3>
                <p className="text-xs text-gray-400 mb-3">
                  Add your Gemini API key and MongoDB URI to Vercel:
                </p>
                <div className="bg-neutral-900 rounded p-3 font-mono text-xs text-gray-300 space-y-1">
                  <div>GOOGLE_GENERATIVE_AI_API_KEY=your_key</div>
                  <div>MONGODB_URI=your_mongodb_uri</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-neutral-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-400 mb-2">Step 2: Deploy Command</h3>
                <p className="text-xs text-gray-400 mb-3">
                  Run this command in your project directory:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-neutral-900 rounded p-3 font-mono text-xs text-gray-300">
                    npx vercel --prod
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('npx vercel --prod');
                      setCopiedCommand(true);
                      setTimeout(() => setCopiedCommand(false), 2000);
                      toast.success('Command copied!');
                    }}
                    className="p-2 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
                  >
                    {copiedCommand ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="text-gray-400" />}
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-neutral-800 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-purple-400 mb-2">Step 3: Get API Key</h3>
                <p className="text-xs text-gray-400 mb-3">
                  Get your free Gemini API key from Google AI Studio:
                </p>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <ExternalLink size={14} />
                  Open Google AI Studio
                </a>
              </div>

              {/* Quick Deploy */}
              <div className="pt-4 border-t border-neutral-700">
                <a
                  href="https://vercel.com/new/clone?repository-url=https://github.com/your-repo/ai-workflow-builder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white">
                    <ExternalLink size={16} className="mr-2" />
                    Deploy with Vercel
                  </Button>
                </a>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Or push to GitHub and import to Vercel
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

