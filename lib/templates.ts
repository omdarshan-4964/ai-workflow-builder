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
      id: 'img-1',
      type: 'imageNode',
      position: { x: 50, y: 300 },
      data: {
        label: 'Product Image',
        imageUrl: null,
      },
    },
    {
      id: 'txt-system',
      type: 'textNode',
      position: { x: 50, y: 50 },
      data: {
        label: 'System Prompt',
        text: 'You are an expert e-commerce copywriter. Analyze the product image and details provided.',
      },
    },
    {
      id: 'txt-user',
      type: 'textNode',
      position: { x: 50, y: 550 },
      data: {
        label: 'User Message',
        text: 'Product Name: Premium Noise Cancelling Headphones\nSpecs: 30h battery, Bluetooth 5.0, USB-C',
      },
    },
    {
      id: 'llm-amazon',
      type: 'llmNode',
      position: { x: 600, y: 50 },
      data: {
        label: 'Amazon Listing',
        model: 'gemini-1.5-flash',
        systemPrompt: 'Write a professional Amazon Product Listing with 5 bullet points.',
        userMessage: '',
        images: [],
        response: '',
      },
    },
    {
      id: 'llm-insta',
      type: 'llmNode',
      position: { x: 600, y: 300 },
      data: {
        label: 'Instagram Caption',
        model: 'gemini-1.5-flash',
        systemPrompt: 'Write a catchy Instagram caption with hashtags.',
        userMessage: '',
        images: [],
        response: '',
      },
    },
    {
      id: 'llm-seo',
      type: 'llmNode',
      position: { x: 600, y: 550 },
      data: {
        label: 'SEO Meta Description',
        model: 'gemini-1.5-flash',
        systemPrompt: 'Write an SEO-optimized meta description (max 160 chars).',
        userMessage: '',
        images: [],
        response: '',
      },
    },
  ],
  edges: [
    // Connect System Prompt to all 3 LLMs
    {
      id: 'edge-system-amazon',
      source: 'txt-system',
      target: 'llm-amazon',
      sourceHandle: null,
      targetHandle: 'system',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-system-insta',
      source: 'txt-system',
      target: 'llm-insta',
      sourceHandle: null,
      targetHandle: 'system',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-system-seo',
      source: 'txt-system',
      target: 'llm-seo',
      sourceHandle: null,
      targetHandle: 'system',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    // Connect User Data to all 3 LLMs
    {
      id: 'edge-user-amazon',
      source: 'txt-user',
      target: 'llm-amazon',
      sourceHandle: null,
      targetHandle: 'user',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-user-insta',
      source: 'txt-user',
      target: 'llm-insta',
      sourceHandle: null,
      targetHandle: 'user',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-user-seo',
      source: 'txt-user',
      target: 'llm-seo',
      sourceHandle: null,
      targetHandle: 'user',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    // Connect Image to all 3 LLMs
    {
      id: 'edge-img-amazon',
      source: 'img-1',
      target: 'llm-amazon',
      sourceHandle: null,
      targetHandle: 'images',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-img-insta',
      source: 'img-1',
      target: 'llm-insta',
      sourceHandle: null,
      targetHandle: 'images',
      type: 'default',
      animated: true,
      style: { stroke: '#7C3AED', strokeWidth: 2 },
    },
    {
      id: 'edge-img-seo',
      source: 'img-1',
      target: 'llm-seo',
      sourceHandle: null,
      targetHandle: 'images',
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

