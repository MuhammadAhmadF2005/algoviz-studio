import { useState } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Play, RotateCcw } from "lucide-react";

export const SortingVisualizer = () => {
  const initialArray = [64, 34, 25, 12, 22, 11, 90, 50];
  const [array, setArray] = useState<number[]>([...initialArray]);
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const reset = () => {
    setArray([...initialArray]);
    setComparing([]);
    setSorted([]);
    setIsAnimating(false);
  };

  const bubbleSort = async () => {
    setIsAnimating(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparing([j, j + 1]);
        await delay(500);

        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await delay(500);
        }
      }
      setSorted((prev) => [...prev, n - 1 - i]);
    }
    setSorted(arr.map((_, i) => i));
    setComparing([]);
    setIsAnimating(false);
    toast.success("Bubble sort complete!");
  };

  const selectionSort = async () => {
    setIsAnimating(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      for (let j = i + 1; j < n; j++) {
        setComparing([minIdx, j]);
        await delay(500);
        if (arr[j] < arr[minIdx]) minIdx = j;
      }
      if (minIdx !== i) {
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        setArray([...arr]);
        await delay(500);
      }
      setSorted((prev) => [...prev, i]);
    }
    setSorted(arr.map((_, i) => i));
    setComparing([]);
    setIsAnimating(false);
    toast.success("Selection sort complete!");
  };

  const insertionSort = async () => {
    setIsAnimating(true);
    const arr = [...array];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      setComparing([i]);
      await delay(500);

      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        setArray([...arr]);
        setComparing([j, j + 1]);
        await delay(500);
        j--;
      }
      arr[j + 1] = key;
      setArray([...arr]);
      await delay(500);
    }
    setSorted(arr.map((_, i) => i));
    setComparing([]);
    setIsAnimating(false);
    toast.success("Insertion sort complete!");
  };

  const partition = async (arr: number[], low: number, high: number) => {
    const pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      setComparing([j, high]);
      await delay(500);

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await delay(500);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await delay(500);
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
    const arr = [...array];
    await quickSortHelper(arr, 0, arr.length - 1);
    setSorted(arr.map((_, i) => i));
    setComparing([]);
    setIsAnimating(false);
    toast.success("Quick sort complete!");
  };

  const merge = async (arr: number[], left: number, mid: number, right: number) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      setComparing([k]);
      await delay(500);

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      setArray([...arr]);
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      setArray([...arr]);
      await delay(500);
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      setArray([...arr]);
      await delay(500);
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
    const arr = [...array];
    await mergeSortHelper(arr, 0, arr.length - 1);
    setSorted(arr.map((_, i) => i));
    setComparing([]);
    setIsAnimating(false);
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
