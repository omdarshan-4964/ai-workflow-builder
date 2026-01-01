'use client';

import { useCallback, useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
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
import Header, { ExportWorkflowData } from '@/components/workflow/Header';
import TextNode from '@/components/workflow/nodes/TextNode';
import ImageNode from '@/components/workflow/nodes/ImageNode';
import LLMNode from '@/components/workflow/nodes/LLMNode';
import { WorkflowTemplate } from '@/lib/templates';

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let nodeId = 0;
const getNodeId = () => `node_${nodeId++}`;

// EditorCanvas - Contains all the editor logic and state
function EditorCanvas() {
  const searchParams = useSearchParams();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [isLoadingWorkflow, setIsLoadingWorkflow] = useState(false);
  
  // Get live node and edge data from React Flow
  const { getNodes, getEdges, fitView } = useReactFlow();

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

  // Helper: Convert Blob URL to Base64
  const blobToBase64 = async (blobUrl: string): Promise<string> => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting blob to base64:', error);
      throw error;
    }
  };

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

      // Validate inputs
      const payloadSummary = [];
      if (payload.system) payloadSummary.push(`System: "${payload.system.substring(0, 30)}..."`);
      if (payload.user) payloadSummary.push(`User: "${payload.user.substring(0, 30)}..."`);
      if (payload.images.length > 0) payloadSummary.push(`Images: ${payload.images.length}`);

      if (payloadSummary.length === 0) {
        toast.warning('No inputs connected to LLM node', {
          description: 'Connect Text or Image nodes to the LLM inputs',
        });
        return;
      }

      // Set loading state
      handleNodeDataChange(targetNodeId, {
        isRunning: true,
        response: 'Generating response...',
      });

      // Execute API call asynchronously
      (async () => {
        try {
          // Convert blob URLs to base64 if images exist
          const base64Images: string[] = [];
          if (payload.images.length > 0) {
            toast.info('Processing images...', { duration: 2000 });
            for (const imageUrl of payload.images) {
              if (imageUrl.startsWith('blob:')) {
                const base64 = await blobToBase64(imageUrl);
                base64Images.push(base64);
              } else {
                base64Images.push(imageUrl);
              }
            }
          }

          // Get model from target node data
          const model = targetNode.data.model || 'gemini-1.5-flash';

          // Call Gemini API
          toast.info('Calling Gemini API...', { duration: 2000 });
          const response = await fetch('/api/llm', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              system: payload.system,
              user: payload.user,
              images: base64Images,
              model,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'API request failed');
          }

          const data = await response.json();
          
          // Update node with response
          handleNodeDataChange(targetNodeId, {
            isRunning: false,
            response: data.response,
          });

          // Show success toast
          toast.success('Workflow Executed!', {
            description: `Generated ${data.response.length} characters`,
          });

          console.log('✅ Gemini Response:', data.response);
        } catch (error: any) {
          console.error('❌ Execution error:', error);
          
          // Update node with error
          handleNodeDataChange(targetNodeId, {
            isRunning: false,
            response: `Error: ${error.message}`,
          });

          // Show error toast
          toast.error('Execution Failed', {
            description: error.message || 'Unknown error occurred',
          });
        }
      })();
    },
    [getNodes, getEdges, handleNodeDataChange, blobToBase64]
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

  // Load a pre-built workflow template
  const loadTemplate = useCallback(
    (template: WorkflowTemplate) => {
      // Enhance template nodes with required callbacks
      const enhancedNodes = template.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onChange: handleNodeDataChange,
          onRun: runNode,
        },
      }));

      // Reset canvas with template data
      setNodes(enhancedNodes);
      setEdges(template.edges);
      setWorkflowName(template.name);

      // Update nodeId counter to avoid conflicts
      const maxId = template.nodes.reduce((max, node) => {
        const idNum = parseInt(node.id.replace('node_', ''), 10);
        return idNum > max ? idNum : max;
      }, 0);
      nodeId = maxId + 1;

      // Show success notification
      toast.success('Template Loaded!', {
        description: `${template.name} is ready to use`,
      });

      console.log('📦 Loaded template:', template.name);
    },
    [setNodes, setEdges, handleNodeDataChange, runNode]
  );

  // Save workflow to database
  const handleSave = useCallback(async () => {
    try {
      const nodes = getNodes();
      const edges = getEdges();

      const response = await fetch('/api/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: workflowName || 'Untitled Workflow',
          nodes,
          edges,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save workflow');
      }

      toast.success('Workflow Saved!', {
        description: `"${data.data.name}" has been saved successfully`,
      });

      console.log('💾 Workflow saved:', data.data._id);
    } catch (error: any) {
      console.error('❌ Error saving workflow:', error);
      toast.error('Failed to Save Workflow', {
        description: error.message || 'An error occurred while saving',
      });
      throw error; // Re-throw to let Header component handle loading state
    }
  }, [workflowName, getNodes, getEdges]);

  // Load a saved workflow from database
  const handleLoadWorkflow = useCallback(
    (workflow: { _id: string; name: string; nodes: Node[]; edges: Edge[] }) => {
      // Enhance workflow nodes with required callbacks
      const enhancedNodes = workflow.nodes.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onChange: handleNodeDataChange,
          onRun: runNode,
        },
      }));

      // Reset canvas with workflow data
      setNodes(enhancedNodes);
      setEdges(workflow.edges);
      setWorkflowName(workflow.name);

      // Update nodeId counter to avoid conflicts
      const maxId = workflow.nodes.reduce((max, node) => {
        const idNum = parseInt(node.id.replace('node_', ''), 10);
        return isNaN(idNum) ? max : idNum > max ? idNum : max;
      }, nodeId);
      nodeId = maxId + 1;

      // Show success notification
      toast.success('Workflow Loaded!', {
        description: `"${workflow.name}" is ready to edit`,
      });

      console.log('📂 Loaded workflow:', workflow._id);
    },
    [setNodes, setEdges, handleNodeDataChange, runNode]
  );

  // Export workflow to JSON file
  const handleExportWorkflow = useCallback(() => {
    try {
      const nodes = getNodes();
      const edges = getEdges();

      const exportData: ExportWorkflowData = {
        name: workflowName || 'Untitled Workflow',
        nodes,
        edges,
        version: '1.0',
      };

      // Create JSON string
      const jsonString = JSON.stringify(exportData, null, 2);

      // Create blob and download
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exportData.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Workflow Exported!', {
        description: `"${exportData.name}" has been saved to your computer`,
      });

      console.log('📤 Workflow exported:', exportData.name);
    } catch (error: any) {
      console.error('❌ Error exporting workflow:', error);
      toast.error('Failed to Export Workflow', {
        description: error.message || 'An error occurred while exporting',
      });
    }
  }, [workflowName, getNodes, getEdges]);

  // Import workflow from JSON file
  const handleImportWorkflow = useCallback(
    (data: ExportWorkflowData) => {
      try {
        // Validate imported data
        if (!data.name || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
          throw new Error('Invalid workflow file format');
        }

        // Enhance workflow nodes with required callbacks
        const enhancedNodes = data.nodes.map((node: any) => ({
          ...node,
          data: {
            ...node.data,
            onChange: handleNodeDataChange,
            onRun: runNode,
          },
        }));

        // Reset canvas with imported workflow data
        setNodes(enhancedNodes);
        setEdges(data.edges as Edge[]);
        setWorkflowName(data.name);

        // Update nodeId counter to avoid conflicts
        const maxId = data.nodes.reduce((max: number, node: any) => {
          const idNum = parseInt(node.id?.replace('node_', '') || '0', 10);
          return isNaN(idNum) ? max : idNum > max ? idNum : max;
        }, nodeId);
        nodeId = maxId + 1;

        // Fit view to show all nodes after DOM updates
        setTimeout(() => {
          fitView({ padding: 0.2, duration: 800 });
        }, 100);

        // Show success notification
        toast.success('Workflow Imported Successfully!', {
          description: `"${data.name}" is ready to edit`,
        });

        console.log('📥 Workflow imported:', data.name);
      } catch (error: any) {
        console.error('❌ Error importing workflow:', error);
        toast.error('Failed to Import Workflow', {
          description: error.message || 'Invalid workflow file format',
        });
      }
    },
    [setNodes, setEdges, handleNodeDataChange, runNode, fitView]
  );

  // Load workflow from URL query params on mount
  useEffect(() => {
    const loadWorkflowId = searchParams.get('load');
    if (!loadWorkflowId || isLoadingWorkflow) return;

    setIsLoadingWorkflow(true);
    const fetchAndLoadWorkflow = async () => {
      try {
        const response = await fetch(`/api/workflows/${loadWorkflowId}`);
        const data = await response.json();

        if (data.success && data.data) {
          handleLoadWorkflow(data.data);
        } else {
          toast.error('Failed to Load Workflow', {
            description: data.error || 'Workflow not found',
          });
        }
      } catch (error: any) {
        console.error('Error loading workflow:', error);
        toast.error('Failed to Load Workflow', {
          description: error.message || 'An error occurred',
        });
      } finally {
        setIsLoadingWorkflow(false);
      }
    };

    fetchAndLoadWorkflow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar */}
      <Sidebar
        onLoadTemplate={loadTemplate}
        onLoadWorkflow={handleLoadWorkflow}
      />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col relative bg-neutral-950">
        {/* Floating Header */}
        <Header
          workflowName={workflowName}
          onWorkflowNameChange={setWorkflowName}
          onSave={handleSave}
          onExport={handleExportWorkflow}
          onImport={handleImportWorkflow}
        />

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
              color="#333"
            />
            <Controls
              className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-sm"
              showInteractive={false}
            />
            <MiniMap
              className="border border-neutral-800 rounded-lg"
              nodeColor="#555"
              maskColor="rgba(0, 0, 0, 0.8)"
              style={{ backgroundColor: '#171717' }}
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
      <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
        <EditorCanvas />
      </Suspense>
    </ReactFlowProvider>
  );
}

