const GITHUB_AUTHORIZE_URL = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN_URL = "https://github.com/login/oauth/access_token";

// Must exactly match the "Authorization callback URL" registered on
// the GitHub OAuth App — no trailing slash, no VERCEL_URL guessing.
const SITE_URL = "https://eee-vault-jstu.vercel.app";
const REDIRECT_URI = `${SITE_URL}/api/auth`;

export default async function handler(req, res) {
  const { code, error: githubError } = req.query;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return res.status(500).send("Missing GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET env vars.");
  }

  // Leg 1: popup just opened, no `code` yet -> send the user to GitHub.
  if (!code) {
    if (githubError) {
      return res.status(400).send(`GitHub authorization error: ${githubError}`);
    }
    const authorizeUrl = new URL(GITHUB_AUTHORIZE_URL);
    authorizeUrl.searchParams.set("client_id", clientId);
    authorizeUrl.searchParams.set("redirect_uri", REDIRECT_URI);
    authorizeUrl.searchParams.set("scope", "repo,user");
    return res.redirect(302, authorizeUrl.toString());
  }

  // Leg 2: GitHub redirected back with a `code` -> exchange it for a token.
  const tokenRes = await fetch(GITHUB_TOKEN_URL, {
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
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokenData = await tokenRes.json();

  if (!tokenData.access_token) {
    return respondToPopup(res, "error", {
      message: tokenData.error_description || "GitHub auth failed",
    });
  }

  return respondToPopup(res, "success", {
    token: tokenData.access_token,
    provider: "github",
  });
}

// Decap CMS listens for a postMessage from this popup, in the exact
// format "authorization:github:success:<json>" (or "...:error:<json>").
// It does a little handshake first: the popup pings the opener, the
// opener acks, then the popup sends the real payload.
function respondToPopup(res, status, payload) {
  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`<!doctype html>
<html><body>
<script>
  (function () {
    function receiveMessage(e) {
      window.opener.postMessage(${JSON.stringify(message)}, e.origin);
      window.removeEventListener("message", receiveMessage, false);
    }
    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("authorizing:github", "*");
  })();
</script>
</body></html>`);
}