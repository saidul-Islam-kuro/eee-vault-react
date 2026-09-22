import { useEffect, useState } from "react";

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
        setCourseData(data.Course ? data.Course : Array.isArray(data) ? data : []);
        setLibraryData(data.Library ? data.Library : []);
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
