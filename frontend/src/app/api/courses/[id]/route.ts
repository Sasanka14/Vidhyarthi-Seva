export async function GET(req: Request) {
  // Parse the request URL (in case you want to use query params later)
  const { searchParams } = new URL(req.url);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

  // Optional: Use query params (example: ?limit=10)
  const limit = searchParams.get("limit") || "";

  const res = await fetch(`${backendUrl}/api/courses${limit ? `?limit=${limit}` : ""}`);
  const data = await res.json();

  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
