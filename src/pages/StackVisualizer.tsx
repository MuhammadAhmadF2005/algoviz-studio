import { useState } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";

export const StackVisualizer = () => {
  const [stack, setStack] = useState<number[]>([10, 20, 30]);
  const [inputValue, setInputValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const push = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setStack([...stack, value]);
      setInputValue("");
      setAnimating(false);
      toast.success("Element pushed!");
    }, 300);
  };

  const pop = () => {
    if (stack.length === 0) {
      toast.error("Stack is empty!");
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setStack(stack.slice(0, -1));
      setAnimating(false);
      toast.success("Element popped!");
    }, 300);
  };

  const controls = (
    <>
      <Input
        type="number"
        placeholder="Enter value"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-40"
        onKeyPress={(e) => e.key === "Enter" && push()}
      />
      <Button onClick={push} size="sm" disabled={animating}>
        <Plus className="h-4 w-4 mr-2" />
        Push
      </Button>
      <Button onClick={pop} variant="destructive" size="sm" disabled={animating}>
        <Minus className="h-4 w-4 mr-2" />
        Pop
      </Button>
    </>
  );

  return (
    <VisualizationContainer
      title="Stack Visualizer"
      description="Stack follows Last-In-First-Out (LIFO) principle. Push and pop operations occur at the top."
      controls={controls}
    >
      <div className="flex flex-col-reverse gap-2 items-center">
        {stack.map((value, index) => (
          <div
            key={index}
            className={`w-40 h-16 flex items-center justify-center rounded-lg border-2 text-lg font-semibold transition-all duration-300 ${
              index === stack.length - 1
                ? "bg-viz-active border-viz-active text-white"
                : "bg-card border-border text-foreground"
            } ${animating && index === stack.length - 1 ? "animate-bounce-subtle" : "animate-scale-in"}`}
          >
            {value}
            {index === stack.length - 1 && (
              <span className="ml-2 text-xs opacity-75">← TOP</span>
            )}
          </div>
        ))}
        {stack.length === 0 && (
          <p className="text-muted-foreground">Stack is empty. Push elements to start.</p>
        )}
        <div className="w-40 h-1 bg-border rounded mt-4" />
      </div>
    </VisualizationContainer>
  );
};
