'use client';

import { useCallback, useState, useMemo } from 'react';
import { 
  ReactFlow,
  Background, 
  BackgroundVariant, 
  Controls, 
  MiniMap,
  Node, 
  Edge, 
  Connection, 
  addEdge, 
  useNodesState, 
  useEdgesState, 
  OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from '@/components/workflow/Sidebar';
import WorkflowLayout from '@/components/workflow/WorkflowLayout';
import TextNode from '@/components/workflow/nodes/TextNode';
import ImageNode from '@/components/workflow/nodes/ImageNode';
import LLMNode from '@/components/workflow/nodes/LLMNode';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

export default function EditorPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');

  // Register custom node types
  const nodeTypes = useMemo(
    () => ({
      textNode: TextNode,
      imageNode: ImageNode,
      llmNode: LLMNode,
    }),
    []
  );

  // Handle node data changes
  const handleNodeDataChange = useCallback(
    (nodeId: string, newData: Record<string, unknown>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        )
      );
    },
    [setNodes]
  );

  const onConnect: OnConnect = useCallback(
    (connection: Connection) => {
      const edge = {
        ...connection,
        animated: true,
        style: { stroke: '#7C3AED', strokeWidth: 2 },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      // Map sidebar node types to React Flow node types
      const nodeTypeMap: Record<string, string> = {
        text: 'textNode',
        image: 'imageNode',
        llm: 'llmNode',
      };

      const newNode: Node = {
        id: getNodeId(),
        type: nodeTypeMap[nodeType] || nodeType,
        position,
        data: {
          label: `${nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} Node`,
          text: '',
          onChange: handleNodeDataChange,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, handleNodeDataChange]
  );

  return (
    <WorkflowLayout>
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Canvas Area */}
        <div className="flex-1 flex flex-col relative bg-weavy-background">
          {/* Floating Header */}
          <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-0 text-foreground"
                placeholder="Untitled Workflow"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                Save
              </Button>
              <Button size="sm" className="bg-weavy-primary hover:bg-weavy-purple-dark">
                <Rocket size={16} className="mr-2" />
                Deploy
              </Button>
            </div>
          </div>

          {/* React Flow Canvas */}
          <div
            className="flex-1 mt-[73px]"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes as any}
              fitView
              attributionPosition="bottom-left"
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={20}
                size={1}
                color="#E2E8F0"
                className="bg-weavy-background"
              />
              <Controls
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
                showInteractive={false}
              />
              <MiniMap
                className="bg-white border border-gray-200 rounded-lg shadow-sm"
                nodeColor="#7C3AED"
                maskColor="rgba(0, 0, 0, 0.1)"
                position="bottom-right"
              />
            </ReactFlow>
          </div>
        </div>
      </div>
    </WorkflowLayout>
  );
}

