export default async function handler(req, res) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Missing GitHub code" });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).json({ error: "GitHub OAuth env vars missing" });
  }

  const host = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "https://eee-vault-jstu.vercel.app";

  const redirectUri = `${host}/api/auth`;

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "eee-vault-cms",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return res.status(401).json({ error: "GitHub auth failed", details: tokenData });
  }

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "User-Agent": "eee-vault-cms",
      Accept: "application/vnd.github+json",
    },
  });

  const user = await userRes.json();

  return res.status(200).json({
    token: tokenData.access_token,
    provider: "github",
    user,
  });
}