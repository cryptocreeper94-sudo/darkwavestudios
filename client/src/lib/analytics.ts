import { apiRequest } from "./queryClient";

const getVisitorId = (): string => {
  let visitorId = localStorage.getItem("dw_visitor_id");
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    localStorage.setItem("dw_visitor_id", visitorId);
  }
  return visitorId;
};

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem("dw_session_id");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem("dw_session_id", sessionId);
  }
  return sessionId;
};

const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let device = "desktop";
  if (/Mobile|Android|iPhone|iPad/.test(ua)) {
    device = /iPad/.test(ua) ? "tablet" : "mobile";
  }
  
  let browser = "unknown";
  if (ua.includes("Chrome")) browser = "Chrome";
  else if (ua.includes("Firefox")) browser = "Firefox";
  else if (ua.includes("Safari")) browser = "Safari";
  else if (ua.includes("Edge")) browser = "Edge";
  
  let os = "unknown";
  if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("Mac")) os = "Mac";
  else if (ua.includes("Linux")) os = "Linux";
  else if (ua.includes("Android")) os = "Android";
  else if (ua.includes("iOS") || ua.includes("iPhone")) os = "iOS";
  
  return { device, browser, os };
};

export const trackPageView = async (path: string, title?: string) => {
  try {
    const { device, browser, os } = getDeviceInfo();
    await apiRequest("POST", "/api/analytics/pageview", {
      path,
      title: title || document.title,
      referrer: document.referrer || null,
      userAgent: navigator.userAgent,
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      device,
      browser,
      os,
    });
  } catch (error) {
    console.debug("Analytics pageview failed:", error);
  }
};

export const trackEvent = async (
  name: string,
  category?: string,
  label?: string,
  value?: number,
  metadata?: Record<string, unknown>
) => {
  try {
    await apiRequest("POST", "/api/analytics/event", {
      name,
      category,
      label,
      value: value?.toString(),
      sessionId: getSessionId(),
      visitorId: getVisitorId(),
      path: window.location.pathname,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
  } catch (error) {
    console.debug("Analytics event failed:", error);
  }
};

export const trackConversion = (type: string, value?: number) => {
  trackEvent("conversion", "conversion", type, value);
};

export const trackCTA = (buttonName: string, location: string) => {
  trackEvent("cta_click", "engagement", buttonName, undefined, { location });
};

export const trackFormSubmit = (formName: string) => {
  trackEvent("form_submit", "conversion", formName);
};

export const trackScroll = (percentage: number) => {
  trackEvent("scroll_depth", "engagement", `${percentage}%`, percentage);
};
