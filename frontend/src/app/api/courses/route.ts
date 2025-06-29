export async function GET(req: Request, context: { params: { id?: string } }) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  // If there is an id param, fetch a single course
  if (context?.params?.id) {
    const res = await fetch(`${backendUrl}/api/courses/${context.params.id}`);
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  // Otherwise, fetch all courses
  const res = await fetch(`${backendUrl}/api/courses`);
  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
} 