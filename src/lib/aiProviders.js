// AI provider management — multi-provider (Gemini / OpenRouter / local Ollama)
// Ported 1:1 in behavior from the original vanilla build so existing users'
// saved keys (same localStorage keys) keep working after the rebuild.

export const API_STORAGE_KEY = "eeeVaultApisRegistry";
export const ACTIVE_API_KEY = "eeeVaultActiveApi";
export const DAILY_QUOTA_KEY = "eeeVaultDailyQuotas";

export const SYSTEM_PROMPT = `You are an expert Engineering Professor named Vault Assistant. You have been provided with multiple pages of an engineering exam paper. Always analyze the content across all provided pages.
- If asked to solve, state the question and show full step-by-step logic.
- Use LaTeX ($...$) for math.
- If a question is unclear, ask for clarification.
- If casual, keep it under 2 lines.
- Treat each new user message as a fresh request, unless it explicitly refers to a previous question.
- Maintain a professional, academic tone.`;

export function loadApisFromStorage() {
  try {
    const stored = localStorage.getItem(API_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}
export function saveApisToStorage(apis) {
  localStorage.setItem(API_STORAGE_KEY, JSON.stringify(apis));
}
export function getActiveApiName() {
  return localStorage.getItem(ACTIVE_API_KEY) || null;
}
export function setActiveApiName(name) {
  localStorage.setItem(ACTIVE_API_KEY, name);
}
export function loadDailyQuotas() {
  try {
    const stored = localStorage.getItem(DAILY_QUOTA_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}
export function saveDailyQuotas(quotas) {
  localStorage.setItem(DAILY_QUOTA_KEY, JSON.stringify(quotas));
}

export function addApi(name, type, apiKey) {
  if (!name || !type || !apiKey) throw new Error("Name, type, and API key are required");
  const apis = loadApisFromStorage();
  if (apis[name]) throw new Error(`API "${name}" already exists. Use a different name.`);

  if (type === "gemini" && !apiKey.startsWith("AIza") && !apiKey.startsWith("AQ")) {
    throw new Error("Invalid Gemini key (should start with AIza or AQ)");
  }
  if (type === "openrouter" && !apiKey.startsWith("sk-")) {
    throw new Error("Invalid OpenRouter key (should start with sk-)");
  }
  if (type === "ollama" && !apiKey.includes("://")) {
    throw new Error("Invalid Ollama URL (should be http://...)");
  }

  apis[name] = { type, key: apiKey, createdAt: new Date().toISOString(), status: "active" };
  saveApisToStorage(apis);
  if (Object.keys(apis).length === 1) setActiveApiName(name);
  return apis;
}

export function deleteApi(name) {
  const apis = loadApisFromStorage();
  if (!apis[name]) throw new Error(`API "${name}" not found`);
  delete apis[name];
  saveApisToStorage(apis);
  if (getActiveApiName() === name) {
    const remaining = Object.keys(apis);
    setActiveApiName(remaining.length > 0 ? remaining[0] : null);
  }
  return apis;
}

export function getAllApis() {
  return loadApisFromStorage();
}
export function getActiveApi() {
  const name = getActiveApiName();
  if (!name) return null;
  const apis = loadApisFromStorage();
  if (!apis[name]) return null;
  return { name, ...apis[name] };
}
export function switchApi(name) {
  const apis = loadApisFromStorage();
  if (!apis[name]) throw new Error(`API "${name}" not found`);
  setActiveApiName(name);
  return apis[name];
}

export function recordApiUsage(apiName, requestCount = 1) {
  const quotas = loadDailyQuotas();
  const today = new Date().toDateString();
  const quotaKey = `${apiName}_${today}`;
  if (!quotas[quotaKey]) quotas[quotaKey] = { used: 0, resetTime: Date.now() + 86400000 };
  quotas[quotaKey].used += requestCount;
  saveDailyQuotas(quotas);
  return quotas[quotaKey];
}

export function getApiQuotaStatus(apiName) {
  if (!apiName) return null;
  const apis = loadApisFromStorage();
  const api = apis[apiName];
  if (!api) return null;
  const quotas = loadDailyQuotas();
  const today = new Date().toDateString();
  const quotaKey = `${apiName}_${today}`;
  let limit = 50;
  if (api.type === "ollama") limit = 999999;
  const used = quotas[quotaKey]?.used || 0;
  const remaining = Math.max(0, limit - used);
  const percentUsed = Math.round((used / limit) * 100);
  return {
    apiName,
    type: api.type,
    used,
    limit,
    remaining,
    percentUsed,
    resetTime: quotas[quotaKey]?.resetTime || null,
    isExhausted: used >= limit,
  };
}

async function sendToGemini(chatHistory, imageParts, apiKey) {
  const contents = chatHistory.map((item) => {
    const parts = [{ text: item.content }];
    if (item.role === "user" && imageParts.length > 0) parts.push(...imageParts);
    return { role: item.role === "user" ? "user" : "model", parts };
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents, system_instruction: { parts: [{ text: SYSTEM_PROMPT }] } }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => null);
    throw new Error(err?.error?.message || `Gemini API Error: ${response.status}`);
  }
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text)
    .filter(Boolean)
    .join("\n");

  if (!text) throw new Error("Gemini returned an empty response.");
  return text;
}

async function sendToOpenRouter(chatHistory, imageParts, apiKey) {
  const messages = [{ role: "system", content: SYSTEM_PROMPT }];
  const images = imageParts.map((part) => ({
    type: "image_url",
    image_url: { url: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}` },
  }));

  const chatContents = chatHistory.map((item, index) => {
    if (item.role === "user") {
      if (index === chatHistory.length - 1 && images.length > 0) {
        return { role: "user", content: [{ type: "text", text: item.content }, ...images] };
      }
      return { role: "user", content: item.content };
    }
    return { role: "assistant", content: item.content };
  });
  messages.push(...chatContents);

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://eeevaultjstu.vercel.app",
      "X-Title": "EEE Vault JSTU",
    },
    body: JSON.stringify({ model: "openrouter/free", messages, max_tokens: 2000 }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.error?.message || `OpenRouter Error: ${response.status}`);
  }
  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new Error("OpenRouter returned an empty response.");
  return text;
}

async function sendToOllama(chatHistory, imageParts, serverUrl) {
  const messages = [{ role: "system", content: SYSTEM_PROMPT }];
  const base64Images = imageParts.map((part) => part.inlineData.data);

  const chatContents = chatHistory.map((item) => {
    const msg = { role: item.role === "user" ? "user" : "assistant", content: item.content };
    if (item.role === "user" && base64Images.length > 0) msg.images = base64Images;
    return msg;
  });
  messages.push(...chatContents);

  const response = await fetch(`${serverUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "llama3.2-vision", messages, stream: false }),
  });

  if (!response.ok) throw new Error(`Ollama error: HTTP ${response.status}. Is the server running?`);
  const data = await response.json();
  const text = data?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new Error("Ollama returned an empty response.");
  return text;
}

export async function sendQueryToAI(chatHistory, imageParts) {
  const activeApi = getActiveApi();
  if (!activeApi) throw new Error("No AI provider configured. Add one in Settings.");
  const quotaStatus = getApiQuotaStatus(activeApi.name);
  if (quotaStatus.isExhausted) throw new Error(`Daily limit reached for "${activeApi.name}". Switch to another API.`);

  try {
    let response;
    if (activeApi.type === "gemini") response = await sendToGemini(chatHistory, imageParts, activeApi.key);
    else if (activeApi.type === "openrouter") response = await sendToOpenRouter(chatHistory, imageParts, activeApi.key);
    else if (activeApi.type === "ollama") response = await sendToOllama(chatHistory, imageParts, activeApi.key);
    else throw new Error(`Unknown API type: ${activeApi.type}`);

    recordApiUsage(activeApi.name, 1);
    return response;
  } catch (err) {
    const errMsg = err.message || err.toString();
    if (errMsg.includes("quota") || errMsg.includes("rate limit") || errMsg.includes("429")) {
      const quotas = loadDailyQuotas();
      const today = new Date().toDateString();
      quotas[`${activeApi.name}_${today}`] = { used: quotaStatus.limit, resetTime: Date.now() + 86400000 };
      saveDailyQuotas(quotas);
      throw new Error(`${activeApi.name} has hit its limit. Switch to another API.`);
    }
    throw err;
  }
}

export async function convertImageUrlToBase64(url) {
  const res = await fetch(
    `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ""))}&output=jpg&q=70`
  );
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
