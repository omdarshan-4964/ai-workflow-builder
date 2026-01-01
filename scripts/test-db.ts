/**
 * Test script to verify MongoDB connection
 * Run with: npx tsx scripts/test-db.ts
 */

import connectDB from '../lib/db';
import Workflow from '../models/Workflow';

async function testDatabase() {
  try {
    console.log('🧪 Testing MongoDB connection...\n');

    // Test 1: Connect to database
    console.log('1️⃣ Connecting to MongoDB...');
    await connectDB();
    console.log('✅ Connected successfully!\n');

    // Test 2: Count existing workflows
    console.log('2️⃣ Counting existing workflows...');
    const count = await Workflow.countDocuments();
    console.log(`✅ Found ${count} workflows in database\n`);

    // Test 3: Create a test workflow
    console.log('3️⃣ Creating test workflow...');
    const testWorkflow = await Workflow.create({
      name: 'Test Workflow - ' + new Date().toISOString(),
      nodes: [
        {
          id: 'test-node-1',
          type: 'textNode',
          position: { x: 100, y: 100 },
          data: { text: 'Test node' },
        },
      ],
      edges: [],
    });
    console.log('✅ Created workflow:', testWorkflow._id);
    console.log('   Name:', testWorkflow.name);
    console.log('   Nodes:', testWorkflow.nodes.length);
    console.log('   Created:', testWorkflow.createdAt, '\n');

    // Test 4: Fetch all workflows
    console.log('4️⃣ Fetching all workflows...');
    const workflows = await Workflow.find({}).sort({ createdAt: -1 }).limit(5);
    console.log(`✅ Fetched ${workflows.length} most recent workflows:`);
    workflows.forEach((wf, idx) => {
      console.log(`   ${idx + 1}. ${wf.name} (${wf.nodes.length} nodes, ${wf.edges.length} edges)`);
    });
    console.log('');

    // Test 5: Delete test workflow
    console.log('5️⃣ Cleaning up test workflow...');
    await Workflow.findByIdAndDelete(testWorkflow._id);
    console.log('✅ Test workflow deleted\n');

    console.log('🎉 All tests passed! Database is working correctly.\n');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testDatabase();

