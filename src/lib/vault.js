export const SEMESTERS = [
  { label: "All Semesters", value: "all" },
  { label: "1st Year 1st Sem", value: "1st Year 1st Semester" },
  { label: "1st Year 2nd Sem", value: "1st Year 2nd Semester" },
  { label: "2nd Year 1st Sem", value: "2nd Year 1st Semester" },
  { label: "2nd Year 2nd Sem", value: "2nd Year 2nd Semester" },
  { label: "3rd Year 1st Sem", value: "3rd Year 1st Semester" },
  { label: "3rd Year 2nd Sem", value: "3rd Year 2nd Semester" },
  { label: "4th Year 1st Sem", value: "4th Year 1st Semester" },
  { label: "4th Year 2nd Sem", value: "4th Year 2nd Semester" },
];

export const BATCHES = ["20-21", "21-22", "22-23", "23-24", "24-25"];

export function isMissingLink(link) {
  return !link || (Array.isArray(link) && link.length === 0) || link === "missing";
}

// Proxies any image (incl. GitHub raw) through images.weserv.nl so we can
// normalize format/quality for the PDF compiler and AI vision calls.
export function proxiedImage(url, { quality = 80 } = {}) {
  const imageUrl = normalizeGitHubBlobUrl(url);
  return `https://images.weserv.nl/?url=${encodeURIComponent(imageUrl.replace(/^https?:\/\//, ""))}&output=jpg&q=${quality}`;
}

export function slugify(str) {
  return encodeURIComponent(str);
}

export function getCourseId(course) {
  return course.id || course.code;
}

export function normalizeGitHubBlobUrl(value) {
  if (typeof value !== "string") return value;

  let url;
  try {
    url = new URL(value);
  } catch {
    return value;
  }

  if (!["github.com", "www.github.com"].includes(url.hostname.toLowerCase())) return value;

  const segments = url.pathname.split("/");
  if (segments[3] !== "blob") return value;

  const [owner, repository] = segments.slice(1, 3);
  const filePath = segments.slice(4);
  if (!owner || !repository || filePath.length < 2) return value;

  let branch;
  let path;
  if (filePath[0] === "refs" && filePath[1] === "heads" && filePath.length >= 4) {
    branch = filePath[2];
    path = filePath.slice(3);
  } else {
    [branch, ...path] = filePath;
  }

  if (!branch || path.length === 0) return value;

  return `https://raw.githubusercontent.com/${owner}/${repository.replace(/\.git$/i, "")}/${branch}/${path.join("/")}${url.search}`;
}

export function isPdfDocumentUrl(value) {
  if (typeof value !== "string") return false;

  try {
    return decodeURIComponent(value.split(/[?#]/, 1)[0]).toLowerCase().endsWith(".pdf");
  } catch {
    return value.split(/[?#]/, 1)[0].toLowerCase().endsWith(".pdf");
  }
}

export function sanitizeDownloadFileName(value, fallback = "download") {
  let fileName = Array.from(String(value || fallback))
    .filter((character) => character.charCodeAt(0) >= 32)
    .join("")
    .replace(/[\\/:*?"<>|]+/g, "_")
    .replace(/[. ]+$/g, "")
    .trim();
  if (!fileName) return fallback;
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(fileName)) fileName = `_${fileName}`;
  return fileName;
}

export function pdfDownloadFileName(value) {
  const fileName = sanitizeDownloadFileName(value, "download");
  return /\.pdf$/i.test(fileName) ? fileName : `${fileName}.pdf`;
}

function isIOSBrowser() {
  const userAgent = window.navigator?.userAgent || "";
  const platform = window.navigator?.platform || "";
  return /iPad|iPhone|iPod/i.test(userAgent) || (platform === "MacIntel" && window.navigator?.maxTouchPoints > 1);
}

function createIOSDownloadPage(fileName) {
  const downloadWindow = window.open("", "_blank");
  if (!downloadWindow) return null;

  const doc = downloadWindow.document;
  doc.title = `Preparing ${fileName}`;
  doc.body.textContent = `Preparing ${fileName}…`;
  return downloadWindow;
}

function renderIOSDownloadPage(downloadWindow, blobUrl, fileName) {
  const doc = downloadWindow.document;
  doc.title = fileName;
  doc.body.replaceChildren();
  doc.body.style.cssText = "font: 16px system-ui,sans-serif; padding: 24px; color: #171717;";

  const heading = doc.createElement("h1");
  heading.textContent = "Your file is ready";
  heading.style.fontSize = "20px";

  const description = doc.createElement("p");
  description.textContent = `Tap below to save ${fileName}. If a preview opens, use Share → Save to Files.`;

  const downloadLink = doc.createElement("a");
  downloadLink.href = blobUrl;
  downloadLink.download = fileName;
  downloadLink.textContent = `Download ${fileName}`;
  downloadLink.style.cssText = "display: inline-block; padding: 12px 16px; background: #b91c1c; color: white; border-radius: 10px; text-decoration: none; font-weight: 700;";

  const previewLink = doc.createElement("p");
  const preview = doc.createElement("a");
  preview.href = blobUrl;
  preview.target = "_blank";
  preview.rel = "noopener";
  preview.textContent = "Open file preview";
  previewLink.append(preview);

  doc.body.append(heading, description, downloadLink, previewLink);
}

export async function triggerDownload(url, fileName) {
  if (!url) {
    window.alert("This file doesn't have a download URL.");
    return false;
  }

  const safeName = sanitizeDownloadFileName(fileName, "download.pdf");
  const downloadUrl = normalizeGitHubBlobUrl(url);
  const isRemoteAsset = /^https?:\/\//i.test(downloadUrl);
  const hasSupportedFileExtension = /\.(?:pdf|png|jpe?g|webp|gif)(?:[?#]|$)/i.test(downloadUrl);
  const isLocalAsset = !/^[a-z][a-z\d+.-]*:/i.test(downloadUrl) && hasSupportedFileExtension;
  if (!isRemoteAsset && !isLocalAsset) {
    window.alert("This file link isn't a valid PDF or image URL. Please ask an admin to check it.");
    return false;
  }

  const triggerAnchor = (targetUrl, targetDocument = document) => {
    const a = targetDocument.createElement("a");
    a.href = targetUrl;
    a.download = safeName;
    a.rel = "noopener";
    a.style.display = "none";
    targetDocument.body.appendChild(a);
    a.click();
    setTimeout(() => {
      a.remove();
    }, 1200);
  };

  if (isRemoteAsset) {
    const iosDownloadWindow = isIOSBrowser() ? createIOSDownloadPage(safeName) : null;
    if (isIOSBrowser() && !iosDownloadWindow) {
      window.alert("Allow pop-ups for this site and try the download again.");
      return false;
    }

    try {
      const response = await fetch(downloadUrl, { mode: "cors", credentials: "omit" });
      if (!response.ok) {
        throw new Error(`Download request failed: ${response.status}`);
      }
      if (/text\/html/i.test(response.headers.get("content-type") || "")) {
        throw new Error("The server returned a web page instead of the requested file.");
      }
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("The downloaded file was empty.");
      }
      const blobUrl = URL.createObjectURL(blob);
      if (iosDownloadWindow) {
        renderIOSDownloadPage(iosDownloadWindow, blobUrl, safeName);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 5 * 60_000);
      } else {
        triggerAnchor(blobUrl);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      }
      return true;
    } catch (error) {
      iosDownloadWindow?.close();
      console.error("Document download failed.", error);
      const detail = error instanceof TypeError
        ? "The public file couldn't be fetched (network or browser CORS restriction)."
        : error.message;
      window.alert(`Couldn't download this file. ${detail} Check that the GitHub repository is public and try again.`);
      return false;
    }
  }

  try {
    triggerAnchor(downloadUrl);
    return true;
  } catch (error) {
    console.error("Document download failed.", error);
    window.alert("Couldn't start the download. Please try again.");
    return false;
  }
}
