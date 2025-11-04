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
import { Separator } from "@/components/ui/separator";
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
    <aside className="w-64 border-r bg-card p-6 flex flex-col gap-6">
      <div className="space-y-2">
        <Link to="/" className="block">
          <img src={datavizLogo} alt="DataViz Logo" className="h-16 w-auto mb-2" />
          <p className="text-sm text-muted-foreground">Algorithm Visualizer</p>
        </Link>
      </div>

      <Separator />

      <nav className="flex-1 space-y-6">
        <div className="space-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive(item.path)
                        ? "bg-accent text-accent-foreground shadow-md"
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
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                      "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                      isActive(item.path)
                        ? "bg-accent text-accent-foreground shadow-md"
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

      <div className="p-4 rounded-lg bg-secondary/50 border border-border">
        <p className="text-xs text-muted-foreground">
          Interactive visualizations to help you understand data structures and algorithms
        </p>
      </div>

      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" className="w-full justify-start gap-3 px-3">
            <Bot className="h-4 w-4" />
            <span className="text-sm font-medium">Ask AI</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-[80vh] w-full max-w-2xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>Gemini Chatbot</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-auto">
            <Chatbot />
          </div>
        </DrawerContent>
      </Drawer>
    </aside>
  );
};
