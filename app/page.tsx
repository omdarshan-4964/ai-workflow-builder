'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Users, Grid3x3, Plus, Folder, Sparkles, Image as ImageIcon, Video, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface SavedWorkflow {
  _id: string;
  name: string;
  nodes: unknown[];
  edges: unknown[];
  createdAt: string;
  updatedAt?: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  route: string;
}

// Dummy workflow library templates
const workflowLibrary: WorkflowTemplate[] = [
  {
    id: 'welcome',
    name: 'Weavy Welcome',
    description: 'Get started with Weavy',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'from-purple-500 to-pink-500',
    route: '/editor',
  },
  {
    id: 'image-to-video',
    name: 'Image to Video',
    description: 'Transform images into video descriptions',
    icon: <Video className="w-6 h-6" />,
    color: 'from-blue-500 to-cyan-500',
    route: '/editor',
  },
  {
    id: 'product-listing',
    name: 'Product Listing',
    description: 'Generate product descriptions',
    icon: <FileCode className="w-6 h-6" />,
    color: 'from-green-500 to-emerald-500',
    route: '/editor',
  },
  {
    id: 'image-analysis',
    name: 'Image Analysis',
    description: 'Analyze and describe images',
    icon: <ImageIcon className="w-6 h-6" />,
    color: 'from-orange-500 to-red-500',
    route: '/editor',
  },
];

export default function Dashboard() {
  const router = useRouter();
  const [workflows, setWorkflows] = useState<SavedWorkflow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await fetch('/api/workflows');
        const data = await response.json();

        if (data.success) {
          setWorkflows(data.data || []);
        } else {
          console.error('Failed to fetch workflows:', data.error);
        }
      } catch (error) {
        console.error('Error fetching workflows:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkflows();
  }, []);

  const handleCreateNewFile = () => {
    router.push('/editor');
  };

  const handleWorkflowClick = (workflowId: string) => {
    router.push(`/editor?load=${workflowId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[250px] bg-[#121212] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-semibold">Weavy</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-800 text-left transition-colors">
            <FileText className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">My Files</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-800 text-left transition-colors">
            <Users className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">Shared with me</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-800 text-left transition-colors">
            <Grid3x3 className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium">Apps</span>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-8 py-6 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">User's Workspace</h2>
          <Button
            onClick={handleCreateNewFile}
            className="bg-[#DFFF00] hover:bg-[#DFFF00]/90 text-black font-medium px-6 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New File
          </Button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {/* Workflow Library Section */}
          <section className="mb-12">
            <h3 className="text-lg font-semibold mb-4">Workflow Library</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {workflowLibrary.map((template) => (
                <Card
                  key={template.id}
                  className="min-w-[200px] p-6 bg-gray-900 border-gray-800 hover:border-gray-700 cursor-pointer transition-colors"
                  onClick={() => router.push(template.route)}
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center text-white mb-4`}>
                    {template.icon}
                  </div>
                  <h4 className="text-white font-medium mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-400">{template.description}</p>
                </Card>
              ))}
            </div>
          </section>

          {/* My Files Section */}
          <section>
            <h3 className="text-lg font-semibold mb-4">My Files</h3>
            {isLoading ? (
              <div className="flex items-center justify-center py-12 text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
                <span className="ml-3">Loading workflows...</span>
              </div>
            ) : workflows.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No workflows yet</p>
                <p className="text-sm">Create your first workflow to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {workflows.map((workflow) => (
                  <Card
                    key={workflow._id}
                    className="p-4 bg-gray-900 border-gray-800 hover:border-gray-700 cursor-pointer transition-colors group"
                    onClick={() => handleWorkflowClick(workflow._id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <FileCode className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-xs text-gray-500 group-hover:text-gray-400">
                        {workflow.nodes.length} nodes
                      </span>
                    </div>
                    <h4 className="text-white font-medium mb-1 truncate">{workflow.name}</h4>
                    <p className="text-xs text-gray-500">
                      {formatDate(workflow.createdAt)}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
