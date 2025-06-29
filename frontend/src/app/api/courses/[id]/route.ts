import { NextRequest } from 'next/server';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://31.97.62.33:5000';
  const res = await fetch(`${backendUrl}/api/courses/${params.id}`);
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}