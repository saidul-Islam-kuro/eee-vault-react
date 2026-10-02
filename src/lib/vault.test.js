import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { normalizeVaultData } from "../hooks/useVaultData.js";
import {
  isPdfDocumentUrl,
  normalizeGitHubBlobUrl,
  pdfDownloadFileName,
  proxiedImage,
  sanitizeDownloadFileName,
  triggerDownload,
} from "./vault.js";
import { compilePagesToPdf } from "./pdfCompile.js";
import { fetchPublicPdf } from "./pdfAsset.js";

const originalWindow = globalThis.window;
const originalDocument = globalThis.document;
const originalFetch = globalThis.fetch;
const originalSetTimeout = globalThis.setTimeout;
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;
const originalConsoleError = console.error;

afterEach(() => {
  globalThis.window = originalWindow;
  globalThis.document = originalDocument;
  globalThis.fetch = originalFetch;
  globalThis.setTimeout = originalSetTimeout;
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
  console.error = originalConsoleError;
});

function createMockDocument() {
  const elements = [];
  return {
    elements,
    title: "",
    body: {
      style: {},
      appendChild: (element) => elements.push(element),
      append: (...children) => elements.push(...children),
      replaceChildren: () => { elements.length = 0; },
    },
    createElement: (tagName) => {
      const element = {
        tagName,
        style: {},
        children: [],
        append: (...children) => element.children.push(...children),
        click: () => { element.wasClicked = true; },
        remove: () => {},
      };
      elements.push(element);
      return element;
    },
  };
}

function mockDownloadResponse() {
  return {
    ok: true,
    headers: { get: () => "application/pdf" },
    blob: async () => new Blob(["pdf bytes"], { type: "application/pdf" }),
  };
}

test("normalizes GitHub blob URLs without changing unrelated URLs", () => {
  assert.equal(
    normalizeGitHubBlobUrl("https://github.com/example/vault/blob/main/pages/p%201.png?raw=1"),
    "https://raw.githubusercontent.com/example/vault/main/pages/p%201.png?raw=1"
  );
  assert.equal(
    normalizeGitHubBlobUrl("https://github.com/example/vault/blob/refs/heads/main/notes/file.pdf"),
    "https://raw.githubusercontent.com/example/vault/main/notes/file.pdf"
  );
  assert.equal(
    normalizeGitHubBlobUrl("https://github.com/example/vault/blob/main"),
    "https://github.com/example/vault/blob/main"
  );
  assert.equal(
    normalizeGitHubBlobUrl("https://raw.githubusercontent.com/example/vault/main/file.png"),
    "https://raw.githubusercontent.com/example/vault/main/file.png"
  );
});

test("normalizes image and PDF URLs in course links, notes, and library data", () => {
  const { courseData, libraryData } = normalizeVaultData({
    Course: [{
      links: {
        images: ["https://github.com/example/vault/blob/main/page.png"],
        pdf: "https://github.com/example/vault/blob/main/paper.pdf",
      },
      notes: [{ name: "Note", url: "https://github.com/example/vault/blob/main/note.pdf" }],
    }],
    Library: [{ title: "Book", url: "https://github.com/example/vault/blob/main/book.pdf" }],
  });

  assert.deepEqual(courseData[0].links, {
    images: ["https://raw.githubusercontent.com/example/vault/main/page.png"],
    pdf: "https://raw.githubusercontent.com/example/vault/main/paper.pdf",
  });
  assert.equal(courseData[0].notes[0].url, "https://raw.githubusercontent.com/example/vault/main/note.pdf");
  assert.equal(libraryData[0].url, "https://raw.githubusercontent.com/example/vault/main/book.pdf");
});

test("detects PDF paths and creates browser-safe download names", () => {
  assert.equal(isPdfDocumentUrl("https://example.test/file%20name.PDF?download=1"), true);
  assert.equal(isPdfDocumentUrl("https://example.test/image.png"), false);
  assert.equal(sanitizeDownloadFileName("Bad:/ name?.pdf"), "Bad_ name_.pdf");
  assert.equal(sanitizeDownloadFileName("..."), "download");
  assert.equal(sanitizeDownloadFileName("CON"), "_CON");
  assert.equal(pdfDownloadFileName("Note.pdf"), "Note.pdf");
  assert.equal(pdfDownloadFileName("Note"), "Note.pdf");
  assert.match(
    decodeURIComponent(proxiedImage("https://github.com/example/vault/blob/main/page.png")),
    /raw\.githubusercontent\.com\/example\/vault\/main\/page\.png/
  );
});

test("rejects PDF pages from image-only PDF compilation with an actionable error", async () => {
  await assert.rejects(
    compilePagesToPdf(["https://raw.githubusercontent.com/example/vault/main/paper.pdf"], "paper"),
    /image pages only/
  );
});

test("fetches a public PDF as a same-origin embeddable PDF blob", async () => {
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, options };
    return {
      ok: true,
      headers: { get: () => "application/octet-stream" },
      arrayBuffer: async () => new TextEncoder().encode("%PDF-1.7\nbody").buffer,
    };
  };

  const pdfBlob = await fetchPublicPdf("https://github.com/example/vault/blob/main/paper.pdf");
  assert.equal(request.url, "https://raw.githubusercontent.com/example/vault/main/paper.pdf");
  assert.equal(request.options.mode, "cors");
  assert.equal(request.options.credentials, "omit");
  assert.equal(pdfBlob.type, "application/pdf");
  assert.match(await pdfBlob.text(), /^%PDF-1\.7/);
});

test("reports CORS/network download errors without redirecting to a web page", async () => {
  let clicked = false;
  const alerts = [];
  const anchors = [];
  let fetchedUrl;
  console.error = () => {};
  globalThis.window = {
    navigator: { userAgent: "Desktop", platform: "Win32" },
    alert: (message) => alerts.push(message),
  };
  globalThis.document = {
    body: { appendChild: (anchor) => anchors.push(anchor) },
    createElement: () => ({
      style: {},
      click: () => { clicked = true; },
      remove: () => {},
    }),
  };
  globalThis.fetch = async (url) => {
    fetchedUrl = url;
    throw new TypeError("Failed to fetch");
  };

  const success = await triggerDownload("https://github.com/example/vault/blob/main/book.pdf", "book.pdf");
  assert.equal(success, false);
  assert.equal(anchors.length, 0);
  assert.equal(clicked, false);
  assert.equal(fetchedUrl, "https://raw.githubusercontent.com/example/vault/main/book.pdf");
  assert.match(alerts[0], /network or browser CORS restriction/i);
});

test("surfaces invalid document paths instead of treating titles as relative downloads", async () => {
  const alerts = [];
  let clicked = false;
  globalThis.window = {
    navigator: { userAgent: "Desktop", platform: "Win32" },
    alert: (message) => alerts.push(message),
  };
  globalThis.document = {
    body: { appendChild: () => {} },
    createElement: () => ({ style: {}, click: () => { clicked = true; }, remove: () => {} }),
  };
  globalThis.fetch = async () => {
    throw new Error("A plain title must not be fetched");
  };

  assert.equal(await triggerDownload("Digital Communication Systems", "Digital Communication Systems.pdf"), false);
  assert.equal(clicked, false);
  assert.match(alerts[0], /isn't a valid PDF or image URL/i);
});

test("starts named downloads on desktop and prepares a tap-to-download page on iOS", async () => {
  const doc = createMockDocument();
  const iosDoc = createMockDocument();
  const iosWindow = { document: iosDoc, close: () => {} };
  const fetched = [];
  globalThis.document = doc;
  globalThis.window = {
    navigator: { userAgent: "Desktop", platform: "Win32" },
    alert: () => {},
    open: () => iosWindow,
  };
  globalThis.fetch = async (url) => {
    fetched.push(url);
    return mockDownloadResponse();
  };
  URL.createObjectURL = () => "blob:test-file";
  URL.revokeObjectURL = () => {};
  globalThis.setTimeout = () => 0;

  const desktopSuccess = await triggerDownload("https://raw.githubusercontent.com/example/vault/main/book.pdf", "Book:/One.pdf");
  assert.equal(desktopSuccess, true);
  const desktopAnchor = doc.elements.find((element) => element.tagName === "a");
  assert.equal(desktopAnchor.href, "blob:test-file");
  assert.equal(desktopAnchor.download, "Book_One.pdf");
  assert.equal(desktopAnchor.wasClicked, true);

  globalThis.window.navigator.userAgent = "Mozilla/5.0 (iPhone)";
  const iosSuccess = await triggerDownload("https://raw.githubusercontent.com/example/vault/main/book.pdf", "Book.pdf");
  assert.equal(iosSuccess, true);
  assert.ok(iosDoc.elements.some((element) => element.download === "Book.pdf"));
  assert.equal(iosDoc.elements.some((element) => element.wasClicked), false);
  assert.equal(fetched.length, 2);
});
