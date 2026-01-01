import mongoose, { Schema, Model, Document } from 'mongoose';

// TypeScript interface for Workflow document
export interface IWorkflow extends Document {
  name: string;
  nodes: any[]; // React Flow nodes (dynamic structure)
  edges: any[]; // React Flow edges (dynamic structure)
  createdAt: Date;
  updatedAt?: Date;
}

// Mongoose Schema
const WorkflowSchema = new Schema<IWorkflow>(
  {
    name: {
      type: String,
      required: [true, 'Workflow name is required'],
      trim: true,
      maxlength: [100, 'Workflow name cannot exceed 100 characters'],
    },
    nodes: {
      type: [Schema.Types.Mixed],
      required: [true, 'Nodes array is required'],
      default: [],
    },
    edges: {
      type: [Schema.Types.Mixed],
      required: [true, 'Edges array is required'],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Indexes for performance
WorkflowSchema.index({ createdAt: -1 }); // Sort by newest first
WorkflowSchema.index({ name: 1 }); // Search by name

// Export the model (handle "model already compiled" error in Next.js)
const Workflow: Model<IWorkflow> =
  mongoose.models.Workflow || mongoose.model<IWorkflow>('Workflow', WorkflowSchema);

export default Workflow;

