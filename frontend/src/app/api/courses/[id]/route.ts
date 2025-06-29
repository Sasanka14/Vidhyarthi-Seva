import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  // Parse the id from the URL
  const url = new URL(req.url);
  const id = url.pathname.split('/').pop();

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  const res = await fetch(`${backendUrl}/api/courses/${id}`);
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
