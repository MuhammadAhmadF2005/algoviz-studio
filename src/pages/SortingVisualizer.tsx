import { useState, FormEvent } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Play, RotateCcw } from "lucide-react";

export const SortingVisualizer = () => {
  const initialArray = [64, 34, 25, 12, 22, 11, 90, 50];
  const [array, setArray] = useState<number[]>([...initialArray]);
  const [inputValue, setInputValue] = useState(initialArray.join(", "));
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [description, setDescription] = useState("");

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const reset = () => {
    setArray([...initialArray]);
    setInputValue(initialArray.join(", "));
    setComparing([]);
    setSorted([]);
    setIsAnimating(false);
    setDescription("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleArraySubmit = (e: FormEvent) => {
    e.preventDefault();
    const newArray = inputValue
      .split(",")
      .map((item) => parseInt(item.trim(), 10))
      .filter((num) => !isNaN(num));

    if (newArray.length > 0) {
      setArray(newArray);
      setComparing([]);
      setSorted([]);
      setIsAnimating(false);
      toast.success("New array set!");
    } else {
      toast.error("Invalid array format. Please enter comma-separated numbers.");
    }
  };

  const bubbleSort = async () => {
    setIsAnimating(true);
    setDescription("Starting Bubble Sort...");
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        setDescription(`Comparing ${arr[j]} and ${arr[j + 1]}`);
        await delay(animationSpeed);

        if (arr[j] > arr[j + 1]) {
          setDescription(`Swapping ${arr[j]} and ${arr[j + 1]}`);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await delay(animationSpeed);
        }
      }
      setSorted((prev) => [...prev, n - 1 - i]);
    }
    setSorted(arr.map((_, i) => i));
    setComparing([]);
    setIsAnimating(false);
    setDescription("Bubble Sort complete!");
    toast.success("Bubble sort complete!");
  };

  const selectionSort = async () => {
    setIsAnimating(true);
    setDescription("Starting Selection Sort...");
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      setDescription(`Finding the minimum element in the unsorted part...`);
      for (let j = i + 1; j < n; j++) {
        setComparing([minIdx, j]);
        setDescription(`Comparing ${arr[j]} with current minimum ${arr[minIdx]}`);
        await delay(animationSpeed);
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        setDescription(`Swapping ${arr[i]} with minimum ${arr[minIdx]}`);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        await delay(animationSpeed);
      }
      setSorted((prev) => [...prev, i]);
    }
    setSorted(arr.map((_, i) => i));
    setComparing([]);
    setIsAnimating(false);
    setDescription("Selection Sort complete!");
    toast.success("Selection sort complete!");
  };

  const insertionSort = async () => {
    setIsAnimating(true);
    setDescription("Starting Insertion Sort...");
    const arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      setComparing([i]);
      setDescription(`Selecting ${key} as the key to be inserted`);
      await delay(animationSpeed);

      while (j >= 0 && arr[j] > key) {
        setDescription(`Moving ${arr[j]} to the right`);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        setComparing([j, j + 1]);
        await delay(animationSpeed);
        j--;
      }
      arr[j + 1] = key;
      setDescription(`Inserting ${key} at its correct position`);
      setArray([...arr]);
      await delay(animationSpeed);
    }
    setSorted(arr.map((_, i) => i));
    setComparing([]);
    setIsAnimating(false);
    setDescription("Insertion Sort complete!");
    toast.success("Insertion sort complete!");
  };

  const partition = async (arr: number[], low: number, high: number) => {
    const pivot = arr[high];
    setDescription(`Choosing ${pivot} as the pivot`);
    let i = low - 1;

    for (let j = low; j < high; j++) {
      setComparing([j, high]);
      setDescription(`Comparing ${arr[j]} with pivot ${pivot}`);
      await delay(animationSpeed);

      if (arr[j] < pivot) {
        i++;
        setDescription(`Swapping ${arr[i]} and ${arr[j]}`);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await delay(animationSpeed);
      }
    }
    setDescription(`Swapping pivot ${arr[high]} with ${arr[i + 1]}`);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await delay(animationSpeed);
    return i + 1;
  };

  const quickSortHelper = async (arr: number[], low: number, high: number) => {
    if (low < high) {
      const pi = await partition(arr, low, high);
      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    }
  };

  const quickSort = async () => {
    setIsAnimating(true);
    setDescription("Starting Quick Sort...");
    const arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1);
    setSorted(arr.map((_, i) => i));
    setComparing([]);
    setIsAnimating(false);
    setDescription("Quick Sort complete!");
    toast.success("Quick sort complete!");
  };

  const merge = async (arr: number[], left: number, mid: number, right: number) => {
    setDescription(`Merging subarrays...`);
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      setComparing([k]);
      setDescription(`Comparing ${leftArr[i]} and ${rightArr[j]}`);
      await delay(animationSpeed);

      if (leftArr[i] <= rightArr[j]) {
        setDescription(`Placing ${leftArr[i]} in the sorted array`);
        arr[k] = leftArr[i];
        i++;
      } else {
        setDescription(`Placing ${rightArr[j]} in the sorted array`);
        arr[k] = rightArr[j];
        j++;
      }
      setArray([...arr]);
      k++;
    }

    while (i < leftArr.length) {
      setDescription(`Placing remaining element ${leftArr[i]} in the sorted array`);
      arr[k] = leftArr[i];
      setArray([...arr]);
      await delay(animationSpeed);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      setDescription(`Placing remaining element ${rightArr[j]} in the sorted array`);
      arr[k] = rightArr[j];
      setArray([...arr]);
      await delay(animationSpeed);
      j++;
      k++;
    }
  };

  const mergeSortHelper = async (arr: number[], left: number, right: number) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await mergeSortHelper(arr, left, mid);
      await mergeSortHelper(arr, mid + 1, right);
      await merge(arr, left, mid, right);
    }
  };

  const mergeSort = async () => {
    setIsAnimating(true);
    setDescription("Starting Merge Sort...");
    const arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1);
    setSorted(arr.map((_, i) => i));
    setComparing([]);
    setIsAnimating(false);
    setDescription("Merge Sort complete!");
    toast.success("Merge sort complete!");
  };

  const controls = (
    <>
      <Button onClick={bubbleSort} size="sm" disabled={isAnimating}>
        <Play className="h-4 w-4 mr-2" />
        Bubble Sort
      </Button>
      <Button onClick={selectionSort} size="sm" disabled={isAnimating}>
        <Play className="h-4 w-4 mr-2" />
        Selection Sort
      </Button>
      <Button onClick={insertionSort} size="sm" disabled={isAnimating}>
        <Play className="h-4 w-4 mr-2" />
        Insertion Sort
      </Button>
      <Button onClick={quickSort} size="sm" disabled={isAnimating}>
        <Play className="h-4 w-4 mr-2" />
        Quick Sort
      </Button>
      <Button onClick={mergeSort} size="sm" disabled={isAnimating}>
        <Play className="h-4 w-4 mr-2" />
        Merge Sort
      </Button>
      <div className="h-6 w-px bg-border" />
      <Button onClick={reset} variant="outline" size="sm" disabled={isAnimating}>
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
    </>
  );

  const maxValue = Math.max(...array);

  return (
    <VisualizationContainer
      title="Sorting Algorithms"
      description="Compare different sorting algorithms and their time complexities. Watch how each algorithm organizes the data."
      controls={controls}
    >
      <form onSubmit={handleArraySubmit} className="flex gap-2 mb-4">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter comma-separated numbers"
          className="max-w-xs"
          disabled={isAnimating}
        />
        <Button type="submit" disabled={isAnimating}>
          Set New Array
        </Button>
      </form>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-sm font-medium">Animation Speed</span>
        <Slider
          min={100}
          max={1000}
          step={100}
          value={[animationSpeed]}
          onValueChange={(value) => setAnimationSpeed(value[0])}
          className="max-w-xs"
          disabled={isAnimating}
        />
      </div>
      {description && (
        <div className="p-4 bg-muted rounded-lg text-center mb-4">
          <p className="text-sm font-medium">{description}</p>
        </div>
      )}
      <div className="flex gap-2 items-end h-64">
        {array.map((value, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 flex-1 animate-scale-in"
          >
            <div
              className={`w-full flex items-end justify-center rounded-t-lg transition-all duration-300 ${
                sorted.includes(index)
                  ? "bg-success"
                  : comparing.includes(index)
                  ? "bg-viz-comparing"
                  : "bg-primary"
              }`}
              style={{ height: `${(value / maxValue) * 200}px` }}
            >
              <span className="text-xs font-semibold text-white mb-1">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </VisualizationContainer>
  );
};
