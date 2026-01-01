import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Workflow from '@/models/Workflow';

/**
 * GET /api/workflows/[id]
 * Fetch a single workflow by ID
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Connect to database
    await dbConnect();

    // Await params (Next.js 15+)
    const { id } = await params;

    // Fetch workflow by ID
    const workflow = await Workflow.findById(id)
      .select('name nodes edges createdAt updatedAt')
      .lean();

    if (!workflow) {
      return NextResponse.json(
        {
          success: false,
          error: 'Workflow not found',
        },
        { status: 404 }
      );
    }

    console.log(`✅ Fetched workflow ${id} from database`);

    return NextResponse.json({
      success: true,
      data: workflow,
    });
  } catch (error: any) {
    console.error('❌ Error fetching workflow:', error);

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid workflow ID',
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch workflow',
      },
      { status: 500 }
    );
  }
}

