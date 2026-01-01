'use client';

import { useCallback, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Type } from 'lucide-react';
import BaseNode from './BaseNode';
import { Textarea } from '@/components/ui/textarea';

interface TextNodeData extends Record<string, unknown> {
  label?: string;
  text?: string;
  onChange?: (nodeId: string, newData: Record<string, unknown>) => void;
}

export default function TextNode({ data, selected, id }: NodeProps<Node<TextNodeData>>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const autoResize = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, []);

  useEffect(() => {
    autoResize();
  }, [data.text, autoResize]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    // Update node data - this will be handled by React Flow's state management
    if (data.onChange) {
      data.onChange(id, { text: newText });
    }
    autoResize();
  };

  return (
    <BaseNode title="Text Node" icon={Type} selected={selected}>
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-300">Text Content</label>
        <Textarea
          ref={textareaRef}
          value={data.text || ''}
          onChange={handleTextChange}
          placeholder="Enter text content..."
          className="nodrag min-h-[80px] resize-none bg-neutral-950 text-white border-neutral-800 placeholder:text-gray-500 focus:border-neutral-700"
          rows={3}
        />
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            {data.text?.length || 0} characters
          </span>
        </div>
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 bg-weavy-primary border-2 border-neutral-900"
        style={{ right: -6 }}
      />
    </BaseNode>
  );
}

