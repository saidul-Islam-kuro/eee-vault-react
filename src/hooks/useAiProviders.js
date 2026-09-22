import { useCallback, useState } from "react";
import * as ai from "../lib/aiProviders";

export function useAiProviders() {
  const [apis, setApis] = useState(() => ai.loadApisFromStorage());
  const [activeName, setActiveName] = useState(() => ai.getActiveApiName());

  const refresh = useCallback(() => {
    setApis(ai.loadApisFromStorage());
    setActiveName(ai.getActiveApiName());
  }, []);

  const addApi = useCallback(
    (name, type, key) => {
      ai.addApi(name, type, key);
      refresh();
    },
    [refresh]
  );

  const deleteApi = useCallback(
    (name) => {
      ai.deleteApi(name);
      refresh();
    },
    [refresh]
  );

  const switchApi = useCallback(
    (name) => {
      ai.switchApi(name);
      refresh();
    },
    [refresh]
  );

  const quotaStatus = activeName ? ai.getApiQuotaStatus(activeName) : null;

  return { apis, activeName, quotaStatus, addApi, deleteApi, switchApi, refresh };
}
