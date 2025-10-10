import { useState } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Search } from "lucide-react";

export const SearchVisualizer = () => {
  const [array, setArray] = useState<number[]>([10, 20, 30, 40, 50, 60, 70, 80]);
  const [searchValue, setSearchValue] = useState("");
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [visitedIndices, setVisitedIndices] = useState<number[]>([]);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);

  const linearSearch = async () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) {
      toast.error("Please enter a valid number");
      return;
    }

    setVisitedIndices([]);
    setFoundIndex(null);
    const visited: number[] = [];

    for (let i = 0; i < array.length; i++) {
      setHighlightIndex(i);
      visited.push(i);
      setVisitedIndices([...visited]);
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (array[i] === target) {
        setFoundIndex(i);
        setHighlightIndex(null);
        toast.success(`Found ${target} at index ${i}!`);
        return;
      }
    }

    setHighlightIndex(null);
    toast.error(`${target} not found in array`);
  };

  const binarySearch = async () => {
    const target = parseInt(searchValue);
    if (isNaN(target)) {
      toast.error("Please enter a valid number");
      return;
    }

    setVisitedIndices([]);
    setFoundIndex(null);
    const visited: number[] = [];

    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      setHighlightIndex(mid);
      visited.push(mid);
      setVisitedIndices([...visited]);
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (array[mid] === target) {
        setFoundIndex(mid);
        setHighlightIndex(null);
        toast.success(`Found ${target} at index ${mid}!`);
        return;
      }

      if (array[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    setHighlightIndex(null);
    toast.error(`${target} not found in array`);
  };

  const controls = (
    <>
      <Input
        type="number"
        placeholder="Search value"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-40"
      />
      <Button onClick={linearSearch} size="sm">
        <Search className="h-4 w-4 mr-2" />
        Linear Search
      </Button>
      <Button onClick={binarySearch} variant="secondary" size="sm">
        <Search className="h-4 w-4 mr-2" />
        Binary Search
      </Button>
    </>
  );

  return (
    <VisualizationContainer
      title="Search Algorithms"
      description="Compare linear search (O(n)) and binary search (O(log n)) algorithms. Binary search requires a sorted array."
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
                foundIndex === index
                  ? "bg-success border-success text-success-foreground scale-110 animate-pulse-glow"
                  : highlightIndex === index
                  ? "bg-viz-comparing border-viz-comparing text-white scale-110"
                  : visitedIndices.includes(index)
                  ? "bg-viz-visited/20 border-viz-visited text-foreground"
                  : "bg-card border-border text-foreground"
              }`}
            >
              {value}
            </div>
            <span className="text-xs text-muted-foreground">[{index}]</span>
          </div>
        ))}
      </div>
    </VisualizationContainer>
  );
};
