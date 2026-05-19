export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method Not Allowed" } });
  }

  const proxySecret = process.env.PROXY_SECRET;
  if (!proxySecret || req.headers["x-proxy-secret"] !== proxySecret) {
    return res.status(403).json({ error: { message: "Acesso não autorizado." } });
  }

  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: { message: "AssemblyAI key não configurada no servidor." } });
  }

  try {
    // v3 — token válido por 60s para abrir o WebSocket (máx 600s)
    const response = await fetch(
      "https://streaming.assemblyai.com/v3/token?expires_in_seconds=60",
      {
        method: "GET",
        headers: { "authorization": apiKey }
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}
