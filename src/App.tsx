import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Auth from "./pages/Auth";
import Cart from "./pages/Cart";
import Customize from "./pages/Customize";
import NotFound from "./pages/NotFound";
import CustomerPage from "./pages/CustomerPage";
import EmployeePage from "./pages/EmployeePage";
import ProductPage from "./pages/ProductPage";
import OrdersPage from "./pages/OrdersPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Products />} />
            <Route path="/categorias" element={<Products />} />
            <Route path="/personalizar" element={<Customize />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/registro" element={<Auth />} />
            <Route path="/carrito" element={<Cart />} />
            <Route path="/clientes" element={<CustomerPage />} />
            <Route path="/empleados" element={<EmployeePage />} />
            <Route path="/productoscontrol" element={<ProductPage />} />
            <Route path="/ordenpedidos" element={<OrdersPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
