import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { message } = await request.json();
    const { username } = await params;

    if (!message || !username) {
      return NextResponse.json(
        { error: 'Message and username are required' },
        { status: 400 }
      );
    }

    // Forward authorization header if present
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    };

    // Pass through authorization header from the original request
    const authorization = request.headers.get('authorization');
    if (authorization) {
      headers['Authorization'] = authorization;
    }

    // Call the backend chat API using username
    const response = await fetch(`${API_BASE_URL}/chat/username/${username}`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Pass through rate limit errors (429) with full detail
      if (response.status === 429) {
        return NextResponse.json(errorData, { status: 429 });
      }
      
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    // Return success - actual AI response is handled by frontend
    return NextResponse.json({ 
      status: 'success', 
      message: 'Rate limit check passed',
      user_id: data.user_id 
    });
    
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
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Forward authorization header if present
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    };

    // Pass through authorization header from the original request
    const authorization = request.headers.get('authorization');
    if (authorization) {
      headers['Authorization'] = authorization;
    }

    // Call the backend chat suggestions API using username
    const response = await fetch(`${API_BASE_URL}/chat/suggestions/username/${username}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Pass through rate limit errors (429) with full detail
      if (response.status === 429) {
        return NextResponse.json(errorData, { status: 429 });
      }
      
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