"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/routing";

interface TrackerData {
  sessionId: string;
  path: string;
  referrer: string;
  device: string;
  browser: string;
  os: string;
  isOrganic: boolean;
}

export function VisitorTracker() {
  const pathname = usePathname();
  const startTime = useRef<number>(0);

  useEffect(() => {
    // Solo clientes browser
    if (typeof window === "undefined") return;

    // Generar o recuperar sessionId
    let sessionId = sessionStorage.getItem("visitor_sid");
    if (!sessionId) {
      // Fallback for older browsers without crypto.randomUUID
      sessionId = typeof crypto !== 'undefined' && crypto.randomUUID 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem("visitor_sid", sessionId);
    }

    startTime.current = Date.now();
    const referrer = document.referrer || "";

    // Determinar dispositivo (simplificado)
    const ua = navigator.userAgent;
    let device = "desktop";
    if (/mobile/i.test(ua)) device = "mobile";
    if (/ipad|tablet/i.test(ua)) device = "tablet";

    // Navegador (simplificado)
    let browser = "Others";
    if (/chrome|crios|crmo/i.test(ua)) browser = "Chrome";
    else if (/firefox|iceweasel|fxios/i.test(ua)) browser = "Firefox";
    else if (/safari/i.test(ua)) browser = "Safari";
    else if (/edg/i.test(ua)) browser = "Edge";

    // OS (simplificado)
    let os = "Unknown";
    if (/win/i.test(ua)) os = "Windows";
    else if (/mac/i.test(ua)) os = "MacOS";
    else if (/android/i.test(ua)) os = "Android";
    else if (/ios|iphone|ipad/i.test(ua)) os = "iOS";

    // Determinar si es orgánico
    const isOrganic = !referrer || /google|bing|yahoo|duckduckgo/i.test(referrer);

    const data: TrackerData = {
      sessionId: sessionId as string,
      path: pathname,
      referrer,
      device,
      browser,
      os,
      isOrganic,
    };

    // Tracking page view (fire-and-forget)
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview", ...data }),
      keepalive: true,
    }).catch(() => {
      // Ignorar fallos de red silenciosamente
    });

    // Reportar tiempo de la sesión anterior al desmontar (o cambiar de página)
    return () => {
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      if (duration > 0) {
        fetch("/api/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "session_end", sessionId, path: pathname, duration }),
          keepalive: true,
        }).catch(() => {});
      }
    };
  }, [pathname]);

  return null;
}
