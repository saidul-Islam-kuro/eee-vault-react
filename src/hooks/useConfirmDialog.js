import { useCallback, useState } from "react";

export function useConfirmDialog() {
  const [config, setConfig] = useState(null); // { icon, title, message, confirmLabel, confirmTone, onConfirm }

  const ask = useCallback((cfg) => setConfig(cfg), []);
  const close = useCallback(() => setConfig(null), []);
  const confirm = useCallback(() => {
    const pending = config;
    setConfig(null);

    if (typeof pending?.onConfirm === "function") {
      Promise.resolve()
        .then(() => pending.onConfirm());
    }
  }, [config]);

  return { open: !!config, config, ask, close, confirm };
}
