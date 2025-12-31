# 📋 Weavy.ai Workflow Builder - Implementation Plan

## Project Overview
Build a pixel-perfect UI/UX clone of Weavy.ai workflow builder with React Flow canvas, Google Gemini API integration, and full LLM workflow capabilities.

---

## 🎯 Phase 1: Project Setup & Dependencies

### 1.1 Core Dependencies Installation
- [ ] Install React Flow: `npm install @xyflow/react`
- [ ] Install Zod for validation: `npm install zod`
- [ ] Install Zustand for state management: `npm install zustand`
- [ ] Install Lucide React for icons: `npm install lucide-react`
- [ ] Install Google Generative AI SDK: `npm install @google/generative-ai`

### 1.2 Database & Storage Setup
- [ ] Install Mongoose: `npm install mongoose`
- [ ] Install MongoDB connection utilities
- [ ] Set up MongoDB Atlas account (or local MongoDB)
- [ ] Create database schema for workflows

### 1.3 Authentication Setup
- [ ] Install Clerk: `npm install @clerk/nextjs`
- [ ] Configure Clerk provider in root layout
- [ ] Set up Clerk environment variables
- [ ] Create authentication middleware

### 1.4 File Upload & Storage Setup
- [ ] Install Uploadcare: `npm install @uploadcare/react-uploader`
- [ ] Install Cloudinary SDK: `npm install cloudinary`
- [ ] Configure Cloudinary environment variables
- [ ] Set up file upload utilities

### 1.5 UI Component Library Setup
- [ ] Initialize ShadCN UI: `npx shadcn@latest init`
- [ ] Install ShadCN Button component: `npx shadcn@latest add button`
- [ ] Install ShadCN Input component: `npx shadcn@latest add input`
- [ ] Install ShadCN Textarea component: `npx shadcn@latest add textarea`
- [ ] Install ShadCN Select component: `npx shadcn@latest add select`
- [ ] Install ShadCN Dialog component: `npx shadcn@latest add dialog`
- [ ] Install ShadCN Dropdown Menu: `npx shadcn@latest add dropdown-menu`
- [ ] Install ShadCN Separator: `npx shadcn@latest add separator`
- [ ] Install ShadCN Scroll Area: `npx shadcn@latest add scroll-area`
- [ ] Install ShadCN Toast/Sonner: `npx shadcn@latest add sonner`

### 1.6 TypeScript Configuration
- [ ] Enable strict mode in tsconfig.json
- [ ] Configure path aliases (@/components, @/lib, etc.)
- [ ] Set up type definitions for custom modules

### 1.7 Environment Variables Setup
- [ ] Create `.env.local` file
- [ ] Add `GOOGLE_GENERATIVE_AI_API_KEY`
- [ ] Add `MONGODB_URI`
- [ ] Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] Add `CLERK_SECRET_KEY`
- [ ] Add `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- [ ] Add `NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY`
- [ ] Create `.env.example` file for reference

---

## 🎨 Phase 2: UI Shell & Layout (Pixel-Perfect Weavy Clone)

### 2.1 Main Layout Structure
- [ ] Create main editor layout component
- [ ] Implement dark theme matching Weavy's exact colors
- [ ] Set up responsive container with proper overflow handling
- [ ] Add top navigation bar (if present in Weavy)

### 2.2 Left Sidebar Implementation
- [ ] Create collapsible sidebar component
- [ ] Add sidebar toggle button
- [ ] Implement "Quick Access" section header
- [ ] Add search functionality in sidebar
- [ ] Style sidebar with exact Weavy spacing and colors

### 2.3 Sidebar Node Buttons (3 Required)
- [ ] Create "Text Node" button with icon
- [ ] Create "Image Node" button with icon
- [ ] Create "Run Any LLM" button with icon
- [ ] Add drag-and-drop functionality for each button
- [ ] Style buttons to match Weavy's design exactly

### 2.4 Workflow Canvas Area
- [ ] Set up React Flow canvas container
- [ ] Implement dot grid background (exact pattern as Weavy)
- [ ] Configure canvas background color
- [ ] Add smooth panning functionality
- [ ] Add zoom controls (scroll wheel)
- [ ] Implement "Fit View" functionality

### 2.5 MiniMap Component
- [ ] Add React Flow MiniMap to bottom-right corner
- [ ] Position and style to match Weavy exactly
- [ ] Configure minimap colors and opacity
- [ ] Ensure minimap updates with canvas changes

### 2.6 Canvas Controls
- [ ] Add zoom in/out buttons
- [ ] Add fit view button
- [ ] Style controls to match Weavy's design
- [ ] Position controls appropriately

---

## 🧩 Phase 3: Node Components Implementation

### 3.1 Base Node Component
- [ ] Create custom node wrapper component
- [ ] Implement node header with title
- [ ] Add node delete button (menu or keyboard)
- [ ] Style node container (border, shadow, rounded corners)
- [ ] Add node selection state styling
- [ ] Implement node resize handles (if needed)

### 3.2 Text Node Component
- [ ] Create Text Node component
- [ ] Add textarea input for text content
- [ ] Implement output handle (bottom)
- [ ] Add label "output" on handle
- [ ] Style to match Weavy's text node design
- [ ] Implement auto-resize for textarea
- [ ] Add character count (if in Weavy)

### 3.3 Image Node Component
- [ ] Create Image Node component
- [ ] Integrate Uploadcare file uploader
- [ ] Add image preview after upload
- [ ] Implement output handle (bottom)
- [ ] Add image URL storage in node data
- [ ] Style upload area to match Weavy
- [ ] Add loading state during upload
- [ ] Add error handling for failed uploads

### 3.4 LLM Node Component
- [ ] Create LLM Node component
- [ ] Add model selector dropdown (Gemini models)
- [ ] Implement system_prompt input handle (optional)
- [ ] Implement user_message input handle (required)
- [ ] Implement images input handle (optional, multiple)
- [ ] Add output handle for LLM response
- [ ] Create "Run" button with loading state
- [ ] Add prompt textarea for custom instructions
- [ ] Style to match Weavy's LLM node design
- [ ] Add error display area

---

## 🔗 Phase 4: Node Connection System

### 4.1 Connection Logic
- [ ] Implement custom edge component
- [ ] Add animated purple edges (exact color from Weavy)
- [ ] Configure edge animation speed and style
- [ ] Add edge deletion on click/keyboard
- [ ] Implement connection validation rules
- [ ] Prevent invalid connections (type checking)

### 4.2 Handle Configuration
- [ ] Configure source handles (output)
- [ ] Configure target handles (input)
- [ ] Add handle labels
- [ ] Style handles to match Weavy
- [ ] Add hover effects on handles

### 4.3 Data Flow System
- [ ] Implement data propagation through edges
- [ ] Create node data update mechanism
- [ ] Handle multiple inputs aggregation (for LLM images)
- [ ] Implement reactive updates when connections change

---

## 🤖 Phase 5: LLM Integration (Google Gemini)

### 5.1 API Route Setup
- [ ] Create `/api/llm/execute` POST endpoint
- [ ] Implement Zod validation schema for requests
- [ ] Add request body validation
- [ ] Set up error handling with typed responses
- [ ] Add loading states handling

### 5.2 Gemini API Integration
- [ ] Initialize Google Generative AI client
- [ ] Implement model selection logic
- [ ] Create text-only prompt function
- [ ] Create multimodal prompt function (text + images)
- [ ] Handle system prompts properly
- [ ] Implement streaming response (optional)

### 5.3 Vision Support
- [ ] Implement image URL fetching
- [ ] Convert images to base64 or proper format
- [ ] Add images to Gemini request
- [ ] Handle multiple image inputs
- [ ] Add image validation (size, format)

### 5.4 Error Handling & User Feedback
- [ ] Add graceful error messages for API failures
- [ ] Display user-friendly error messages in UI
- [ ] Add retry logic for transient failures
- [ ] Implement rate limiting handling
- [ ] Add loading spinners during API calls
- [ ] Disable run button during execution

---

## 📊 Phase 6: Pre-built Workflow - Product Listing Generator

### 6.1 Workflow Structure
- [ ] Create 3 Image Nodes (Product Photo 1, 2, 3)
- [ ] Create 2 Text Nodes (System prompt, Product name & specs)
- [ ] Create 1 LLM Node (Analyze product)
- [ ] Create 3 LLM Nodes (Write Amazon listing, Instagram caption, SEO meta)
- [ ] Create 3 Text Nodes (Output displays)

### 6.2 Node Connections
- [ ] Connect Image Nodes → Analyze product LLM
- [ ] Connect Text Nodes → Analyze product LLM
- [ ] Connect Analyze product output → All 3 writing LLMs
- [ ] Connect each writing LLM → respective Text output node

### 6.3 Pre-filled Content
- [ ] Add sample system prompt text
- [ ] Add sample product name and specs
- [ ] Configure LLM node prompts
- [ ] Set appropriate Gemini models
- [ ] Position nodes to match workflow diagram

### 6.4 Workflow Execution
- [ ] Implement sequential execution logic
- [ ] Execute "Analyze product" first
- [ ] Execute 3 writing LLMs in parallel
- [ ] Display results in output text nodes
- [ ] Add visual feedback during execution

---

## 💾 Phase 7: Workflow Persistence (Database)

### 7.1 Database Schema
- [ ] Create Workflow model (Mongoose schema)
- [ ] Add fields: userId, name, nodes, edges, createdAt, updatedAt
- [ ] Create indexes for efficient queries
- [ ] Add validation rules

### 7.2 Save Functionality
- [ ] Create `/api/workflows` POST endpoint
- [ ] Implement save workflow logic
- [ ] Serialize React Flow state (nodes + edges)
- [ ] Associate workflow with authenticated user
- [ ] Add success/error toast notifications

### 7.3 Load Functionality
- [ ] Create `/api/workflows` GET endpoint
- [ ] Fetch user's workflows from database
- [ ] Create `/api/workflows/[id]` GET endpoint
- [ ] Deserialize and restore React Flow state
- [ ] Handle missing workflows gracefully

### 7.4 Update Functionality
- [ ] Create `/api/workflows/[id]` PUT endpoint
- [ ] Implement update workflow logic
- [ ] Add optimistic updates in UI
- [ ] Handle concurrent edit conflicts

### 7.5 Delete Functionality
- [ ] Create `/api/workflows/[id]` DELETE endpoint
- [ ] Add confirmation dialog before delete
- [ ] Remove workflow from database
- [ ] Update UI after deletion

---

## 📤 Phase 8: Workflow Export/Import (JSON)

### 8.1 Export Functionality
- [ ] Create export button in UI
- [ ] Serialize workflow to JSON format
- [ ] Include metadata (version, created date, etc.)
- [ ] Trigger file download
- [ ] Add filename with timestamp

### 8.2 Import Functionality
- [ ] Create import button in UI
- [ ] Add file input for JSON upload
- [ ] Validate JSON structure with Zod
- [ ] Parse and restore workflow state
- [ ] Handle import errors gracefully
- [ ] Show success confirmation

---

## 🎭 Phase 9: Advanced Canvas Features

### 9.1 Drag & Drop from Sidebar
- [ ] Implement drag start handler
- [ ] Track drag position
- [ ] Create node on drop
- [ ] Position node at drop location
- [ ] Add smooth animation

### 9.2 Node Deletion
- [ ] Add delete button on node
- [ ] Implement keyboard shortcut (Delete/Backspace)
- [ ] Remove node and connected edges
- [ ] Add confirmation for nodes with data
- [ ] Update workflow state

### 9.3 Undo/Redo Functionality
- [ ] Set up history state management
- [ ] Track node/edge changes
- [ ] Implement undo action (Ctrl+Z)
- [ ] Implement redo action (Ctrl+Y)
- [ ] Add undo/redo buttons in UI
- [ ] Limit history stack size

### 9.4 Canvas Navigation
- [ ] Implement pan (drag background)
- [ ] Implement zoom (scroll wheel)
- [ ] Add zoom limits (min/max)
- [ ] Implement fit view functionality
- [ ] Add keyboard shortcuts for navigation

---

## 🎨 Phase 10: Styling & Polish (Pixel-Perfect)

### 10.1 Color Matching
- [ ] Extract exact colors from Weavy.ai
- [ ] Update Tailwind config with custom colors
- [ ] Apply background colors
- [ ] Style node colors
- [ ] Match edge colors (purple animation)
- [ ] Style button colors and hover states

### 10.2 Typography
- [ ] Match font families
- [ ] Match font sizes
- [ ] Match font weights
- [ ] Match line heights
- [ ] Match letter spacing

### 10.3 Spacing & Layout
- [ ] Match padding values
- [ ] Match margin values
- [ ] Match border radius
- [ ] Match shadow values
- [ ] Match component dimensions

### 10.4 Animations
- [ ] Add edge animation
- [ ] Add button hover effects
- [ ] Add node selection animation
- [ ] Add loading spinners
- [ ] Add toast animations
- [ ] Ensure smooth transitions

### 10.5 Responsive Design
- [ ] Test on mobile devices
- [ ] Implement responsive sidebar (collapse on mobile)
- [ ] Adjust canvas controls for mobile
- [ ] Handle touch gestures
- [ ] Test on tablet sizes
- [ ] Ensure proper overflow handling

---

## 🔐 Phase 11: Authentication & Authorization

### 11.1 Clerk Integration
- [ ] Wrap app with ClerkProvider
- [ ] Add sign-in page
- [ ] Add sign-up page
- [ ] Implement protected routes
- [ ] Add user profile dropdown

### 11.2 User Session Management
- [ ] Get current user in API routes
- [ ] Associate workflows with user ID
- [ ] Implement user-specific data fetching
- [ ] Add session timeout handling

### 11.3 Authorization Logic
- [ ] Verify user owns workflow before edit
- [ ] Verify user owns workflow before delete
- [ ] Add proper error responses for unauthorized access

---

## 🧪 Phase 12: Testing & Validation

### 12.1 API Validation
- [ ] Test all API endpoints with Postman/Thunder Client
- [ ] Verify Zod schemas catch invalid data
- [ ] Test error responses
- [ ] Test authentication requirements

### 12.2 Workflow Testing
- [ ] Test creating nodes
- [ ] Test connecting nodes
- [ ] Test deleting nodes
- [ ] Test LLM execution with text only
- [ ] Test LLM execution with images
- [ ] Test workflow save/load
- [ ] Test workflow export/import

### 12.3 UI Testing
- [ ] Test drag and drop
- [ ] Test canvas navigation
- [ ] Test responsive behavior
- [ ] Test all buttons and interactions
- [ ] Test error states
- [ ] Test loading states

### 12.4 Edge Cases
- [ ] Test with no API key
- [ ] Test with invalid API key
- [ ] Test with large images
- [ ] Test with many nodes
- [ ] Test with complex workflows
- [ ] Test offline behavior

---

## 🚀 Phase 13: Deployment Preparation

### 13.1 Environment Configuration
- [ ] Set up Vercel project
- [ ] Add all environment variables in Vercel
- [ ] Configure MongoDB connection string
- [ ] Set up Clerk production instance
- [ ] Configure Cloudinary for production

### 13.2 Build Optimization
- [ ] Run production build locally
- [ ] Fix any build errors
- [ ] Optimize images
- [ ] Remove console logs
- [ ] Minimize bundle size

### 13.3 Deployment
- [ ] Deploy to Vercel
- [ ] Test deployed application
- [ ] Verify all API routes work
- [ ] Verify database connections
- [ ] Verify authentication flow
- [ ] Test LLM execution in production

### 13.4 Post-Deployment
- [ ] Set up error monitoring (optional: Sentry)
- [ ] Set up analytics (optional: Vercel Analytics)
- [ ] Create demo video (2-3 minutes)
- [ ] Test on multiple devices/browsers

---

## 📝 Phase 14: Documentation & Submission

### 14.1 README.md
- [ ] Add project description
- [ ] Add setup instructions
- [ ] Add environment variables guide
- [ ] Add usage instructions
- [ ] Add tech stack list
- [ ] Add screenshots/GIFs
- [ ] Add deployment link

### 14.2 Code Documentation
- [ ] Add JSDoc comments to complex functions
- [ ] Add inline comments for tricky logic
- [ ] Document API endpoints
- [ ] Document component props

### 14.3 Demo Video
- [ ] Record workflow creation
- [ ] Show drag and drop
- [ ] Show node connections
- [ ] Show LLM execution
- [ ] Show save/load functionality
- [ ] Show pre-built workflow
- [ ] Keep under 3 minutes

### 14.4 Final Submission
- [ ] Verify GitHub repository is public/accessible
- [ ] Verify Vercel deployment is live
- [ ] Upload demo video
- [ ] Double-check all requirements met
- [ ] Submit project

---

## ✅ Deliverables Checklist (From Assignment)

### Required Features
- [ ] Pixel-perfect Weavy clone UI (exact spacing/colors)
- [ ] Left sidebar with 3 buttons (Text, Image, Run Any LLM)
- [ ] React Flow canvas with dot grid background
- [ ] Functional Text Node with textarea and output handle
- [ ] Functional Image Node with upload and preview
- [ ] Functional LLM Node with model selector, prompts, and run capability
- [ ] Pre-built workflow - Product Listing Generator
- [ ] Node connections with animated purple edges
- [ ] API route with Zod validation for LLM execution
- [ ] Google Gemini integration with vision support

### Additional Requirements
- [ ] TypeScript throughout with strict mode
- [ ] Workflow save/load to DB (MongoDB)
- [ ] Workflow export/import as JSON
- [ ] Deployed on Vercel with environment variables

---

## 🎯 Success Criteria

1. **Pixel-Perfect UI**: Side-by-side comparison with Weavy.ai shows identical design
2. **Full Functionality**: All nodes work, connections work, LLM executes properly
3. **Pre-built Workflow**: Product Listing Generator works end-to-end
4. **Persistence**: Workflows save and load correctly
5. **Production Ready**: Deployed, tested, and documented
6. **Clean Code**: TypeScript strict mode, proper error handling, organized structure

---

## 📚 Resources Reference

- [Weavy.ai](https://weavy.ai) - Reference application
- [React Flow Documentation](https://reactflow.dev/docs)
- [Google AI Studio](https://aistudio.google.com) - Get API key
- [Gemini API Documentation](https://ai.google.dev/gemini-api/docs/models)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Zod Documentation](https://zod.dev/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [Mongoose Documentation](https://mongoosejs.com/)

---

**Estimated Timeline**: 20-24 hours of focused development
**Priority**: Follow phases in order for systematic progress
**Commit Strategy**: Commit after each major checkbox completion

Good luck! 🚀

