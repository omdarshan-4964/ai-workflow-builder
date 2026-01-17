# AI Workflow Builder - Agentic Orchestration Engine

**A scalable, node-based AI orchestration platform powered by Google Gemini 1.5 and React Flow.**

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-9.1.1-47a248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285f4?style=for-the-badge&logo=google)](https://ai.google.dev/)

---

## ✨ Key Features

### 🎨 Pixel-Perfect Dark UI
Exact clone of Weavy's sophisticated dark aesthetic with precise typography, spacing, and color matching. Built with the **Inter** font family, `#0f0f0f` dark backgrounds, and meticulously crafted component styling that mirrors the original interface pixel-for-pixel.

### ⚡ Parallel AI Execution
Revolutionary **Fan-Out** workflow architecture supporting simultaneous parallel AI processing. Execute complex workflows where a single input (e.g., one product image) triggers multiple LLM nodes in parallel—generating Amazon listings, Instagram captions, and SEO meta descriptions simultaneously for maximum efficiency.

### 🔄 Robust History Management
Enterprise-grade undo/redo system with full state management:
- **Keyboard Shortcuts:** `Ctrl+Z` (Undo) and `Ctrl+Y` / `Ctrl+Shift+Z` (Redo)
- **Visual Controls:** Floating undo/redo buttons in the canvas
- **State Preservation:** Complete workflow state snapshots with intelligent change detection
- **Delete Support:** Native `Backspace` and `Delete` key handling for node removal

### 💾 Full Persistence & Portability
Comprehensive data management capabilities:
- **Auto-Save to MongoDB:** Automatic workflow persistence with Mongoose ODM
- **JSON Import/Export:** Import workflows from `.json` files or export to share across environments
- **Template System:** Pre-built workflow templates for common use cases (Product Listing, Image Analysis, etc.)
- **Workflow Library:** Organized dashboard with saved workflows and quick access templates

### 🧠 Multimodal AI Integration
Advanced AI capabilities powered by **Google Gemini 1.5 Flash**:
- **Text Processing:** System prompts, user messages, and dynamic content generation
- **Image Analysis:** Upload and analyze images with vision capabilities
- **Multimodal Prompts:** Combine text and image inputs in a single AI request
- **Real-Time Execution:** Live status updates and streaming response handling

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.1.1** (App Router) - React framework with server-side rendering
- **React 19.2.3** - Latest React with concurrent features
- **React Flow (@xyflow/react 12.10.0)** - Advanced node-based graph visualization
- **Tailwind CSS 4.0** - Utility-first CSS framework for rapid UI development
- **Lucide React 0.562.0** - Modern icon library
- **Sonner 2.0.7** - Elegant toast notifications
- **Zustand 5.0.9** - Lightweight state management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Mongoose 9.1.1** - MongoDB object modeling and validation
- **Zod 4.3.4** - TypeScript-first schema validation
- **Node.js** - Runtime environment

### AI & ML
- **Google Generative AI SDK 0.24.1** - Official Gemini API integration
- **Gemini 1.5 Flash** - Multimodal AI model for text and vision

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **MongoDB** database (Local instance or MongoDB Atlas connection string)
- **Google Gemini API Key** ([Get API Key](https://ai.google.dev/))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-workflow-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ai-workflow-builder
   # OR for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-workflow-builder
   
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

---

## 📸 Gallery

### Dashboard View
![Dashboard Screenshot](public/dashboard-screenshot.png)
*Clean workspace interface with workflow library and saved files*

### Editor - Parallel Workflow
![Editor Parallel Workflow](public/editor-parallel.png)
*Complex fan-out workflow showing one image input triggering multiple LLM nodes in parallel*

### Node Canvas
![Node Canvas](public/node-canvas.png)
*Visual workflow builder with Text, Image, and LLM nodes*

---

## 📂 Project Structure

```
ai-workflow-builder/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── llm/                  # Gemini AI integration endpoint
│   │   └── workflows/            # Workflow CRUD operations
│   ├── editor/                   # Visual workflow editor page
│   │   └── page.tsx              # Main editor canvas component
│   ├── page.tsx                  # Dashboard/home page
│   ├── layout.tsx                # Root layout with Inter font
│   └── globals.css               # Global styles and Tailwind
│
├── components/
│   ├── ui/                       # Reusable UI components (shadcn/ui style)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   └── textarea.tsx
│   └── workflow/                 # Workflow-specific components
│       ├── Header.tsx            # Editor header with save/export/import
│       ├── Sidebar.tsx           # Node palette and workflow templates
│       ├── WorkflowLayout.tsx    # Layout wrapper
│       └── nodes/                # Custom React Flow node components
│           ├── BaseNode.tsx      # Base node wrapper
│           ├── TextNode.tsx      # Text input node
│           ├── ImageNode.tsx     # Image upload/display node
│           └── LLMNode.tsx       # AI execution node
│
├── lib/
│   ├── db.ts                     # MongoDB connection and setup
│   ├── templates.ts              # Pre-built workflow templates
│   └── utils.ts                  # Utility functions
│
├── models/
│   └── Workflow.ts               # Mongoose schema for workflows
│
└── types/                        # TypeScript type definitions
```

### Key Architecture Decisions

- **App Router Architecture:** Leverages Next.js 16 App Router for optimal performance and React Server Components support
- **Custom Node System:** Extensible node type system built on React Flow's plugin architecture
- **State Management:** React Flow's built-in state hooks (`useNodesState`, `useEdgesState`) combined with Zustand for global state
- **Graph Execution Engine:** Custom-built execution engine that traverses node dependencies and executes LLM calls with proper payload construction

---

## 🎯 Use Cases

- **E-Commerce Content Generation:** Create product listings, social media captions, and SEO content from product images
- **Content Marketing:** Generate blog posts, social media content, and marketing copy
- **Image Analysis Workflows:** Analyze images and generate descriptive text, summaries, or metadata
- **Multi-Channel Content Distribution:** Generate platform-specific content variants from a single source
- **AI-Powered Automation:** Build custom workflows that combine text processing and image analysis

---

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm start` - Start production server
- `npm run lint` - Run ESLint code analysis

### Code Style

- **TypeScript:** Strict mode enabled with comprehensive type coverage
- **ESLint:** Next.js recommended configuration
- **Component Architecture:** Modular, reusable components with clear separation of concerns

---

## 📝 License

OpenSource. All rights reserved.

---

## 🙏 Acknowledgments

- **Weavy.ai** - Original design inspiration
- **React Flow** - Powerful graph visualization library
- **Google Gemini** - Advanced multimodal AI capabilities
- **Next.js Team** - Excellent React framework and developer experience

---

**Built with ❤️ using Next.js, React Flow, and Google Gemini**
