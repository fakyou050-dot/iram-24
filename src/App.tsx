import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop";
import { RadioProvider, useRadio } from "./contexts/RadioContext";
import RadioSheet from "./components/radio/RadioSheet";
import MiniPlayer from "./components/radio/MiniPlayer";
import { startAutoFetch } from "./lib/autoFetch";

const NewsFeed = lazy(() => import("./components/NewsFeed"));
const ArticlePage = lazy(() => import("./pages/ArticlePage"));
const CategoriesPage = lazy(() => import("./pages/CategoriesPage"));
const Favorites = lazy(() => import("./pages/Favorites"));
const Settings = lazy(() => import("./pages/Settings"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const RadioPage = lazy(() => import("./pages/RadioPage"));
const RadioAdmin = lazy(() => import("./pages/RadioAdmin"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const PageLoader = () => (
  <div className="min-h-[40vh] flex items-center justify-center px-4 text-center text-muted-foreground" role="status" aria-live="polite">
    جاري تحميل المحتوى...
  </div>
);

const ThemeInit = () => {
  useEffect(() => {
    if (localStorage.getItem("eram_theme") === "light") {
      document.documentElement.classList.add("light");
    }
  }, []);
  return null;
};

const SPARedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const search = window.location.search;
    if (search.startsWith("?/")) {
      const path = search.slice(2).split("&")[0];
      const hash = window.location.hash;
      window.history.replaceState(null, "", window.location.pathname);
      navigate(`/${path}${hash}`, { replace: true });
    }
  }, [navigate]);

  return null;
};

const AutoFetchInit = () => {
  useEffect(() => {
    const cleanup = startAutoFetch(30 * 60 * 1000);
    return cleanup;
  }, []);
  return null;
};

const BodyPaddingForPlayer = () => {
  const { currentId, sheetOpen } = useRadio();

  useEffect(() => {
    if (currentId && !sheetOpen) document.body.classList.add("has-mini-player");
    else document.body.classList.remove("has-mini-player");

    return () => document.body.classList.remove("has-mini-player");
  }, [currentId, sheetOpen]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeInit />
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <AutoFetchInit />
        <RadioProvider>
          <a href="#main-content" className="skip-to-content">
            تخطي إلى المحتوى
          </a>
          <SPARedirect />
          <ScrollToTop />
          <BodyPaddingForPlayer />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<NewsFeed />} />
              <Route path="/article/:id" element={<ArticlePage />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin-dashboard-ERAM-SECURE/login" element={<AdminLogin />} />
              <Route path="/admin-dashboard-ERAM-SECURE" element={<AdminDashboard />} />
              <Route path="/radio" element={<RadioPage />} />
              <Route path="/radio/admin" element={<RadioAdmin />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <RadioSheet />
          <MiniPlayer />
        </RadioProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
