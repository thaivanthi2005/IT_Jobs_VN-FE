"use client";

import { useEffect, useRef } from "react";
import { TURNSTILE_SITE_KEY } from "@/config/variable";

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  resetSignal?: number;
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback"?: (code?: string) => void;
          "expired-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "flexible" | "compact";
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_ID = "cf-turnstile-script";

function loadTurnstileScript(callback: () => void) {
  if (typeof window === "undefined") return;

  if (window.turnstile) {
    callback();
    return;
  }

  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  if (window.turnstile) {
    callback();
    return;
  }

  script.addEventListener("load", () => {
    const checkTurnstile = setInterval(() => {
      if (window.turnstile) {
        clearInterval(checkTurnstile);
        callback();
      }
    }, 50);
    setTimeout(() => clearInterval(checkTurnstile), 3000);
  });
}

/**
 * Cloudflare Turnstile Captcha Widget
 * Hiển thị checkbox xác thực người dùng mượt mà, bảo vệ form đăng ký.
 */
export const TurnstileWidget = ({
  onVerify,
  onExpire,
  onError,
  resetSignal = 0,
  className = "",
}: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadTurnstileScript(() => {
      if (!isMounted || !containerRef.current || !window.turnstile) return;

      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => {
            if (isMounted) onVerify(token);
          },
          "expired-callback": () => {
            if (isMounted) onExpire?.();
          },
          "error-callback": () => {
            if (isMounted) onError?.();
          },
          theme: "auto",
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.error("[Turnstile] Render error:", err);
      }
    });

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, [onVerify, onExpire, onError]);

  // Lắng nghe tín hiệu reset widget (khi đăng ký thất bại)
  useEffect(() => {
    if (resetSignal > 0 && widgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetIdRef.current);
      } catch {}
    }
  }, [resetSignal]);

  return (
    <div className={`flex justify-center my-3 ${className}`}>
      <div ref={containerRef} className="min-h-[65px] flex items-center justify-center" />
    </div>
  );
};

