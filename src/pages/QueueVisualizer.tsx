import { useState } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Minus } from "lucide-react";

export const QueueVisualizer = () => {
  const [queue, setQueue] = useState<number[]>([10, 20, 30]);
  const [inputValue, setInputValue] = useState("");
  const [animating, setAnimating] = useState(false);

  const enqueue = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setQueue([...queue, value]);
      setInputValue("");
      setAnimating(false);
      toast.success("Element enqueued!");
    }, 300);
  };

  const dequeue = () => {
    if (queue.length === 0) {
      toast.error("Queue is empty!");
      return;
    }
    setAnimating(true);
    setTimeout(() => {
      setQueue(queue.slice(1));
      setAnimating(false);
      toast.success("Element dequeued!");
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
        onKeyPress={(e) => e.key === "Enter" && enqueue()}
      />
      <Button onClick={enqueue} size="sm" disabled={animating}>
        <Plus className="h-4 w-4 mr-2" />
        Enqueue
      </Button>
      <Button onClick={dequeue} variant="destructive" size="sm" disabled={animating}>
        <Minus className="h-4 w-4 mr-2" />
        Dequeue
      </Button>
    </>
  );

  return (
    <VisualizationContainer
      title="Queue Visualizer"
      description="Queue follows First-In-First-Out (FIFO) principle. Elements are added at rear and removed from front."
      controls={controls}
    >
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-2 items-center">
          <span className="text-sm font-semibold text-muted-foreground">FRONT →</span>
          {queue.map((value, index) => (
            <div
              key={index}
              className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 text-lg font-semibold transition-all duration-300 ${
                index === 0
                  ? "bg-destructive border-destructive text-destructive-foreground"
                  : index === queue.length - 1
                  ? "bg-success border-success text-success-foreground"
                  : "bg-card border-border text-foreground"
              } ${animating && index === 0 ? "animate-pulse" : "animate-scale-in"}`}
            >
              {value}
            </div>
          ))}
          <span className="text-sm font-semibold text-muted-foreground">← REAR</span>
        </div>
        {queue.length === 0 && (
          <p className="text-muted-foreground">Queue is empty. Enqueue elements to start.</p>
        )}
      </div>
    </VisualizationContainer>
  );
};
