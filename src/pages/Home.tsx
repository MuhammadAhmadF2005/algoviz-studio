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
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: LayoutGrid,
    title: "Arrays",
    description: "Visualize contiguous memory storage with O(1) access",
    path: "/array",
  },
  {
    icon: Layers,
    title: "Stacks",
    description: "LIFO data structure with push/pop operations",
    path: "/stack",
  },
  {
    icon: List,
    title: "Queues",
    description: "FIFO data structure with enqueue/dequeue",
    path: "/queue",
  },
  {
    icon: GitBranch,
    title: "Linked Lists",
    description: "Dynamic linear structure with node pointers",
    path: "/linked-list",
  },
  {
    icon: GitBranch,
    title: "Binary Trees",
    description: "Hierarchical structure with traversal algorithms",
    path: "/tree",
  },
  {
    icon: Search,
    title: "Search Algorithms",
    description: "Linear and binary search with complexity analysis",
    path: "/search",
  },
  {
    icon: ArrowUpDown,
    title: "Sorting Algorithms",
    description: "Bubble, selection, insertion, merge, and quick sort",
    path: "/sorting",
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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-6 py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              DataViz
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Interactive visualizations of data structures and algorithms to enhance your learning experience
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button asChild size="lg" className="gap-2">
              <Link to="/array">
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/sorting">View Algorithms</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="px-6 py-12 bg-secondary/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <Card key={index} className="border-2 border-transparent hover:border-accent/50 transition-all duration-300 bg-card/80 backdrop-blur-sm">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-accent/10 text-accent">
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{highlight.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {highlight.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl md:text-3xl font-bold">Explore Data Structures & Algorithms</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Choose a topic below to start visualizing and learning
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.path} className="group">
                  <Card className="h-full border hover:border-accent/50 hover:shadow-lg transition-all duration-300 group-hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                      <div className="flex items-center text-sm font-medium text-primary group-hover:text-accent transition-colors">
                        Start Learning
                        <ArrowRight className="ml-1.5 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
