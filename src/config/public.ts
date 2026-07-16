const DEFAULT_SUPABASE_URL = "https://zifhmbbhqgoqvqeofhtw.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppZmhtYmJocWdvcXZxZW9maHR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM4NzIzOTIsImV4cCI6MjA5OTQ0ODM5Mn0.sbth2PRkMOXS1tEyIXujYcpfiMabltLZAcR_1B35BZ8";
const DEFAULT_SITE_URL = "https://iram-24.vercel.app";

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");
const ensureLeadingSlash = (value: string) => (value.startsWith("/") ? value : `/${value}`);
const ensureTrailingSlash = (value: string) => (value.endsWith("/") ? value : `${value}/`);

const resolveSiteUrl = () => {
  const fromEnv = import.meta.env.VITE_SITE_URL?.trim();
  if (fromEnv) return trimTrailingSlash(fromEnv);
  if (typeof window !== "undefined" && window.location?.origin) {
    return trimTrailingSlash(window.location.origin);
  }
  return DEFAULT_SITE_URL;
};

export const PUBLIC_ENV = {
  siteUrl: resolveSiteUrl(),
  supabaseUrl: trimTrailingSlash(import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL),
  supabasePublishableKey:
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY,
  basePath: ensureTrailingSlash(ensureLeadingSlash(import.meta.env.VITE_APP_BASE_PATH || import.meta.env.BASE_URL || "/")),
};

export const toAbsoluteSiteUrl = (path = "/") => {
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;
  return new URL(normalizedPath, `${PUBLIC_ENV.siteUrl}/`).toString();
};
