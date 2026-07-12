import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ScrollToTop from "./components/ScrollToTop";
import NewsFeed from "./components/NewsFeed";
import ArticlePage from "./pages/ArticlePage";
import CategoriesPage from "./pages/CategoriesPage";
import Favorites from "./pages/Favorites";
import Settings from "./pages/Settings";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import RadioPage from "./pages/RadioPage";
import RadioAdmin from "./pages/RadioAdmin";
import NotFound from "./pages/NotFound";
import { RadioProvider, useRadio } from "./contexts/RadioContext";
import RadioSheet from "./components/radio/RadioSheet";
import MiniPlayer from "./components/radio/MiniPlayer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

const ThemeInit = () => {
  useEffect(() => {
    if (localStorage.getItem("eram_theme") === "light") {
      document.documentElement.classList.add("light");
    }
  }, []);
  return null;
};

// Handle SPA redirect from 404.html (GitHub Pages)
const SPARedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const search = window.location.search;
    if (search.startsWith("?/")) {
      const path = search.slice(2).split("&")[0];
      const hash = window.location.hash;
      window.history.replaceState(null, "", window.location.pathname);
      navigate("/" + path + hash, { replace: true });
    }
  }, [navigate]);
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
        <RadioProvider>
          <a href="#main-content" className="skip-to-content">تخطي إلى المحتوى</a>
          <SPARedirect />
          <ScrollToTop />
          <BodyPaddingForPlayer />
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
            <Route path="*" element={<NotFound />} />
          </Routes>
          <RadioSheet />
          <MiniPlayer />
        </RadioProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
