import { useState } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Trash2, ArrowRight, ArrowLeft, MoveRight, MoveLeft } from "lucide-react";

interface Node {
  value: number;
  id: number;
}

export const LinkedListVisualizer = () => {
  const [listType, setListType] = useState<"singly" | "doubly">("singly");
  const [list, setList] = useState<Node[]>([
    { value: 10, id: 1 },
    { value: 20, id: 2 },
    { value: 30, id: 3 },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [nextId, setNextId] = useState(4);
  const [highlightId, setHighlightId] = useState<number | null>(null);

  const validateInput = (): { isValid: boolean; value?: number; error?: string } => {
    // Check for empty input
    if (inputValue.trim() === "") {
      return { isValid: false, error: "Please enter a value before adding a node" };
    }

    // Check for whitespace-only input
    if (inputValue.trim().length === 0) {
      return { isValid: false, error: "Input cannot be empty or contain only spaces" };
    }

    // Parse the input value
    const value = parseInt(inputValue.trim());

    // Check for invalid numbers (NaN)
    if (isNaN(value)) {
      return { isValid: false, error: "Please enter a valid integer number" };
    }

    // Check for floating point numbers that were truncated
    if (inputValue.trim().includes('.')) {
      return { isValid: false, error: "Please enter a whole number (decimals not allowed)" };
    }

    // Check for extremely large numbers that might cause display issues
    if (Math.abs(value) > 999999) {
      return { isValid: false, error: "Please enter a number between -999999 and 999999" };
    }

    return { isValid: true, value };
  };

  const addNodeAtBeginning = () => {
    const validation = validateInput();
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    const newNode = { value: validation.value!, id: nextId };
    const wasEmpty = list.length === 0;

    setList([newNode, ...list]);
    setNextId(nextId + 1);
    setInputValue("");

    // Provide specific success message based on operation context
    if (wasEmpty) {
      toast.success(`Node with value ${validation.value} added as the first node (HEAD)!`);
    } else {
      toast.success(`Node with value ${validation.value} added at beginning - new HEAD node!`);
    }
  };

  const addNodeAtEnd = () => {
    const validation = validateInput();
    if (!validation.isValid) {
      toast.error(validation.error!);
      return;
    }

    const newNode = { value: validation.value!, id: nextId };
    const wasEmpty = list.length === 0;

    setList([...list, newNode]);
    setNextId(nextId + 1);
    setInputValue("");

    // Provide specific success message based on operation context
    if (wasEmpty) {
      toast.success(`Node with value ${validation.value} added as the first node (HEAD${listType === "doubly" ? " and TAIL" : ""})!`);
    } else if (listType === "doubly") {
      toast.success(`Node with value ${validation.value} added at end - new TAIL node!`);
    } else {
      toast.success(`Node with value ${validation.value} added at end of the list!`);
    }
  };

  const shouldShowHeadLabel = (index: number): boolean => {
    return index === 0 && list.length > 0;
  };

  const shouldShowTailLabel = (index: number): boolean => {
    return listType === "doubly" && index === list.length - 1 && list.length > 0;
  };

  const deleteNode = (id: number) => {
    const nodeToDelete = list.find((node) => node.id === id);
    if (!nodeToDelete) {
      toast.error("Error: Node not found and cannot be deleted!");
      return;
    }

    const nodeIndex = list.findIndex((node) => node.id === id);
    const isFirstNode = nodeIndex === 0;
    const isLastNode = nodeIndex === list.length - 1;
    const isSingleNode = list.length === 1;

    // Update the list by removing the node
    const updatedList = list.filter((node) => node.id !== id);
    setList(updatedList);

    // Provide specific feedback based on what was deleted
    let successMessage = `Node with value ${nodeToDelete.value} deleted!`;

    if (isSingleNode) {
      successMessage = `Node with value ${nodeToDelete.value} deleted - list is now empty!`;
    } else if (isFirstNode && listType === "singly") {
      successMessage = `HEAD node (value ${nodeToDelete.value}) deleted - HEAD label moved to next node!`;
    } else if (isFirstNode && listType === "doubly") {
      successMessage = `HEAD node (value ${nodeToDelete.value}) deleted - HEAD label moved to next node!`;
    } else if (isLastNode && listType === "doubly") {
      successMessage = `TAIL node (value ${nodeToDelete.value}) deleted - TAIL label moved to previous node!`;
    }

    toast.success(successMessage);
  };

  const traverseForward = async () => {
    if (list.length === 0) {
      toast.error("Cannot traverse - list is empty! Add some nodes first.");
      return;
    }

    toast.info(`Starting forward traversal of ${list.length} node${list.length === 1 ? '' : 's'}...`);

    for (const node of list) {
      setHighlightId(node.id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setHighlightId(null);
    toast.success(`Forward traversal complete! Visited ${list.length} node${list.length === 1 ? '' : 's'}.`);
  };

  const traverseBackward = async () => {
    if (list.length === 0) {
      toast.error("Cannot traverse - list is empty! Add some nodes first.");
      return;
    }

    toast.info(`Starting backward traversal of ${list.length} node${list.length === 1 ? '' : 's'}...`);

    for (let i = list.length - 1; i >= 0; i--) {
      setHighlightId(list[i].id);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setHighlightId(null);
    toast.success(`Backward traversal complete! Visited ${list.length} node${list.length === 1 ? '' : 's'}.`);
  };

  const controls = (
    <>
      <Tabs value={listType} onValueChange={(v) => setListType(v as "singly" | "doubly")}>
        <TabsList>
          <TabsTrigger value="singly">Singly Linked</TabsTrigger>
          <TabsTrigger value="doubly">Doubly Linked</TabsTrigger>
        </TabsList>
      </Tabs>
      <Input
        type="number"
        placeholder="Enter value"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="w-40"
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            const validation = validateInput();
            if (validation.isValid) {
              addNodeAtEnd();
            } else {
              toast.error(validation.error!);
            }
          }
        }}
      />
      <div className="flex gap-2">
        <Button
          onClick={addNodeAtBeginning}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add at Beginning
        </Button>
        <Button
          onClick={addNodeAtEnd}
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add at End
        </Button>
      </div>
      <Button onClick={traverseForward} variant="secondary" size="sm">
        <MoveRight className="h-4 w-4 mr-2" />
        Traverse Forward
      </Button>
      {listType === "doubly" && (
        <Button onClick={traverseBackward} variant="secondary" size="sm">
          <MoveLeft className="h-4 w-4 mr-2" />
          Traverse Backward
        </Button>
      )}
    </>
  );

  return (
    <VisualizationContainer
      title="Linked List Visualizer"
      description={
        listType === "singly"
          ? "A singly linked list where each node points to the next node."
          : "A doubly linked list where each node points to both the next and previous nodes."
      }
      controls={controls}
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-4">
        {list.map((node, index) => (
          <div key={node.id} className="flex items-center gap-2 animate-scale-in">
            <div className="flex flex-col items-center gap-2">
              <div
                className={`relative w-20 h-20 flex items-center justify-center rounded-lg border-2 text-lg font-semibold transition-all duration-300 ${highlightId === node.id
                  ? "bg-viz-active border-viz-active text-white scale-110 animate-pulse-glow"
                  : "bg-card border-border text-foreground hover:border-accent"
                  }`}
              >
                {node.value}
                {shouldShowHeadLabel(index) && shouldShowTailLabel(index) ? (
                  // Single node in doubly linked list - show both labels
                  <div className="absolute -top-8 w-full flex justify-between text-xs font-semibold text-accent">
                    <span>HEAD</span>
                    <span>TAIL</span>
                  </div>
                ) : (
                  <>
                    {shouldShowHeadLabel(index) && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-accent">
                        HEAD
                      </span>
                    )}
                    {shouldShowTailLabel(index) && (
                      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-accent">
                        TAIL
                      </span>
                    )}
                  </>
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
              <div className="flex flex-col items-center gap-1">
                <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                {listType === "doubly" && (
                  <ArrowLeft className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                )}
              </div>
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
