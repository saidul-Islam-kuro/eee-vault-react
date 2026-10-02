import { normalizeGitHubBlobUrl } from "./vault.js";

export async function fetchPublicPdf(url, { signal } = {}) {
  const rawUrl = normalizeGitHubBlobUrl(url);
  let response;
  try {
    response = await fetch(rawUrl, { mode: "cors", credentials: "omit", signal });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error("The public file couldn't be fetched (network or browser CORS restriction).");
  }

  if (!response.ok) {
    throw new Error(`The public file request failed with status ${response.status}.`);
  }
  if (/text\/html/i.test(response.headers.get("content-type") || "")) {
    throw new Error("GitHub returned a web page instead of a PDF file.");
  }

  const bytes = await response.arrayBuffer();
  const header = new TextDecoder().decode(bytes.slice(0, 1024));
  if (!header.includes("%PDF-")) {
    throw new Error("The downloaded content isn't a valid PDF file.");
  }
  return new Blob([bytes], { type: "application/pdf" });
}
