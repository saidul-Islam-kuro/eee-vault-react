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
  return `https://images.weserv.nl/?url=${encodeURIComponent(url.replace(/^https?:\/\//, ""))}&output=jpg&q=${quality}`;
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

  if (url.hostname !== "github.com") return value;

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

  return `https://raw.githubusercontent.com/${owner}/${repository.replace(/\.git$/i, "")}/${branch}/${path.join("/")}`;
}

export async function triggerDownload(url, fileName) {
  if (!url) {
    window.alert("This file doesn't have a download URL.");
    return false;
  }

  const safeName = (fileName || "download.pdf").replace(/[\\/:*?"<>|]+/g, "_");
  const downloadUrl = normalizeGitHubBlobUrl(url);

  const triggerAnchor = (targetUrl) => {
    const a = document.createElement("a");
    a.href = targetUrl;
    a.download = safeName;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
    }, 1200);
  };

  const isRemoteAsset = /^https?:\/\//i.test(downloadUrl);

  if (isRemoteAsset) {
    try {
      const response = await fetch(downloadUrl, { mode: "cors", credentials: "omit" });
      if (!response.ok) {
        throw new Error(`Download request failed: ${response.status}`);
      }
      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("The downloaded file was empty.");
      }
      const blobUrl = URL.createObjectURL(blob);
      triggerAnchor(blobUrl);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
      return true;
    } catch (error) {
      console.error("Document download failed.", error);
      window.alert("Couldn't download this file. Make sure the GitHub repository is public and try again.");
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
