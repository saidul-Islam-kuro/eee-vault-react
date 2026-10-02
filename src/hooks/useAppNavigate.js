import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useAppNavigate() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return useCallback(
    (to, options = {}) => {
      if (typeof to === "number") {
        navigate(to);
        return;
      }

      const targetPath = typeof to === "string" ? to.split(/[?#]/, 1)[0] : to.pathname;
      if (targetPath === pathname) return;

      if (targetPath === "/" && pathname !== "/") {
        if ((window.history.state?.idx ?? 0) > 0) {
          navigate(-1);
        } else {
          navigate("/", { replace: true });
        }
        return;
      }

      navigate(to, {
        ...options,
        replace: options.replace ?? pathname !== "/",
      });
    },
    [navigate, pathname]
  );
}
