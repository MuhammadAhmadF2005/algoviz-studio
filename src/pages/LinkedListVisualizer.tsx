import { useState } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, ArrowRight } from "lucide-react";

interface Node {
  value: number;
  id: number;
}

export const LinkedListVisualizer = () => {
  const [list, setList] = useState<Node[]>([
    { value: 10, id: 1 },
    { value: 20, id: 2 },
    { value: 30, id: 3 },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [nextId, setNextId] = useState(4);
  const [highlightId, setHighlightId] = useState<number | null>(null);

  const addNode = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    setList([...list, { value, id: nextId }]);
    setNextId(nextId + 1);
    setInputValue("");
    toast.success("Node added!");
  };

  const deleteNode = (id: number) => {
    setList(list.filter((node) => node.id !== id));
    toast.success("Node deleted!");
  };

  const traverse = async () => {
    for (const node of list) {
      setHighlightId(node.id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setHighlightId(null);
    toast.success("Traversal complete!");
  };

  const controls = (
    <>
      <Input
        type="number"
        placeholder="Enter value"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-40"
        onKeyPress={(e) => e.key === "Enter" && addNode()}
      />
      <Button onClick={addNode} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add Node
      </Button>
      <Button onClick={traverse} variant="secondary" size="sm">
        <ArrowRight className="h-4 w-4 mr-2" />
        Traverse
      </Button>
    </>
  );

  return (
    <VisualizationContainer
      title="Linked List Visualizer"
      description="A linked list is a linear data structure where each element points to the next, allowing dynamic memory allocation."
      controls={controls}
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-4">
        {list.map((node, index) => (
          <div key={node.id} className="flex items-center gap-2 animate-scale-in">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`relative w-20 h-20 flex items-center justify-center rounded-lg border-2 text-lg font-semibold transition-all duration-300 ${
                  highlightId === node.id
                    ? "bg-viz-active border-viz-active text-white scale-110 animate-pulse-glow"
                    : "bg-card border-border text-foreground hover:border-accent"
                }`}
              >
                {node.value}
                {index === 0 && (
                  <span className="absolute -top-8 text-xs font-semibold text-accent">
                    HEAD
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteNode(node.id)}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
            {index < list.length - 1 && (
              <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        ))}
        {list.length === 0 && (
          <p className="text-muted-foreground">Add nodes to visualize the linked list</p>
        )}
      </div>
    </VisualizationContainer>
  );
};
