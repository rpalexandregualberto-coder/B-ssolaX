export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: { message: "Method Not Allowed" } }), {
      status: 405, headers: { "Content-Type": "application/json" }
    });
  }

  const proxySecret = process.env.PROXY_SECRET;
  if (!proxySecret || req.headers.get("x-proxy-secret") !== proxySecret) {
    return new Response(JSON.stringify({ error: { message: "Acesso não autorizado." } }), {
      status: 403, headers: { "Content-Type": "application/json" }
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: { message: "API key não configurada no servidor." } }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const body = await req.json();

    if (body.stream === true) {
      // Streaming: pipe SSE diretamente — sem limite de tempo
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
          "x-api-key": apiKey
        },
        body: JSON.stringify(body)
      });
      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "X-Accel-Buffering": "no"
        }
      });
    }

    // Non-streaming (reuniões, relatórios curtos)
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": apiKey
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: { message: err.message } }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}
