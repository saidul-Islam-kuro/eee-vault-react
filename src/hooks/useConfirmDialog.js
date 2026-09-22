import { useCallback, useState } from "react";

export function useConfirmDialog() {
  const [config, setConfig] = useState(null); // { icon, title, message, confirmLabel, confirmTone, onConfirm }

  const ask = useCallback((cfg) => setConfig(cfg), []);
  const close = useCallback(() => setConfig(null), []);
  const confirm = useCallback(() => {
    config?.onConfirm?.();
    setConfig(null);
  }, [config]);

  return { open: !!config, config, ask, close, confirm };
}
