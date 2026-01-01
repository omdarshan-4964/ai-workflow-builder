import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Workflow from '@/models/Workflow';

/**
 * GET /api/workflows
 * Fetch all workflows (sorted by newest first)
 */
export async function GET() {
  try {
    // Connect to database
    await connectDB();

    // Fetch all workflows, sorted by creation date (newest first)
    const workflows = await Workflow.find({})
      .sort({ createdAt: -1 })
      .select('name nodes edges createdAt updatedAt')
      .lean(); // Use lean() for better performance (returns plain JS objects)

    console.log(`✅ Fetched ${workflows.length} workflows from database`);

    return NextResponse.json({
      success: true,
      data: workflows,
      count: workflows.length,
    });
  } catch (error: any) {
    console.error('❌ Error fetching workflows:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch workflows',
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/workflows
 * Create a new workflow
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { name, nodes, edges } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Workflow name is required',
        },
        { status: 400 }
      );
    }

    if (!nodes || !Array.isArray(nodes)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Nodes array is required',
        },
        { status: 400 }
      );
    }

    if (!edges || !Array.isArray(edges)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Edges array is required',
        },
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Create new workflow
    const workflow = await Workflow.create({
      name: name.trim(),
      nodes,
      edges,
    });

    console.log('✅ Workflow saved to database:', workflow._id);

    return NextResponse.json(
      {
        success: true,
        data: workflow,
        message: 'Workflow saved successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('❌ Error saving workflow:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to save workflow',
      },
      { status: 500 }
    );
  }
}

