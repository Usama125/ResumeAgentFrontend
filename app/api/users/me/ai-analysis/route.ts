import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Track AI self-analysis request
    try {
      const trackingHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Forward authorization header if present for user identification
      const authHeader = request.headers.get('authorization');
      if (authHeader) {
        trackingHeaders['Authorization'] = authHeader;
      }
      
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/analytics/track`, {
        method: 'POST',
        headers: trackingHeaders,
        body: JSON.stringify({
          action_type: 'ai_resume_analysis',
          user_id: null,
          username: null,
          details: {
            analysis_type: 'self_analysis'
          },
          ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown'
        })
      });
    } catch (trackingError) {
      console.error('Analytics tracking failed:', trackingError);
    }

    // Forward to backend with authorization
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/users/me/ai-analysis`;
    const authHeader = request.headers.get('authorization');
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Origin': process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    };

    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
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
    console.error('AI self-analysis API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch AI analysis' },
      { status: 500 }
    );
  }
}
