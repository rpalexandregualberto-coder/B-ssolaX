const SUPABASE_URL = "https://rssrqsbxpusoglvkxqbp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_wgSwTyma32xvsWJ5LKu0WQ_hQAQVW0b";

// Valida o token de sessão do Supabase — só usuários logados no SimWork usam a transcrição
async function validateUser(req) {
  const auth = req.headers["authorization"] || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token) return null;
  try {
    const resp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, authorization: `Bearer ${token}` }
    });
    if (!resp.ok) return null;
    return await resp.json();
  } catch (_) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: { message: "Method Not Allowed" } });
  }

  const user = await validateUser(req);
  if (!user) {
    return res.status(401).json({ error: { message: "Entre na sua conta SimWork para usar a transcrição." } });
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
