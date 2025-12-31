import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Gemini client (matching working Cerebra implementation)
const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: NextRequest) {
  try {
    // Parse request body and support model mapping
    const body = await request.json();
    const { system, user, images, model = 'gemini-2.5-flash' } = body;

    // Validate API key
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Set GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // Validate required inputs
    if (!user) {
      return NextResponse.json(
        { error: 'User message is required' },
        { status: 400 }
      );
    }

    // Map model names to correct API identifiers for backward compatibility
    const modelMap: Record<string, string> = {
      'gemini-2.5-flash': 'gemini-2.5-flash',
      'gemini-1.5-flash': 'gemini-2.5-flash',
      'gemini-1.5-pro': 'gemini-2.5-flash',
      'gemini-1.5-flash-latest': 'gemini-2.5-flash',
      'gemini-1.5-pro-latest': 'gemini-2.5-flash',
    };
    const modelName = modelMap[model] || 'gemini-2.5-flash';
    console.log('Using model:', modelName);

    // Get the generative model
    const generativeModel = genAI.getGenerativeModel({ model: modelName });

    // Construct the prompt
    let promptText = '';
    if (system) {
      promptText += `${system}\n\n`;
    }
    promptText += user;

    // Handle multimodal input (text + images)
    if (images && images.length > 0) {
      // Prepare image parts for Gemini
      const imageParts = images.map((imageData: string) => {
        // Extract base64 data and mime type
        const matches = imageData.match(/^data:([^;]+);base64,(.+)$/);
        if (matches) {
          return {
            inlineData: {
              data: matches[2],
              mimeType: matches[1],
            },
          };
        }
        // If it's already just base64, assume it's a JPEG
        return {
          inlineData: {
            data: imageData,
            mimeType: 'image/jpeg',
          },
        };
      });

      // Generate content with images
      const result = await generativeModel.generateContent([
        promptText,
        ...imageParts,
      ]);

      const response = result.response;
      const text = response.text();

      return NextResponse.json({ response: text });
    } else {
      // Text-only generation
      const result = await generativeModel.generateContent(promptText);
      const response = result.response;
      const text = response.text();

      return NextResponse.json({ response: text });
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // Handle specific error types
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        { error: 'Invalid API key' },
        { status: 401 }
      );
    }
    
    if (error.message?.includes('quota')) {
      return NextResponse.json(
        { error: 'API quota exceeded' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to generate response' },
      { status: 500 }
    );
  }
}

