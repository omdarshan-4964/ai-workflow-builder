'use client';

import { Type, Image, Sparkles, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WorkflowTemplate } from '@/lib/templates';

interface NodeButtonProps {
  icon: React.ReactNode;
  label: string;
  nodeType: 'text' | 'image' | 'llm';
}

interface SidebarProps {
  onLoadTemplate?: (template: WorkflowTemplate) => void;
}

const NodeButton = ({ icon, label, nodeType }: NodeButtonProps) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-3 h-12 bg-white hover:bg-weavy-background border-weavy-border text-foreground font-normal"
      draggable
      onDragStart={onDragStart}
    >
      <div className="flex items-center justify-center w-5 h-5 text-weavy-primary">
        {icon}
      </div>
      <span className="text-sm">{label}</span>
    </Button>
  );
};

export default function Sidebar({ onLoadTemplate }: SidebarProps) {
  return (
    <aside className="w-[280px] h-screen bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-foreground">Workflow Builder</h2>
        <p className="text-xs text-gray-500 mt-1">Drag nodes to canvas</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Templates Section */}
        {onLoadTemplate && (
          <>
            <div className="space-y-3">
              <div className="px-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Templates
                </h3>
              </div>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 border-weavy-primary text-foreground font-normal"
                  onClick={() => {
                    // Import the template dynamically to avoid circular dependencies
                    import('@/lib/templates').then(({ PRODUCT_LISTING_TEMPLATE }) => {
                      onLoadTemplate(PRODUCT_LISTING_TEMPLATE);
                    });
                  }}
                >
                  <div className="flex items-center justify-center w-5 h-5 text-weavy-primary">
                    <Package size={18} />
                  </div>
                  <span className="text-sm">📦 Product Generator</span>
                </Button>
              </div>
            </div>

            <Separator className="bg-gray-200" />
          </>
        )}

        {/* Core Nodes Section */}
        <div className="space-y-3">
          <div className="px-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Core Nodes
            </h3>
          </div>
          <div className="space-y-2">
            <NodeButton
              icon={<Type size={18} />}
              label="Text Node"
              nodeType="text"
            />
            <NodeButton
              icon={<Image size={18} />}
              label="Image Node"
              nodeType="image"
            />
          </div>
        </div>

        <Separator className="bg-gray-200" />

        {/* AI Models Section */}
        <div className="space-y-3">
          <div className="px-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              AI Models
            </h3>
          </div>
          <div className="space-y-2">
            <NodeButton
              icon={<Sparkles size={18} />}
              label="Run Any LLM"
              nodeType="llm"
            />
          </div>
        </div>

        {/* Quick Tips Card */}
        <Card className="p-4 bg-weavy-background border-weavy-border">
          <h4 className="text-xs font-semibold text-foreground mb-2">Quick Tips</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Drag nodes to canvas</li>
            <li>• Connect output to input</li>
            <li>• Delete with Backspace</li>
          </ul>
        </Card>
      </div>
    </aside>
  );
}

