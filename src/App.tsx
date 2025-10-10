import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { ArrayVisualizer } from "./pages/ArrayVisualizer";
import { StackVisualizer } from "./pages/StackVisualizer";
import { QueueVisualizer } from "./pages/QueueVisualizer";
import { LinkedListVisualizer } from "./pages/LinkedListVisualizer";
import { TreeVisualizer } from "./pages/TreeVisualizer";
import { SearchVisualizer } from "./pages/SearchVisualizer";
import { SortingVisualizer } from "./pages/SortingVisualizer";
import NotFound from "./pages/NotFound";

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
            <Route path="/array" element={<ArrayVisualizer />} />
            <Route path="/stack" element={<StackVisualizer />} />
            <Route path="/queue" element={<QueueVisualizer />} />
            <Route path="/linked-list" element={<LinkedListVisualizer />} />
            <Route path="/tree" element={<TreeVisualizer />} />
            <Route path="/search" element={<SearchVisualizer />} />
            <Route path="/sorting" element={<SortingVisualizer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
