import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Call the backend username validation API
    const response = await fetch(`${API_BASE_URL}/auth/check-username`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Username validation API error:', error);
    return NextResponse.json(
      { error: 'Failed to validate username' },
      { status: 500 }
    );
  }
}