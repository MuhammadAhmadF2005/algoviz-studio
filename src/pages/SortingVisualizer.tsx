import { useState, FormEvent } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { Play, RotateCcw, Square } from "lucide-react";

export const SortingVisualizer = () => {
  const initialArray = [64, 34, 25, 12, 22, 11, 90, 50];
  const [array, setArray] = useState<number[]>([...initialArray]);
  const [inputValue, setInputValue] = useState(initialArray.join(", "));
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [shouldStop, setShouldStop] = useState(false);
  const [description, setDescription] = useState("");

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const stopAnimation = () => {
    setShouldStop(true);
    setIsAnimating(false);
    setComparing([]);
    setDescription("Animation stopped by user");
    toast.info("Animation stopped");
  };

  // Helper function to check if animation should continue
  const shouldContinue = () => {
    if (shouldStop) {
      setShouldStop(false);
      return false;
    }
    return true;
  };

  const reset = () => {
    setShouldStop(true);
    setArray([...initialArray]);
    setInputValue(initialArray.join(", "));
    setComparing([]);
    setSorted([]);
    setIsAnimating(false);
    setShouldStop(false);
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
    setShouldStop(false);
    setDescription("Starting Bubble Sort...");
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      if (!shouldContinue()) return;

      for (let j = 0; j < n - i - 1; j++) {
        if (!shouldContinue()) return;

        setComparing([j, j + 1]);
        setDescription(`Comparing ${arr[j]} and ${arr[j + 1]}`);
        await delay(1100 - animationSpeed); // Invert speed: higher value = faster

        if (!shouldContinue()) return;

        if (arr[j] > arr[j + 1]) {
          setDescription(`Swapping ${arr[j]} and ${arr[j + 1]}`);
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await delay(1100 - animationSpeed);
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
    setShouldStop(false);
    setDescription("Starting Selection Sort...");
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      if (!shouldContinue()) return;

      let minIdx = i;
      setDescription(`Finding the minimum element in the unsorted part...`);
      for (let j = i + 1; j < n; j++) {
        if (!shouldContinue()) return;

        setComparing([minIdx, j]);
        setDescription(`Comparing ${arr[j]} with current minimum ${arr[minIdx]}`);
        await delay(1100 - animationSpeed);
        if (arr[j] < arr[minIdx]) minIdx = j;
      }

      if (!shouldContinue()) return;

      if (minIdx !== i) {
        setDescription(`Swapping ${arr[i]} with minimum ${arr[minIdx]}`);
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        await delay(1100 - animationSpeed);
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
    setShouldStop(false);
    setDescription("Starting Insertion Sort...");
    const arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      if (!shouldContinue()) return;

      const key = arr[i];
      let j = i - 1;

      setComparing([i]);
      setDescription(`Selecting ${key} as the key to be inserted`);
      await delay(1100 - animationSpeed);

      while (j >= 0 && arr[j] > key) {
        if (!shouldContinue()) return;

        setDescription(`Moving ${arr[j]} to the right`);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        setComparing([j, j + 1]);
        await delay(1100 - animationSpeed);
        j--;
      }

      if (!shouldContinue()) return;

      arr[j + 1] = key;
      setDescription(`Inserting ${key} at its correct position`);
      setArray([...arr]);
      await delay(1100 - animationSpeed);
    }
    setSorted(arr.map((_, i) => i));
    setComparing([]);
    setIsAnimating(false);
    setDescription("Insertion Sort complete!");
    toast.success("Insertion sort complete!");
  };

  const partition = async (arr: number[], low: number, high: number) => {
    if (!shouldContinue()) return -1;

    const pivot = arr[high];
    setDescription(`Choosing ${pivot} as the pivot`);
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (!shouldContinue()) return -1;

      setComparing([j, high]);
      setDescription(`Comparing ${arr[j]} with pivot ${pivot}`);
      await delay(1100 - animationSpeed);

      if (arr[j] < pivot) {
        i++;
        setDescription(`Swapping ${arr[i]} and ${arr[j]}`);
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await delay(1100 - animationSpeed);
      }
    }

    if (!shouldContinue()) return -1;

    setDescription(`Swapping pivot ${arr[high]} with ${arr[i + 1]}`);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await delay(1100 - animationSpeed);
    return i + 1;
  };

  const quickSortHelper = async (arr: number[], low: number, high: number) => {
    if (low < high && shouldContinue()) {
      const pi = await partition(arr, low, high);
      if (pi === -1) return; // Stop was requested
      await quickSortHelper(arr, low, pi - 1);
      await quickSortHelper(arr, pi + 1, high);
    }
  };

  const quickSort = async () => {
    setIsAnimating(true);
    setShouldStop(false);
    setDescription("Starting Quick Sort...");
    const arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1);
    if (shouldContinue()) {
      setSorted(arr.map((_, i) => i));
      setComparing([]);
      setIsAnimating(false);
      setDescription("Quick Sort complete!");
      toast.success("Quick sort complete!");
    }
  };

  const merge = async (arr: number[], left: number, mid: number, right: number) => {
    if (!shouldContinue()) return;

    setDescription(`Merging subarrays...`);
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      if (!shouldContinue()) return;

      setComparing([k]);
      setDescription(`Comparing ${leftArr[i]} and ${rightArr[j]}`);
      await delay(1100 - animationSpeed);

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
      if (!shouldContinue()) return;

      setDescription(`Placing remaining element ${leftArr[i]} in the sorted array`);
      arr[k] = leftArr[i];
      setArray([...arr]);
      await delay(1100 - animationSpeed);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      if (!shouldContinue()) return;

      setDescription(`Placing remaining element ${rightArr[j]} in the sorted array`);
      arr[k] = rightArr[j];
      setArray([...arr]);
      await delay(1100 - animationSpeed);
      j++;
      k++;
    }
  };

  const mergeSortHelper = async (arr: number[], left: number, right: number) => {
    if (left < right && shouldContinue()) {
      const mid = Math.floor((left + right) / 2);
      await mergeSortHelper(arr, left, mid);
      await mergeSortHelper(arr, mid + 1, right);
      await merge(arr, left, mid, right);
    }
  };

  const mergeSort = async () => {
    setIsAnimating(true);
    setShouldStop(false);
    setDescription("Starting Merge Sort...");
    const arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1);
    if (shouldContinue()) {
      setSorted(arr.map((_, i) => i));
      setComparing([]);
      setIsAnimating(false);
      setDescription("Merge Sort complete!");
      toast.success("Merge sort complete!");
    }
  };

  const heapify = async (arr: number[], n: number, i: number) => {
    if (!shouldContinue()) return;

    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      setComparing([left, largest]);
      setDescription(`Comparing left child ${arr[left]} with parent ${arr[largest]}`);
      await delay(1100 - animationSpeed);
      if (arr[left] > arr[largest]) largest = left;
    }

    if (right < n) {
      if (!shouldContinue()) return;

      setComparing([right, largest]);
      setDescription(`Comparing right child ${arr[right]} with current largest ${arr[largest]}`);
      await delay(1100 - animationSpeed);
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== i) {
      if (!shouldContinue()) return;

      setDescription(`Swapping ${arr[i]} with ${arr[largest]} to maintain heap property`);
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      setArray([...arr]);
      await delay(1100 - animationSpeed);
      await heapify(arr, n, largest);
    }
  };

  const heapSort = async () => {
    setIsAnimating(true);
    setShouldStop(false);
    setDescription("Starting Heap Sort...");
    const arr = [...array];
    const n = arr.length;

    // Build max heap
    setDescription("Building max heap...");
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      if (!shouldContinue()) return;
      await heapify(arr, n, i);
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      if (!shouldContinue()) return;

      setDescription(`Moving current root ${arr[0]} to end`);
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      setSorted((prev) => [...prev, i]);
      await delay(1100 - animationSpeed);

      // Call heapify on the reduced heap
      await heapify(arr, i, 0);
    }

    if (shouldContinue()) {
      setSorted(arr.map((_, i) => i));
      setComparing([]);
      setIsAnimating(false);
      setDescription("Heap Sort complete!");
      toast.success("Heap sort complete!");
    }
  };

  const getMax = (arr: number[]) => {
    return Math.max(...arr);
  };

  const countingSort = async (arr: number[], exp: number) => {
    if (!shouldContinue()) return;

    const n = arr.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);

    setDescription(`Counting occurrences for digit place ${exp}`);

    // Store count of occurrences in count[]
    for (let i = 0; i < n; i++) {
      if (!shouldContinue()) return;

      const digit = Math.floor(arr[i] / exp) % 10;
      count[digit]++;
      setComparing([i]);
      await delay((1100 - animationSpeed) / 2);
    }

    // Change count[i] so that count[i] now contains actual position of this digit in output[]
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    setDescription(`Placing elements in sorted order for current digit place`);

    // Build the output array
    for (let i = n - 1; i >= 0; i--) {
      if (!shouldContinue()) return;

      const digit = Math.floor(arr[i] / exp) % 10;
      output[count[digit] - 1] = arr[i];
      count[digit]--;
      setComparing([i]);
      await delay((1100 - animationSpeed) / 2);
    }

    // Copy the output array to arr[], so that arr[] now contains sorted numbers according to current digit
    for (let i = 0; i < n; i++) {
      if (!shouldContinue()) return;

      arr[i] = output[i];
      setArray([...arr]);
      await delay((1100 - animationSpeed) / 3);
    }
  };

  const radixSort = async () => {
    setIsAnimating(true);
    setShouldStop(false);
    setDescription("Starting Radix Sort...");
    const arr = [...array];
    const max = getMax(arr);

    // Do counting sort for every digit
    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
      if (!shouldContinue()) return;

      setDescription(`Sorting by digit place: ${exp}`);
      await countingSort(arr, exp);
    }

    if (shouldContinue()) {
      setSorted(arr.map((_, i) => i));
      setComparing([]);
      setIsAnimating(false);
      setDescription("Radix Sort complete!");
      toast.success("Radix sort complete!");
    }
  };

  const controls = (
    <div className="space-y-4">
      {/* Basic Sorting Algorithms */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Basic Algorithms</h3>
        <div className="flex flex-wrap gap-2">
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
        </div>
      </div>

      {/* Advanced Sorting Algorithms */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground">Advanced Algorithms</h3>
        <div className="flex flex-wrap gap-2">
          <Button onClick={quickSort} size="sm" disabled={isAnimating}>
            <Play className="h-4 w-4 mr-2" />
            Quick Sort
          </Button>
          <Button onClick={mergeSort} size="sm" disabled={isAnimating}>
            <Play className="h-4 w-4 mr-2" />
            Merge Sort
          </Button>
          <Button onClick={heapSort} size="sm" disabled={isAnimating}>
            <Play className="h-4 w-4 mr-2" />
            Heap Sort
          </Button>
          <Button onClick={radixSort} size="sm" disabled={isAnimating}>
            <Play className="h-4 w-4 mr-2" />
            Radix Sort
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 pt-2 border-t">
        <Button onClick={reset} variant="outline" size="sm" disabled={isAnimating}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        {isAnimating && (
          <Button onClick={stopAnimation} variant="destructive" size="sm">
            <Square className="h-4 w-4 mr-2" />
            Stop
          </Button>
        )}
      </div>
    </div>
  );

  const maxValue = Math.max(...array);

  return (
    <VisualizationContainer
      title="Sorting Algorithms"
      description="Compare different sorting algorithms and their time complexities. Watch how each algorithm organizes the data."
      controls={controls}
    >
      <div className="space-y-6">
        {/* Array Configuration Section */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-4">
          <h3 className="text-sm font-semibold">Array Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <form onSubmit={handleArraySubmit} className="flex gap-2">
              <Input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter comma-separated numbers"
                className="flex-1"
                disabled={isAnimating}
              />
              <Button type="submit" disabled={isAnimating}>
                Set Array
              </Button>
            </form>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium whitespace-nowrap">Speed:</span>
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-muted-foreground">Slow</span>
                <Slider
                  min={100}
                  max={1000}
                  step={100}
                  value={[animationSpeed]}
                  onValueChange={(value) => setAnimationSpeed(value[0])}
                  className="flex-1"
                  disabled={isAnimating}
                />
                <span className="text-xs text-muted-foreground">Fast</span>
              </div>
              <span className="text-xs text-muted-foreground w-16">{1100 - animationSpeed}ms</span>
            </div>
          </div>
        </div>

        {/* Status Section */}
        {description && (
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-center">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">{description}</p>
          </div>
        )}

        {/* Visualization Section */}
        <div className="bg-background rounded-lg border p-6">
          <div className="flex gap-2 items-end h-64 justify-center">
            {array.map((value, index) => (
              <div
                key={index}
                className="flex flex-col items-center gap-2 flex-1 max-w-16 animate-scale-in"
              >
                <div
                  className={`w-full flex items-end justify-center rounded-t-lg transition-all duration-300 ${sorted.includes(index)
                    ? "bg-green-500"
                    : comparing.includes(index)
                      ? "bg-yellow-500"
                      : "bg-blue-500"
                    }`}
                  style={{ height: `${(value / maxValue) * 200}px` }}
                >
                  <span className="text-xs font-semibold text-white mb-1">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </VisualizationContainer>
  );
};
