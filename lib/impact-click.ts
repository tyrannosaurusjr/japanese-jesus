export const IMPACT_CLICK_ID_COOKIE_NAME = "jj_impact_click_id";

const IMPACT_CLICK_ID_QUERY_KEYS = ["irclickid", "im_ref", "impact_click_id", "clickid"] as const;
const MAX_IMPACT_CLICK_ID_LENGTH = 256;

export function sanitizeImpactClickId(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().replace(/[\r\n\t]/g, "");

  if (!normalized) {
    return null;
  }

  return normalized.slice(0, MAX_IMPACT_CLICK_ID_LENGTH);
}

export function getImpactClickIdFromSearch(search: string): string | null {
  const params = new URLSearchParams(search);

  for (const key of IMPACT_CLICK_ID_QUERY_KEYS) {
    const value = sanitizeImpactClickId(params.get(key));
    if (value) {
      return value;
    }
  }

  return null;
}

export function getImpactClickIdFromCookieString(cookieString: string): string | null {
  if (!cookieString) {
    return null;
  }

  for (const part of cookieString.split(";")) {
    const [rawName, ...rest] = part.split("=");
    if (!rawName) {
      continue;
    }

    if (rawName.trim() !== IMPACT_CLICK_ID_COOKIE_NAME) {
      continue;
    }

    const value = rest.join("=");
    if (!value) {
      return null;
    }

    try {
      return sanitizeImpactClickId(decodeURIComponent(value.trim()));
    } catch {
      return sanitizeImpactClickId(value.trim());
    }
  }

  return null;
}
