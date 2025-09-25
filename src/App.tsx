import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Pipelines from "./pages/Pipelines";
import Containers from "./pages/Containers";
import Monitoring from "./pages/Monitoring";
import NotFound from "./pages/NotFound";
import ServiceCredentials from "./components/ServiceCredentials";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<Dashboard />} />

            {/* Protected routes */}
            <Route
              path="/pipelines"
              element={
                <ProtectedRoute>
                  <Pipelines />
                </ProtectedRoute>
              }
            />
            <Route
              path="/containers"
              element={
                <ProtectedRoute>
                  <Containers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/monitoring"
              element={
                <ProtectedRoute>
                  <Monitoring />
                </ProtectedRoute>
              }
            />
            <Route
              path="/services/credentials"
              element={
                <ProtectedRoute>
                  <ServiceCredentials />
                </ProtectedRoute>
              }
            />

            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
