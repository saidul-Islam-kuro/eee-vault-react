import { useEffect, useLayoutEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Vault from "./pages/Vault";
import Notes from "./pages/Notes";
import Library from "./pages/Library";
import VideosPage from "./pages/Videos";
import ViewerPage from "./pages/ViewerPage";
import DeveloperProfile from "./pages/DeveloperProfile";
import BehindTheApp from "./pages/BehindTheApp";
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

function getPageScrollTop() {
  return document.body.scrollTop || document.documentElement.scrollTop;
}

function RouteScrollManager() {
  const { pathname } = useLocation();
  const activePath = useRef(pathname);
  const latestScroll = useRef(0);

  useLayoutEffect(() => {
    const scrollKey = (path) => `eee-vault:scroll:${path}`;
    const previousPath = activePath.current;
    const currentScroll = getPageScrollTop();

    if (previousPath !== pathname) {
      sessionStorage.setItem(scrollKey(previousPath), String(latestScroll.current || currentScroll));
    }

    activePath.current = pathname;
    const storedScroll = sessionStorage.getItem(scrollKey(pathname));
    const legacyVaultScroll = pathname === "/vault" ? sessionStorage.getItem("vaultScroll") : null;
    const savedScroll = Number(storedScroll ?? legacyVaultScroll ?? 0);
    const restoredScroll = Number.isFinite(savedScroll) ? savedScroll : 0;

    latestScroll.current = restoredScroll;
    document.body.scrollTop = restoredScroll;
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = getPageScrollTop();
      latestScroll.current = scrollTop;
      sessionStorage.setItem(`eee-vault:scroll:${activePath.current}`, String(scrollTop));
    };

    document.body.addEventListener("scroll", handleScroll, { passive: true });
    return () => document.body.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
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
      <RouteScrollManager />
      <Routes>
        <Route path="/admin" element={<AdminRedirect />} />
        <Route path="/admin/*" element={<AdminRedirect />} />
        <Route path="/viewer/:code/:batch" element={<ViewerPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/behind-the-app" element={<BehindTheApp />} />
          <Route path="/developer" element={<DeveloperProfile />} />
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
