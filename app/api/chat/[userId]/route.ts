import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { message } = await request.json();
    const { userId } = await params; // Fix: await params before accessing properties

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and userId are required' },
        { status: 400 }
      );
    }

    // Call the backend chat API
    const response = await fetch(`${API_BASE_URL}/chat/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params; // Fix: await params before accessing properties

    if (!userId) {
      return NextResponse.json(
        { error: 'UserId is required' },
        { status: 400 }
      );
    }

    // Call the backend chat suggestions API
    const response = await fetch(`${API_BASE_URL}/chat/suggestions/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const suggestions = await response.json();
    return NextResponse.json(suggestions);
    
  } catch (error) {
    console.error('Chat suggestions API error:', error);
    return NextResponse.json(
      { error: 'Failed to get chat suggestions' },
      { status: 500 }
    );
  }
}