"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  getImpactClickIdFromSearch,
  IMPACT_CLICK_ID_COOKIE_NAME,
} from "@/lib/impact-click";

const HIDDEN_ARG_PATHS = new Set(["/the-gate", "/axis", "/thin-place"]);
const IMPACT_CLICK_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 120;

function writeImpactClickCookie(clickId: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie =
    `${IMPACT_CLICK_ID_COOKIE_NAME}=${encodeURIComponent(clickId)}; Path=/; ` +
    `Max-Age=${IMPACT_CLICK_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

export function ImpactClickCapture() {
  const pathname = usePathname();

  useEffect(() => {
    if (HIDDEN_ARG_PATHS.has(pathname)) {
      return;
    }

    const clickId = getImpactClickIdFromSearch(window.location.search);
    if (!clickId) {
      return;
    }

    writeImpactClickCookie(clickId);
  }, [pathname]);

  return null;
}
