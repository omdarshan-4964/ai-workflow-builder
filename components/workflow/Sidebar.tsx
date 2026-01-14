'use client';

import { useState, useEffect, useMemo } from 'react';
import { Type, Image, Sparkles, Package, FolderOpen, Loader2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { WorkflowTemplate } from '@/lib/templates';

interface SavedWorkflow {
  _id: string;
  name: string;
  nodes: any[];
  edges: any[];
  createdAt: string;
  updatedAt?: string;
}

interface NodeButtonProps {
  icon: React.ReactNode;
  label: string;
  nodeType: 'text' | 'image' | 'llm';
  collapsed?: boolean;
}

interface SidebarProps {
  onLoadTemplate?: (template: WorkflowTemplate) => void;
  onLoadWorkflow?: (workflow: SavedWorkflow) => void;
}

const NodeButton = ({ icon, label, nodeType, collapsed }: NodeButtonProps) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  if (collapsed) {
    return (
      <Button
        variant="outline"
        className="w-full justify-center h-12 bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-gray-200 font-normal"
        draggable
        onDragStart={onDragStart}
        title={label}
      >
        <div className="flex items-center justify-center w-5 h-5 text-weavy-primary">
          {icon}
        </div>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-3 h-12 bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-gray-200 font-normal"
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

export default function Sidebar({ onLoadTemplate, onLoadWorkflow }: SidebarProps) {
  const [savedWorkflows, setSavedWorkflows] = useState<SavedWorkflow[]>([]);
  const [isLoadingWorkflows, setIsLoadingWorkflows] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Fetch saved workflows on mount
  useEffect(() => {
    const fetchWorkflows = async () => {
      if (!onLoadWorkflow) return;

      setIsLoadingWorkflows(true);
      try {
        const response = await fetch('/api/workflows');
        const data = await response.json();

        if (data.success) {
          setSavedWorkflows(data.data || []);
          console.log(`✅ Loaded ${data.data?.length || 0} saved workflows`);
        } else {
          console.error('Failed to fetch workflows:', data.error);
        }
      } catch (error) {
        console.error('Error fetching workflows:', error);
      } finally {
        setIsLoadingWorkflows(false);
      }
    };

    fetchWorkflows();
  }, [onLoadWorkflow]);

  // Filter workflows based on search query
  const filteredWorkflows = useMemo(() => {
    if (!searchQuery.trim()) return savedWorkflows;
    const query = searchQuery.toLowerCase();
    return savedWorkflows.filter((workflow) =>
      workflow.name.toLowerCase().includes(query)
    );
  }, [savedWorkflows, searchQuery]);

  // Collapsed sidebar view
  if (isCollapsed) {
    return (
      <aside className="w-[72px] h-screen bg-neutral-900 border-r border-neutral-800 flex flex-col transition-all duration-300">
        {/* Collapse Toggle */}
        <div className="p-4 border-b border-neutral-800 flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(false)}
            className="text-gray-400 hover:text-white hover:bg-neutral-800 p-2"
            title="Expand Sidebar"
          >
            <ChevronRight size={18} />
          </Button>
        </div>

        {/* Collapsed Node Buttons */}
        <div className="flex-1 overflow-y-auto scrollbar-hide p-2 space-y-2">
          <NodeButton
            icon={<Type size={18} />}
            label="Text Node"
            nodeType="text"
            collapsed
          />
          <NodeButton
            icon={<Image size={18} />}
            label="Image Node"
            nodeType="image"
            collapsed
          />
          <NodeButton
            icon={<Sparkles size={18} />}
            label="Run Any LLM"
            nodeType="llm"
            collapsed
          />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-[280px] h-screen bg-neutral-900 border-r border-neutral-800 flex flex-col transition-all duration-300 max-md:absolute max-md:z-50 max-md:left-0 max-md:top-0">
      {/* Sidebar Header with Collapse Toggle */}
      <div className="p-4 md:p-6 border-b border-neutral-800">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-gray-200">Workflow Builder</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
            className="text-gray-400 hover:text-white hover:bg-neutral-800 p-2 hidden md:flex"
            title="Collapse Sidebar"
          >
            <ChevronLeft size={18} />
          </Button>
        </div>
        <p className="text-xs text-gray-500">Drag nodes to canvas</p>
      </div>

      {/* Search Box */}
      <div className="px-4 py-3 border-b border-neutral-800">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search workflows..."
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 pl-9 pr-3 text-sm text-gray-200 placeholder:text-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-6">
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
                  className="w-full justify-start gap-3 h-12 bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/30 hover:to-blue-600/30 border-purple-500/50 text-gray-200 font-normal"
                  onClick={() => {
                    // Import the template dynamically to avoid circular dependencies
                    import('@/lib/templates').then(({ PRODUCT_LISTING_TEMPLATE }) => {
                      onLoadTemplate(PRODUCT_LISTING_TEMPLATE);
                    });
                  }}
                >
                  <div className="flex items-center justify-center w-5 h-5 text-purple-400">
                    <Package size={18} />
                  </div>
                  <span className="text-sm">📦 Product Generator</span>
                </Button>
              </div>
            </div>

            <Separator className="bg-neutral-800" />
          </>
        )}

        {/* Saved Workflows Section */}
        {onLoadWorkflow && (
          <>
            <div className="space-y-3">
              <div className="px-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Saved Workflows
                </h3>
                {filteredWorkflows.length > 0 && (
                  <span className="text-xs text-gray-500">{filteredWorkflows.length}</span>
                )}
              </div>
              <div className="space-y-2">
                {isLoadingWorkflows ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 size={18} className="animate-spin text-gray-400" />
                  </div>
                ) : filteredWorkflows.length === 0 ? (
                  <div className="text-xs text-gray-400 text-center py-4">
                    {searchQuery ? 'No matching workflows' : 'No saved workflows yet'}
                  </div>
                ) : (
                  filteredWorkflows.map((workflow) => (
                    <Button
                      key={workflow._id}
                      variant="outline"
                      className="w-full justify-start gap-3 h-auto py-3 bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-gray-300 font-normal"
                      onClick={() => onLoadWorkflow(workflow)}
                    >
                      <div className="flex items-center justify-center w-5 h-5 text-weavy-primary flex-shrink-0">
                        <FolderOpen size={16} />
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <div className="text-sm font-medium truncate">{workflow.name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {workflow.nodes.length} nodes
                        </div>
                      </div>
                    </Button>
                  ))
                )}
              </div>
            </div>

            <Separator className="bg-neutral-800" />
          </>
        )}

        {/* Quick Access Section */}
        <div className="space-y-3">
          <div className="px-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Quick Access
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
            <NodeButton
              icon={<Sparkles size={18} />}
              label="Run Any LLM"
              nodeType="llm"
            />
          </div>
        </div>

        {/* Quick Tips Card */}
        <Card className="p-4 bg-neutral-800 border-neutral-700">
          <h4 className="text-xs font-semibold text-gray-200 mb-2">Quick Tips</h4>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Drag nodes to canvas</li>
            <li>• Connect output to input</li>
            <li>• Delete with Backspace</li>
            <li>• Ctrl+Z to undo</li>
          </ul>
        </Card>
      </div>
    </aside>
  );
}

