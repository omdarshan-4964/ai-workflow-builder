import { Node, Edge } from '@xyflow/react';

export interface WorkflowTemplate {
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
}

export const PRODUCT_LISTING_TEMPLATE: WorkflowTemplate = {
  name: 'Product Listing Generator',
  description: 'Generate compelling Amazon product listings from images',
  nodes: [
    {
      id: 'node_1',
      type: 'imageNode',
      position: { x: 100, y: 100 },
      data: {
        label: 'Product Image',
        imageUrl: null,
      },
    },
    {
      id: 'node_2',
      type: 'textNode',
      position: { x: 100, y: 300 },
      data: {
        label: 'Role',
        text: 'You are an expert Amazon copywriter. Write a compelling product title and 5 bullet points for the image provided.',
      },
    },
    {
      id: 'node_3',
      type: 'llmNode',
      position: { x: 500, y: 200 },
      data: {
        label: 'Generator',
        model: 'gemini-2.5-flash',
        systemPrompt: '',
        userMessage: '',
        images: [],
        response: '',
      },
    },
  ],
  edges: [
    {
      id: 'edge_1',
      source: 'node_1',
      target: 'node_3',
      sourceHandle: null,
      targetHandle: 'images',
      type: 'default',
    },
    {
      id: 'edge_2',
      source: 'node_2',
      target: 'node_3',
      sourceHandle: null,
      targetHandle: 'system',
      type: 'default',
    },
  ],
};

// Export all templates in an array for easy iteration
export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  PRODUCT_LISTING_TEMPLATE,
];

