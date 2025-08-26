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

    // Get analytics-specific data using detailed endpoint
    const [statsResponse, actionsResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/analytics/detailed`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/analytics/actions?limit=100`, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      })
    ]);

    if (!statsResponse.ok) {
      const errorData = await statsResponse.json();
      return NextResponse.json(errorData, { status: statsResponse.status });
    }

    const statsData = await statsResponse.json();
    let actionsData = [];
    
    if (actionsResponse.ok) {
      actionsData = await actionsResponse.json();
    }

    return NextResponse.json({
      stats: statsData.stats,
      recent_actions: actionsData
    });
  } catch (error) {
    console.error('Analytics fetch error:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
