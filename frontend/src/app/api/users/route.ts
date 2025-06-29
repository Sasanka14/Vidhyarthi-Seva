import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const res = await fetch(`${backendUrl}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  return new Response(JSON.stringify(result), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
} 