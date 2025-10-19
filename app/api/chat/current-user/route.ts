import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    const authHeader = request.headers.get('authorization');
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header is required' },
        { status: 401 }
      );
    }

    // First get the current user ID
    const userResponse = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      },
    });

    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.error('Failed to get current user:', {
        status: userResponse.status,
        statusText: userResponse.statusText,
        error: errorText
      });
      return NextResponse.json(
        { error: `Failed to get current user: ${userResponse.status}` },
        { status: userResponse.status }
      );
    }

    const userData = await userResponse.json();
    const userId = userData.id;

    // Call the backend rate limiting check with the current user's ID
    const response = await fetch(`${API_BASE_URL}/chat/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
        'Authorization': authHeader,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Pass through rate limit errors (429) with full detail
      if (response.status === 429) {
        return NextResponse.json(errorData, { status: 429 });
      }
      
      console.error('Backend rate limit check error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    // Return success - actual AI response is handled by frontend
    return NextResponse.json({ 
      status: 'success', 
      message: 'Rate limit check passed',
      user_id: userId 
    });
    
  } catch (error) {
    console.error('Current user chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}