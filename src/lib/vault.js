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

export function triggerDownload(url, fileName) {
  if (!url) return;

  const safeName = (fileName || "download.pdf").replace(/[\\/:*?"<>|]+/g, "_");

  const triggerAnchor = (targetUrl) => {
    const a = document.createElement("a");
    a.href = targetUrl;
    a.download = safeName;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);

    try {
      a.click();
    } catch {
      // no-op
    }

    setTimeout(() => {
      try {
        document.body.removeChild(a);
      } catch {
        // no-op
      }
    }, 1200);
  };

  const isRemoteAsset = /^https?:\/\//i.test(url);

  if (isRemoteAsset) {
    fetch(url, { mode: "cors", credentials: "omit" })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Download request failed: ${response.status}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = URL.createObjectURL(blob);
        triggerAnchor(blobUrl);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
      })
      .catch(() => {
        const fallback = document.createElement("a");
        fallback.href = url;
        fallback.download = safeName;
        fallback.target = "_blank";
        fallback.rel = "noopener";
        fallback.style.display = "none";
        document.body.appendChild(fallback);
        try {
          fallback.click();
        } catch {
          window.location.href = url;
        }
        setTimeout(() => {
          try {
            document.body.removeChild(fallback);
          } catch {
            // no-op
          }
        }, 1200);
      });
    return;
  }

  triggerAnchor(url);
}
