import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      username,
      user_id,
      cover_letter_content,
      options_used,
      word_count,
      character_count
    } = body;

    // Track cover letter generation and save the content
    const trackingResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action_type: 'cover_letter_generation',
        user_id: user_id,
        username: username,
        details: {
          options_used: options_used,
          word_count: word_count,
          character_count: character_count,
          generated_via: 'ai_writer_copy_action'
        },
        cover_letter_content: cover_letter_content,
        ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown'
      })
    });

    if (!trackingResponse.ok) {
      console.error('Backend tracking failed:', await trackingResponse.text());
      return NextResponse.json(
        { success: false, message: 'Failed to track cover letter generation' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: 'Cover letter generation tracked successfully' });

  } catch (error) {
    console.error('Error tracking cover letter generation:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
