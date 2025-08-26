import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Track AI analysis request
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action_type: 'ai_resume_analysis',
          user_id: null,
          username: null,
          details: {
            analysis_type: 'profile_analysis',
            target_user_id: userId
          },
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown'
        })
      });
    } catch (trackingError) {
      console.error('Analytics tracking failed:', trackingError);
    }

    // Forward to backend
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/users/${userId}/ai-analysis`;
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch AI analysis' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('AI analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI analysis' },
      { status: 500 }
    );
  }
}
