'use client';

import { useCallback, useState, useMemo } from 'react';
import { 
  ReactFlow,
  ReactFlowProvider,
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
  useReactFlow,
  OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { toast } from 'sonner';

import Sidebar from '@/components/workflow/Sidebar';
import TextNode from '@/components/workflow/nodes/TextNode';
import ImageNode from '@/components/workflow/nodes/ImageNode';
import LLMNode from '@/components/workflow/nodes/LLMNode';
import { Button } from '@/components/ui/button';
import { Rocket } from 'lucide-react';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

// EditorCanvas - Contains all the editor logic and state
function EditorCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  
  // Get live node and edge data from React Flow
  const { getNodes, getEdges } = useReactFlow();

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

  // Graph Execution Engine - Run a specific node
  const runNode = useCallback(
    (targetNodeId: string) => {
      // Get live nodes and edges (prevents stale closure)
      const nodes = getNodes();
      const edges = getEdges();

      // Find the target node (LLM node)
      const targetNode = nodes.find((n) => n.id === targetNodeId);
      if (!targetNode) {
        toast.error('Node not found');
        return;
      }

      console.log('🚀 Running node:', targetNodeId, targetNode);

      // Find all edges connected to this node's input handles
      const incomingEdges = edges.filter((edge) => edge.target === targetNodeId);
      
      console.log('📥 Incoming edges:', incomingEdges);

      // Build the payload by traversing back to source nodes
      const payload: Record<string, any> = {
        system: null,
        user: null,
        images: [],
      };

      incomingEdges.forEach((edge) => {
        // Find the source node
        const sourceNode = nodes.find((n) => n.id === edge.source);
        if (!sourceNode) return;

        console.log('🔍 Source node:', sourceNode.id, sourceNode.data);

        // Map the data based on the target handle
        if (edge.targetHandle === 'system') {
          // System prompt from Text Node
          payload.system = sourceNode.data.text || '';
        } else if (edge.targetHandle === 'user') {
          // User message from Text Node
          payload.user = sourceNode.data.text || '';
        } else if (edge.targetHandle === 'images') {
          // Images from Image Node
          if (sourceNode.data.imageUrl) {
            payload.images.push(sourceNode.data.imageUrl);
          }
        }
      });

      console.log('📦 Executing with payload:', payload);

      // Show toast notification with the data
      const payloadSummary = [];
      if (payload.system) payloadSummary.push(`System: "${payload.system.substring(0, 30)}..."`);
      if (payload.user) payloadSummary.push(`User: "${payload.user.substring(0, 30)}..."`);
      if (payload.images.length > 0) payloadSummary.push(`Images: ${payload.images.length}`);

      if (payloadSummary.length === 0) {
        toast.warning('No inputs connected to LLM node', {
          description: 'Connect Text or Image nodes to the LLM inputs',
        });
      } else {
        toast.success('Workflow Executed!', {
          description: payloadSummary.join(' | '),
        });
      }

      // Update the target node with execution status
      handleNodeDataChange(targetNodeId, {
        isRunning: false,
        response: `Received:\n${JSON.stringify(payload, null, 2)}`,
      });
    },
    [getNodes, getEdges, handleNodeDataChange]
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
          onRun: runNode, // Pass the run function to nodes
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes, handleNodeDataChange, runNode]
  );

  return (
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
  );
}

// EditorPage - Wrapper component with ReactFlowProvider
export default function EditorPage() {
  return (
    <ReactFlowProvider>
      <EditorCanvas />
    </ReactFlowProvider>
  );
}

