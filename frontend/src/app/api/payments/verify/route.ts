import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '') || req.cookies.get('token')?.value;
    if (!token) {
      return new Response(JSON.stringify({ success: false, message: 'No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vidhyarthi-seva.onrender.com';
    const body = await req.json();
    const res = await fetch(`${backendUrl}/api/payments/verify`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const result = await res.json();
    return new Response(JSON.stringify(result), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 