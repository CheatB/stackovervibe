/** IndexNow верификация — возвращает ключ */
export async function GET() {
  const ключ = process.env.INDEXNOW_KEY;
  if (!ключ) {
    return new Response("IndexNow key not configured", { status: 404 });
  }
  return new Response(ключ, {
    headers: { "Content-Type": "text/plain" },
  });
}
