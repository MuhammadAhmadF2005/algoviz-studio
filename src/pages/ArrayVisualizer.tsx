import { useState } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, ArrowRight } from "lucide-react";

export const ArrayVisualizer = () => {
  const [array, setArray] = useState<number[]>([10, 20, 30, 40, 50]);
  const [inputValue, setInputValue] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  const addElement = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    setArray([...array, value]);
    setInputValue("");
    toast.success("Element added!");
  };

  const deleteElement = (index: number) => {
    setArray(array.filter((_, i) => i !== index));
    toast.success("Element deleted!");
  };

  const traverse = async () => {
    for (let i = 0; i < array.length; i++) {
      setHighlightIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setHighlightIndex(null);
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
        onKeyPress={(e) => e.key === "Enter" && addElement()}
      />
      <Button onClick={addElement} size="sm">
        <Plus className="h-4 w-4 mr-2" />
        Add
      </Button>
      <Button onClick={traverse} variant="secondary" size="sm">
        <ArrowRight className="h-4 w-4 mr-2" />
        Traverse
      </Button>
    </>
  );

  return (
    <VisualizationContainer
      title="Array Visualizer"
      description="Arrays store elements in contiguous memory locations with O(1) access time by index."
      controls={controls}
    >
      <div className="flex gap-2 items-end">
        {array.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 animate-scale-in"
          >
            <div
              className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 text-lg font-semibold transition-all duration-300 ${
                highlightIndex === index
                  ? "bg-viz-active border-viz-active text-white scale-110 animate-pulse-glow"
                  : "bg-card border-border text-foreground hover:border-accent"
              }`}
            >
              {value}
            </div>
            <span className="text-xs text-muted-foreground">[{index}]</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteElement(index)}
              className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
        {array.length === 0 && (
          <p className="text-muted-foreground">Add elements to visualize the array</p>
        )}
      </div>
    </VisualizationContainer>
  );
};
