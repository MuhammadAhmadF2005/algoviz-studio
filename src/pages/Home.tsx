import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LayoutGrid,
  List,
  Layers,
  GitBranch,
  Search,
  ArrowUpDown,
  BookOpen,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: LayoutGrid,
    title: "Arrays",
    description: "Visualize contiguous memory storage with O(1) access",
    path: "/array",
    color: "text-blue-500",
  },
  {
    icon: Layers,
    title: "Stacks",
    description: "LIFO data structure with push/pop operations",
    path: "/stack",
    color: "text-purple-500",
  },
  {
    icon: List,
    title: "Queues",
    description: "FIFO data structure with enqueue/dequeue",
    path: "/queue",
    color: "text-green-500",
  },
  {
    icon: GitBranch,
    title: "Linked Lists",
    description: "Dynamic linear structure with node pointers",
    path: "/linked-list",
    color: "text-orange-500",
  },
  {
    icon: GitBranch,
    title: "Binary Trees",
    description: "Hierarchical structure with traversal algorithms",
    path: "/tree",
    color: "text-pink-500",
  },
  {
    icon: Search,
    title: "Search Algorithms",
    description: "Linear and binary search with complexity analysis",
    path: "/search",
    color: "text-cyan-500",
  },
  {
    icon: ArrowUpDown,
    title: "Sorting Algorithms",
    description: "Bubble, selection, insertion, merge, and quick sort",
    path: "/sorting",
    color: "text-red-500",
  },
];

const highlights = [
  {
    icon: Zap,
    title: "Real-time Visualization",
    description: "Watch algorithms execute step by step with smooth animations",
  },
  {
    icon: BookOpen,
    title: "Educational Focus",
    description: "Perfect for students learning data structures and algorithms",
  },
];

export const Home = () => {
  return (
    <div className="p-8 space-y-12 animate-fade-in">
      <div className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          DataViz
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Interactive visualizations of data structures and algorithms to enhance your learning experience
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {highlights.map((highlight, index) => {
          const Icon = highlight.icon;
          return (
            <Card key={index} className="border-2 hover:border-accent transition-colors">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle>{highlight.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{highlight.description}</CardDescription>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-center">Explore Data Structures & Algorithms</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Link key={index} to={feature.path}>
                <Card className="h-full hover:shadow-lg hover:border-accent transition-all duration-300 hover:scale-105 cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-secondary">
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                      </div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                    <Button variant="ghost" size="sm" className="mt-4 w-full">
                      Start Learning →
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};
