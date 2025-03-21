
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PixelBackground } from "@/components/PixelBackground";
import Footer from "@/components/Footer";
import { usePostMessageNavigation } from "@/hooks/usePostMessageNavigation";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import NotFound from "./pages/NotFound";
import Collection from "@/pages/Collection";
import TokenDetails from "@/pages/TokenDetails";
import Terms from "@/pages/Terms";
import Tax from "@/pages/Tax";
import Security from "@/pages/Security";
import Refund from "@/pages/Refund";
import Privacy from "@/pages/Privacy";
import License from "@/pages/License";
import IntellectualProperty from "@/pages/IntellectualProperty";
import AMLKYC from "@/pages/AMLKYC";
import { PrivateRoute } from "@/components/PrivateRoute";
import Marketplace from "@/pages/Marketplace";
import MarketplaceTokenDetails from "@/pages/MarketplaceTokenDetails";
import Author from "@/pages/Author";
import AuthorCollection from "@/pages/AuthorCollection";
import AuthorToken from "@/pages/AuthorToken";
import Inventory from "@/pages/Inventory";
import Checkout from "@/pages/Checkout";

const queryClient = new QueryClient();

const AppRoutes = () => {
  usePostMessageNavigation();
  
  return (
    <Routes>
      {/* Checkout route without navbar and footer */}
      <Route path="/checkout/:item" element={
        <div className="min-h-screen flex flex-col">
          <PixelBackground />
          <Checkout />
        </div>
      } />
      
      {/* Остальные маршруты с общим layout (навбар и футер) */}
      <Route path="*" element={
        <div className="min-h-screen flex flex-col">
          <PixelBackground />
          <Navbar />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<Create />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:tokenId" element={<MarketplaceTokenDetails />} />
            <Route path="/author/:authorId" element={<Author />} />
            <Route path="/author/:authorId/collection/:collectionId" element={<AuthorCollection />} />
            <Route path="/author/:authorId/token/:tokenId" element={<AuthorToken />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/tax" element={<Tax />} />
            <Route path="/security" element={<Security />} />
            <Route path="/refund" element={<Refund />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/license" element={<License />} />
            <Route path="/intellectual-property" element={<IntellectualProperty />} />
            <Route path="/aml-kyc" element={<AMLKYC />} />
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
            <Route path="/my-collection/:id" element={<PrivateRoute><Collection /></PrivateRoute>} />
            <Route path="/my-collection/:collectionId/:tokenId" element={<PrivateRoute><TokenDetails /></PrivateRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      } />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
