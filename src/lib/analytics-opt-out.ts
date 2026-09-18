import type { BeforeSendEvent } from '@vercel/analytics/next';

export const ANALYTICS_OPT_OUT_KEY = 'portfolio-analytics-opt-out';

/** Bound to the owner laptop so those visits stay out of Vercel Analytics. */
const OWNER_DEVICE_SIGNATURE = 'Win32|1920|1080|24|en-US|16|8|Europe/Amsterdam|0';

function getDeviceSignature(): string {
  if (typeof window === 'undefined') return '';
  const deviceMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  return [
    navigator.platform,
    String(screen.width),
    String(screen.height),
    String(screen.colorDepth),
    navigator.language,
    String(navigator.hardwareConcurrency),
    String(deviceMemory ?? ''),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    String(navigator.maxTouchPoints),
  ].join('|');
}

export function isOwnerDevice(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return getDeviceSignature() === OWNER_DEVICE_SIGNATURE;
  } catch {
    return false;
  }
}

export function isAnalyticsOptedOut(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ANALYTICS_OPT_OUT_KEY) === '1' || isOwnerDevice();
}

export function setAnalyticsOptOut(optOut: boolean): void {
  if (typeof window === 'undefined') return;
  if (optOut) {
    localStorage.setItem(ANALYTICS_OPT_OUT_KEY, '1');
  } else {
    localStorage.removeItem(ANALYTICS_OPT_OUT_KEY);
  }
}

export function bindOwnerAnalyticsOptOut(): void {
  if (typeof window === 'undefined') return;
  if (isOwnerDevice()) {
    localStorage.setItem(ANALYTICS_OPT_OUT_KEY, '1');
  }
}

export function analyticsBeforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  if (process.env.NODE_ENV === 'development') return null;
  if (typeof window !== 'undefined' && isAnalyticsOptedOut()) {
    return null;
  }
  return event;
}
