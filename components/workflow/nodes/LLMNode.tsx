'use client';

import { useState, useCallback } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Sparkles, Play } from 'lucide-react';
import BaseNode from './BaseNode';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LLMNodeData extends Record<string, unknown> {
  label?: string;
  model?: string;
  systemPrompt?: string;
  userMessage?: string;
  images?: string[];
  response?: string;
  isRunning?: boolean;
  onChange?: (nodeId: string, newData: Record<string, unknown>) => void;
  onRun?: (nodeId: string) => void;
}

export default function LLMNode({ data, selected, id }: NodeProps<Node<LLMNodeData>>) {
  const [model, setModel] = useState(data.model || 'gemini-1.5-flash');
  const [isRunning, setIsRunning] = useState(false);

  const handleModelChange = useCallback(
    (value: string) => {
      setModel(value);
      if (data.onChange) {
        data.onChange(id, { model: value });
      }
    },
    [data, id]
  );

  const handleRunWorkflow = useCallback(async () => {
    if (!data.onRun) {
      console.error('onRun function not provided');
      return;
    }

    setIsRunning(true);
    
    // Update node state to show running
    if (data.onChange) {
      data.onChange(id, { isRunning: true });
    }

    // Call the graph execution engine
    data.onRun(id);
    
    // Reset running state after a short delay
    setTimeout(() => {
      setIsRunning(false);
    }, 500);
  }, [data, id]);

  return (
    <BaseNode title="Run Any LLM" icon={Sparkles} selected={selected}>
      <div className="space-y-4">
        {/* Model Selector */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-300">AI Model</label>
          <Select value={model} onValueChange={handleModelChange}>
            <SelectTrigger className="w-full bg-neutral-950 border-neutral-800 text-white nodrag">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 border-neutral-800">
              <SelectItem value="gemini-1.5-flash" className="text-white focus:bg-neutral-800">Gemini 1.5 Flash</SelectItem>
              <SelectItem value="gemini-1.5-pro" className="text-white focus:bg-neutral-800">Gemini 1.5 Pro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Inputs Section */}
        <div className="space-y-3">
          <div className="text-xs font-medium text-gray-300 mb-2">Inputs</div>
          
          {/* System Prompt Input */}
          <div className="flex items-center gap-2 relative">
            <Handle
              type="target"
              position={Position.Left}
              id="system"
              className="w-3 h-3 bg-blue-500 border-2 border-neutral-900"
              style={{ left: -6 }}
            />
            <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2">
              <span className="text-xs text-gray-400">System Prompt</span>
            </div>
          </div>

          {/* User Message Input */}
          <div className="flex items-center gap-2 relative">
            <Handle
              type="target"
              position={Position.Left}
              id="user"
              className="w-3 h-3 bg-green-500 border-2 border-neutral-900"
              style={{ left: -6 }}
            />
            <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2">
              <span className="text-xs text-gray-400">User Message</span>
            </div>
          </div>

          {/* Images Input */}
          <div className="flex items-center gap-2 relative">
            <Handle
              type="target"
              position={Position.Left}
              id="images"
              className="w-3 h-3 bg-purple-500 border-2 border-neutral-900"
              style={{ left: -6 }}
            />
            <div className="flex-1 bg-neutral-950 border border-neutral-800 rounded-md px-3 py-2">
              <span className="text-xs text-gray-400">Images (optional)</span>
            </div>
          </div>
        </div>

        {/* Run Button */}
        <Button
          onClick={handleRunWorkflow}
          disabled={isRunning}
          className="w-full bg-weavy-primary hover:bg-weavy-purple-dark text-white"
        >
          <Play size={16} className="mr-2" />
          {isRunning ? 'Running...' : 'Run Workflow'}
        </Button>

        {/* Response Preview */}
        {data.response && (
          <div className="mt-3 p-3 bg-neutral-950 rounded-md border border-neutral-800">
            <div className="text-xs font-medium text-gray-300 mb-1">Response</div>
            <div className="text-xs text-gray-200 line-clamp-3">{data.response}</div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="response"
        className="w-3 h-3 bg-weavy-primary border-2 border-neutral-900"
        style={{ right: -6 }}
      />
    </BaseNode>
  );
}

