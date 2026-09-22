import { createContext, useContext } from "react";

export const VaultDataContext = createContext({ courseData: [], libraryData: [], status: "loading" });

export function useVaultDataContext() {
  return useContext(VaultDataContext);
}
