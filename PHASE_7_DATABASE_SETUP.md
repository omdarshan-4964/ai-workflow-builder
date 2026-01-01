# 💾 Phase 7: Database Integration - BACKEND COMPLETE

## 🎯 Goal
Implement MongoDB database integration to save and load workflows, enabling workflow persistence across sessions.

---

## 📦 What Was Built (Backend)

### 1. Database Connection (`lib/db.ts`)

Implemented a **cached MongoDB connection** following Next.js best practices:

**Key Features:**
- ✅ Connection pooling to prevent multiple connections in dev mode
- ✅ Global caching to reuse connections across hot reloads
- ✅ Environment variable validation
- ✅ Comprehensive logging for debugging
- ✅ Error handling with detailed messages

**Connection Pattern:**
```typescript
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    console.log('✅ Using cached MongoDB connection');
    return cached.conn;
  }
  // ... create new connection if needed
}
```

**Why This Pattern?**
- In Next.js dev mode, hot reloads can create multiple connections
- Caching prevents "too many connections" errors
- Production builds don't have this issue, but pattern works for both

---

### 2. Workflow Model (`models/Workflow.ts`)

Created a **Mongoose schema** for storing workflows:

**Schema Fields:**
```typescript
{
  name: String (required, max 100 chars)
  nodes: Array<Mixed> (React Flow nodes)
  edges: Array<Mixed> (React Flow edges)
  createdAt: Date (auto-generated)
  updatedAt: Date (auto-generated)
}
```

**Key Features:**
- ✅ TypeScript interface (`IWorkflow`) for type safety
- ✅ Validation rules (required fields, max length)
- ✅ Automatic timestamps (`createdAt`, `updatedAt`)
- ✅ Indexes for performance:
  - `createdAt: -1` (sort by newest first)
  - `name: 1` (search by name)
- ✅ Handles "model already compiled" error (Next.js hot reload issue)

**Model Export Pattern:**
```typescript
const Workflow: Model<IWorkflow> =
  mongoose.models.Workflow || mongoose.model<IWorkflow>('Workflow', WorkflowSchema);
```

This prevents the "Cannot overwrite model" error in Next.js dev mode.

---

### 3. API Routes (`app/api/workflows/route.ts`)

Implemented **RESTful API endpoints** for workflow CRUD operations:

#### **GET /api/workflows**
Fetch all workflows (sorted by newest first)

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Product Listing Generator",
      "nodes": [...],
      "edges": [...],
      "createdAt": "2025-01-01T12:00:00.000Z",
      "updatedAt": "2025-01-01T12:00:00.000Z"
    }
  ],
  "count": 1
}
```

**Features:**
- ✅ Sorts by `createdAt: -1` (newest first)
- ✅ Uses `.lean()` for better performance (plain JS objects)
- ✅ Selects only necessary fields
- ✅ Returns count for pagination (future)

#### **POST /api/workflows**
Create a new workflow

**Request Body:**
```json
{
  "name": "My Workflow",
  "nodes": [...],
  "edges": [...]
}
```

**Response Format:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "My Workflow",
    "nodes": [...],
    "edges": [...],
    "createdAt": "2025-01-01T12:00:00.000Z"
  },
  "message": "Workflow saved successfully"
}
```

**Features:**
- ✅ Validates required fields (name, nodes, edges)
- ✅ Trims whitespace from name
- ✅ Validates array types
- ✅ Handles validation errors with detailed messages
- ✅ Returns 201 status code for successful creation

---

## 🔧 Error Handling

### Connection Errors
```typescript
if (!MONGODB_URI) {
  throw new Error('Please define MONGODB_URI in .env.local');
}
```

### Validation Errors
```typescript
if (!name || !name.trim()) {
  return NextResponse.json(
    { success: false, error: 'Workflow name is required' },
    { status: 400 }
  );
}
```

### Database Errors
```typescript
catch (error: any) {
  if (error.name === 'ValidationError') {
    return NextResponse.json(
      { success: false, error: 'Validation failed', details: error.errors },
      { status: 400 }
    );
  }
  // ... handle other errors
}
```

---

## 📋 Files Created

### Backend Files
1. ✅ `lib/db.ts` - MongoDB connection with caching
2. ✅ `models/Workflow.ts` - Mongoose schema and model
3. ✅ `app/api/workflows/route.ts` - GET and POST endpoints

---

## 🧪 Testing the Backend

### 1. Setup MongoDB
```bash
# Add to .env.local
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/weavy-clone?retryWrites=true&w=majority
```

### 2. Test GET Endpoint
```bash
# Fetch all workflows
curl http://localhost:3000/api/workflows
```

**Expected Response:**
```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

### 3. Test POST Endpoint
```bash
# Create a workflow
curl -X POST http://localhost:3000/api/workflows \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Workflow",
    "nodes": [{"id": "1", "type": "textNode", "position": {"x": 0, "y": 0}, "data": {}}],
    "edges": []
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Test Workflow",
    "nodes": [...],
    "edges": [],
    "createdAt": "..."
  },
  "message": "Workflow saved successfully"
}
```

### 4. Verify in MongoDB Atlas
1. Go to your MongoDB Atlas dashboard
2. Navigate to "Collections"
3. Find the `workflows` collection
4. Verify the document was created

---

## 🚀 Next Steps (Frontend Integration)

### TODO: Connect UI to Backend

1. **Save Button Handler** (`app/editor/page.tsx`)
   ```typescript
   const saveWorkflow = async () => {
     const response = await fetch('/api/workflows', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ name: workflowName, nodes, edges }),
     });
     const data = await response.json();
     if (data.success) {
       toast.success('Workflow saved!');
     }
   };
   ```

2. **Load Workflows Modal**
   - Create `components/workflow/LoadWorkflowModal.tsx`
   - Fetch workflows on mount: `GET /api/workflows`
   - Display list of workflows
   - Click to load: `setNodes(workflow.nodes); setEdges(workflow.edges);`

3. **Auto-save Feature**
   - Debounce workflow changes (5 seconds)
   - Auto-save to database
   - Show "Saving..." indicator

4. **Update/Delete Endpoints**
   - Create `app/api/workflows/[id]/route.ts`
   - Implement PUT (update) and DELETE endpoints
   - Add UI buttons for update/delete

---

## 📊 Database Schema Design

### Current Schema
```
Workflow {
  _id: ObjectId (auto)
  name: String
  nodes: Array<Mixed>
  edges: Array<Mixed>
  createdAt: Date
  updatedAt: Date
}
```

### Future Enhancements
```
Workflow {
  _id: ObjectId
  name: String
  nodes: Array<Mixed>
  edges: Array<Mixed>
  userId: ObjectId (ref: User) // 👈 Add when Clerk is integrated
  isPublic: Boolean // 👈 For sharing workflows
  tags: Array<String> // 👈 For categorization
  thumbnail: String // 👈 Workflow preview image
  description: String // 👈 Workflow description
  version: Number // 👈 For versioning
  createdAt: Date
  updatedAt: Date
}
```

---

## 🔒 Security Considerations

### Current State (No Auth)
- ⚠️ Anyone can save/load workflows
- ⚠️ No user isolation
- ⚠️ No rate limiting

### Future (With Clerk Auth)
- ✅ Add `userId` field to schema
- ✅ Validate user authentication in API routes
- ✅ Filter workflows by `userId`
- ✅ Add rate limiting middleware
- ✅ Implement workflow ownership checks

**Example with Auth:**
```typescript
// app/api/workflows/route.ts
import { auth } from '@clerk/nextjs';

export async function POST(request: NextRequest) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const workflow = await Workflow.create({
    name,
    nodes,
    edges,
    userId, // 👈 Associate with user
  });
}
```

---

## 📈 Performance Optimizations

### Implemented
- ✅ Connection caching (prevents multiple connections)
- ✅ `.lean()` queries (returns plain objects, faster)
- ✅ Indexes on `createdAt` and `name` (faster queries)
- ✅ Field selection (only fetch needed fields)

### Future Optimizations
- [ ] Pagination (limit results per page)
- [ ] Search functionality (full-text search on name)
- [ ] Compression (gzip response bodies)
- [ ] Redis caching (cache frequently accessed workflows)
- [ ] CDN for workflow thumbnails

---

## ✅ Phase 7 Status: BACKEND COMPLETE

**Completed:**
- ✅ Database connection with caching
- ✅ Workflow schema and model
- ✅ GET /api/workflows (fetch all)
- ✅ POST /api/workflows (create new)
- ✅ Error handling and validation
- ✅ TypeScript types and interfaces
- ✅ No linter errors

**Remaining (Frontend):**
- [ ] Save button handler
- [ ] Load workflows modal
- [ ] Update workflow functionality
- [ ] Delete workflow functionality
- [ ] Auto-save feature
- [ ] Loading states and error handling

**Next Phase**: Phase 7 (Frontend) - Connect UI to database endpoints

---

## 🎯 Testing Checklist

Before moving to frontend:
- [ ] Verify MongoDB connection works
- [ ] Test GET endpoint returns empty array
- [ ] Test POST endpoint creates workflow
- [ ] Test POST validation (missing name)
- [ ] Test POST validation (invalid nodes/edges)
- [ ] Verify workflow appears in MongoDB Atlas
- [ ] Check console logs for connection status
- [ ] Test error handling (invalid MONGODB_URI)

