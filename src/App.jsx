import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Vault from "./pages/Vault";
import Notes from "./pages/Notes";
import Library from "./pages/Library";
import VideosPage from "./pages/Videos";
import ViewerPage from "./pages/ViewerPage";
import { VaultDataContext } from "./context/VaultDataContext";
import { useVaultData } from "./hooks/useVaultData";

function AdminRedirect() {
  useEffect(() => {
    window.location.replace("/admin/index.html");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-semibold text-slate-600">
      Loading CMS…
    </div>
  );
}

export default function App() {
  const vaultData = useVaultData();

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <VaultDataContext.Provider value={vaultData}>
      <Routes>
        <Route path="/admin" element={<AdminRedirect />} />
        <Route path="/admin/*" element={<AdminRedirect />} />
        <Route path="/viewer/:code/:batch" element={<ViewerPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/vault" element={<Vault />} />
          <Route path="/videos" element={<VideosPage />} />
          <Route path="/videos/:courseCode" element={<VideosPage />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/library" element={<Library />} />
        </Route>
      </Routes>
    </VaultDataContext.Provider>
  );
}
