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
    // 3 Image Nodes (Product Photos)
    {
      id: 'img-1',
      type: 'imageNode',
      position: { x: 50, y: 150 },
      data: {
        label: 'Product Photo 1',
        imageUrl: null,
      },
    },
    {
      id: 'img-2',
      type: 'imageNode',
      position: { x: 50, y: 320 },
      data: {
        label: 'Product Photo 2',
        imageUrl: null,
      },
    },
    {
      id: 'img-3',
      type: 'imageNode',
      position: { x: 50, y: 490 },
      data: {
        label: 'Product Photo 3',
        imageUrl: null,
      },
    },
    // System Prompt Text Node
    {
      id: 'txt-system',
      type: 'textNode',
      position: { x: 350, y: 50 },
      data: {
        label: 'System Prompt',
        text: 'You are an expert e-commerce copywriter. Analyze the product images and details provided to create compelling marketing content.',
      },
    },
    // User Message Text Node (Product Name & Specs)
    {
      id: 'txt-user',
      type: 'textNode',
      position: { x: 350, y: 550 },
      data: {
        label: 'Product Name & Specs',
        text: 'Product Name: Premium Noise Cancelling Headphones\nSpecs: 30h battery, Bluetooth 5.0, USB-C charging, Active Noise Cancellation',
      },
    },
    // Central LLM Node (Analyze Product)
    {
      id: 'llm-analyze',
      type: 'llmNode',
      position: { x: 650, y: 280 },
      data: {
        label: 'Analyze Product',
        model: 'gemini-1.5-flash',
        systemPrompt: '',
        userMessage: '',
        images: [],
        response: '',
      },
    },
    // 3 Output LLM Nodes
    {
      id: 'llm-amazon',
      type: 'llmNode',
      position: { x: 1000, y: 50 },
      data: {
        label: 'Write Amazon Listing',
        model: 'gemini-1.5-flash',
        systemPrompt: '',
        userMessage: '',
        images: [],
        response: '',
      },
    },
    {
      id: 'llm-insta',
      type: 'llmNode',
      position: { x: 1000, y: 300 },
      data: {
        label: 'Write Instagram Caption',
        model: 'gemini-1.5-flash',
        systemPrompt: '',
        userMessage: '',
        images: [],
        response: '',
      },
    },
    {
      id: 'llm-seo',
      type: 'llmNode',
      position: { x: 1000, y: 550 },
      data: {
        label: 'Write SEO Meta Description',
        model: 'gemini-1.5-flash',
        systemPrompt: '',
        userMessage: '',
        images: [],
        response: '',
      },
    },
    // 3 Output Text Nodes
    {
      id: 'txt-output-amazon',
      type: 'textNode',
      position: { x: 1350, y: 50 },
      data: {
        label: 'Amazon Output',
        text: '',
      },
    },
    {
      id: 'txt-output-insta',
      type: 'textNode',
      position: { x: 1350, y: 300 },
      data: {
        label: 'Instagram Output',
        text: '',
      },
    },
    {
      id: 'txt-output-seo',
      type: 'textNode',
      position: { x: 1350, y: 550 },
      data: {
        label: 'SEO Output',
        text: '',
      },
    },
  ],
  edges: [
    // Connect all 3 Images to central Analyze LLM
    {
      id: 'edge-img1-analyze',
      source: 'img-1',
      target: 'llm-analyze',
      sourceHandle: 'output',
      targetHandle: 'images',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-img2-analyze',
      source: 'img-2',
      target: 'llm-analyze',
      sourceHandle: 'output',
      targetHandle: 'images',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-img3-analyze',
      source: 'img-3',
      target: 'llm-analyze',
      sourceHandle: 'output',
      targetHandle: 'images',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    // Connect System Prompt to Analyze LLM
    {
      id: 'edge-system-analyze',
      source: 'txt-system',
      target: 'llm-analyze',
      sourceHandle: 'output',
      targetHandle: 'system',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    // Connect User Message to Analyze LLM
    {
      id: 'edge-user-analyze',
      source: 'txt-user',
      target: 'llm-analyze',
      sourceHandle: 'output',
      targetHandle: 'user',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    // Connect Analyze output to all 3 content LLMs (as user message)
    {
      id: 'edge-analyze-amazon',
      source: 'llm-analyze',
      target: 'llm-amazon',
      sourceHandle: 'response',
      targetHandle: 'user',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-analyze-insta',
      source: 'llm-analyze',
      target: 'llm-insta',
      sourceHandle: 'response',
      targetHandle: 'user',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-analyze-seo',
      source: 'llm-analyze',
      target: 'llm-seo',
      sourceHandle: 'response',
      targetHandle: 'user',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    // Connect System Prompt to all 3 content LLMs
    {
      id: 'edge-system-amazon',
      source: 'txt-system',
      target: 'llm-amazon',
      sourceHandle: 'output',
      targetHandle: 'system',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-system-insta',
      source: 'txt-system',
      target: 'llm-insta',
      sourceHandle: 'output',
      targetHandle: 'system',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-system-seo',
      source: 'txt-system',
      target: 'llm-seo',
      sourceHandle: 'output',
      targetHandle: 'system',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
  ],
};

// Export all templates in an array for easy iteration
export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  PRODUCT_LISTING_TEMPLATE,
];

