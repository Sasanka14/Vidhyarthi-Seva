import type { NextRequest } from 'next/server';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'No token provided' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
    
    const res = await fetch(`${backendUrl}/api/users/${params.id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    const result = await res.json();
    
    return new Response(JSON.stringify(result), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Update user error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 