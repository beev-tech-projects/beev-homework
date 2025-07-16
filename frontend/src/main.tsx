import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Version } from "./pages/Version.tsx";
import { SidebarProvider } from "./components/ui/sidebar.tsx";
import { AppSidebar } from "./components/atoms/sidebar/AppSidebar.tsx";
import FleetManagement from "./pages/FleetManagement.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import Vehicle from "./pages/Vehicle.tsx";
import CreateVehicle from "./pages/CreateVehicle.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SidebarProvider>
          <AppSidebar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/fleet-management" element={<FleetManagement />} />
            <Route path="/vehicle/:id" element={<Vehicle />} />
            <Route path="/create-vehicle" element={<CreateVehicle />} />
            <Route path="/version" element={<Version />} />
          </Routes>
        </SidebarProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);
