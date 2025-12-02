import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  List,
  Layers,
  GitBranch,
  Search,
  ArrowUpDown,
  Code,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Chatbot } from "@/components/Chatbot";
import datavizLogo from "@/assets/dataviz-logo.png";

const dataStructures = [
  { name: "Array", path: "/array", icon: LayoutGrid },
  { name: "Stack", path: "/stack", icon: Layers },
  { name: "Queue", path: "/queue", icon: List },
  { name: "Linked List", path: "/linked-list", icon: GitBranch },
  { name: "Binary Tree", path: "/tree", icon: GitBranch },
];

const algorithms = [
  { name: "Search", path: "/search", icon: Search },
  { name: "Sorting", path: "/sorting", icon: ArrowUpDown },
  { name: "Code Compiler", path: "/compiler", icon: Code },
];

export const Sidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 border-r bg-card flex flex-col h-screen sticky top-0">
      {/* Logo Section */}
      <div className="p-5 border-b">
        <Link to="/" className="block">
          <img src={datavizLogo} alt="DataViz Logo" className="h-14 w-auto" />
          <p className="text-xs text-muted-foreground mt-1.5">Algorithm Visualizer</p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">
            Data Structures
          </h2>
          <ul className="space-y-1">
            {dataStructures.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground px-3">
            Algorithms
          </h2>
          <ul className="space-y-1">
            {algorithms.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                      isActive(item.path)
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-foreground hover:bg-secondary"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t space-y-3">
        <div className="p-3 rounded-lg bg-secondary/50 border border-border">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Interactive visualizations to help you understand DSA concepts
          </p>
        </div>

        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="default" className="w-full gap-2">
              <Bot className="h-4 w-4" />
              <span className="text-sm font-medium">Ask AI Assistant</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="h-[85vh] max-h-[85vh]">
            <DrawerHeader className="border-b pb-4">
              <DrawerTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-accent" />
                DSA AI Assistant
              </DrawerTitle>
            </DrawerHeader>
            <div className="flex-1 overflow-hidden">
              <Chatbot />
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </aside>
  );
};
