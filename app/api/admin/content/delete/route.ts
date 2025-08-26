import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { detail: 'Authorization header required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const letterId = searchParams.get('letterId');
    const deleteAll = searchParams.get('deleteAll') === 'true';
    
    let apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/admin/analytics/cover-letters`;
    
    if (letterId) {
      // Delete single cover letter
      apiUrl += `/${letterId}`;
    } else if (deleteAll) {
      // Delete all cover letters (no additional path needed)
    } else {
      return NextResponse.json(
        { detail: 'Either letterId or deleteAll=true must be provided' },
        { status: 400 }
      );
    }

    const response = await fetch(apiUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error in cover letter delete API:', error);
    return NextResponse.json(
      { detail: 'Internal server error' },
      { status: 500 }
    );
  }
}
