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
    const response = await fetch("https://api.assemblyai.com/v2/realtime/token", {
      method: "POST",
      headers: {
        "authorization": apiKey,
        "content-type": "application/json"
      },
      body: JSON.stringify({ expires_in: 3600 })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
}
