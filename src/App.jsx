import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Notes from "./pages/Notes";
import Library from "./pages/Library";
import ViewerPage from "./pages/ViewerPage";
import { VaultDataContext } from "./context/VaultDataContext";
import { useVaultData } from "./hooks/useVaultData";

export default function App() {
  const vaultData = useVaultData();

  return (
    <VaultDataContext.Provider value={vaultData}>
      <Routes>
        <Route path="/viewer/:code/:batch" element={<ViewerPage />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/library" element={<Library />} />
        </Route>
      </Routes>
    </VaultDataContext.Provider>
  );
}
