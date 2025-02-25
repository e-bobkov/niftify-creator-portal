
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PixelBackground } from "@/components/PixelBackground";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import NotFound from "./pages/NotFound";
import Collection from "@/pages/Collection";
import TokenDetails from "@/pages/TokenDetails";
import Terms from "@/pages/Terms";
import Tax from "@/pages/Tax";
import Security from "@/pages/Security";
import { PrivateRoute } from "@/components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <PixelBackground />
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/create" element={<Create />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/tax" element={<Tax />} />
            <Route path="/security" element={<Security />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/my-collection/:id" element={<PrivateRoute><Collection /></PrivateRoute>} />
            <Route path="/my-collection/:collectionId/:tokenId" element={<PrivateRoute><TokenDetails /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
