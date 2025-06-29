import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vidhyarthi-seva.onrender.com';
    
    // Transform the data to match backend expectations
    const transformedData = {
      firstName: data.firstName || data.name?.split(' ')[0] || '',
      lastName: data.lastName || data.name?.split(' ').slice(1).join(' ') || '',
      email: data.email,
      phone: data.phone,
      password: data.password,
      role: data.role || 'student'
    };

    const res = await fetch(`${backendUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transformedData),
    });
    
    const result = await res.json();
    
    return new Response(JSON.stringify(result), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Internal server error' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 