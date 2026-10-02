import { useEffect, useState } from "react";
import { normalizeGitHubBlobUrl } from "../lib/vault";

function normalizeDocumentUrl(url) {
  return normalizeGitHubBlobUrl(url);
}

function normalizeCourseDocuments(courses) {
  return courses.map((course) => {
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
  });
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
        const courses = data.Course ? data.Course : Array.isArray(data) ? data : [];
        setCourseData(normalizeCourseDocuments(courses));
        setLibraryData(
          Array.isArray(data.Library)
            ? data.Library.map((book) => ({ ...book, url: normalizeDocumentUrl(book.url) }))
            : []
        );
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
