import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { detail: 'Authorization header required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '5';

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/stats/recent-users?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const users = await response.json();
    
    // Return only essential recent user data
    const recentUsers = users.map((user: any) => ({
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      username: user.username,
      profession: user.profession,
      created_at: user.created_at
    }));

    return NextResponse.json(recentUsers);
  } catch (error) {
    console.error('Recent users fetch error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
