import { useEffect, useState } from "react";
import { normalizeGitHubBlobUrl } from "../lib/vault.js";

export function normalizeDocumentUrl(url) {
  return normalizeGitHubBlobUrl(url);
}

export function normalizeVaultData(data) {
  const source = data || {};
  const courses = source.Course ? source.Course : Array.isArray(source) ? source : [];
  return {
    courseData: courses.map((course) => {
      return {
        ...course,
        ...(course.links && typeof course.links === "object"
          ? {
              links: Object.fromEntries(
                Object.entries(course.links).map(([session, links]) => [
                  session,
                  Array.isArray(links) ? links.map(normalizeDocumentUrl) : normalizeDocumentUrl(links),
                ])
              ),
            }
          : {}),
        ...(Array.isArray(course.notes)
          ? { notes: course.notes.map((note) => ({ ...note, url: normalizeDocumentUrl(note.url) })) }
          : {}),
      };
    }),
    libraryData: Array.isArray(source.Library)
      ? source.Library.map((book) => ({ ...book, url: normalizeDocumentUrl(book.url) }))
      : [],
  };
}

export function useVaultData() {
  const [courseData, setCourseData] = useState([]);
  const [libraryData, setLibraryData] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/data.json?t=${Date.now()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        const normalized = normalizeVaultData(data);
        setCourseData(normalized.courseData);
        setLibraryData(normalized.libraryData);
        setStatus("ready");
      } catch (err) {
        console.error("Data load failed", err);
        if (!cancelled) setStatus("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { courseData, libraryData, status };
}
