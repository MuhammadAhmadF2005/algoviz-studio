import { useState } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, RotateCcw } from "lucide-react";

interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
}

const initialTree: TreeNode = {
  value: 50,
  left: { value: 30, left: { value: 20, left: null, right: null }, right: { value: 40, left: null, right: null } },
  right: { value: 70, left: { value: 60, left: null, right: null }, right: { value: 80, left: null, right: null } },
};

export const TreeVisualizer = () => {
  const [root, setRoot] = useState<TreeNode | null>(JSON.parse(JSON.stringify(initialTree)));
  const [inputValue, setInputValue] = useState("");
  const [highlightValue, setHighlightValue] = useState<number | null>(null);
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);

  const insertNode = (node: TreeNode | null, value: number): TreeNode => {
    if (!node) return { value, left: null, right: null };
    if (value < node.value) node.left = insertNode(node.left, value);
    else if (value > node.value) node.right = insertNode(node.right, value);
    return node;
  };

  const deleteNode = (node: TreeNode | null, value: number): TreeNode | null => {
    if (!node) return null;
    if (value < node.value) {
      node.left = deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = deleteNode(node.right, value);
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      let minRight = node.right;
      while (minRight.left) minRight = minRight.left;
      node.value = minRight.value;
      node.right = deleteNode(node.right, minRight.value);
    }
    return node;
  };

  const addNode = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    setRoot(insertNode(root, value));
    setInputValue("");
    toast.success("Node added!");
  };

  const removeNode = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }
    setRoot(deleteNode(root, value));
    setInputValue("");
    toast.success("Node deleted!");
  };

  const inorder = async (node: TreeNode | null, result: number[] = []) => {
    if (!node) return result;
    await inorder(node.left, result);
    result.push(node.value);
    setHighlightValue(node.value);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await inorder(node.right, result);
    return result;
  };

  const preorder = async (node: TreeNode | null, result: number[] = []) => {
    if (!node) return result;
    result.push(node.value);
    setHighlightValue(node.value);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await preorder(node.left, result);
    await preorder(node.right, result);
    return result;
  };

  const postorder = async (node: TreeNode | null, result: number[] = []) => {
    if (!node) return result;
    await postorder(node.left, result);
    await postorder(node.right, result);
    result.push(node.value);
    setHighlightValue(node.value);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return result;
  };

  const runTraversal = async (type: "inorder" | "preorder" | "postorder") => {
    setTraversalOrder([]);
    setHighlightValue(null);
    let result: number[] = [];
    if (type === "inorder") result = await inorder(root);
    else if (type === "preorder") result = await preorder(root);
    else result = await postorder(root);
    setTraversalOrder(result);
    setHighlightValue(null);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} traversal complete!`);
  };

  const resetTree = () => {
    setRoot(JSON.parse(JSON.stringify(initialTree)));
    setHighlightValue(null);
    setTraversalOrder([]);
    setInputValue("");
    toast.success("Tree reset to original state!");
  };

  const calculatePositions = (
    node: TreeNode | null,
    x: number,
    y: number,
    offset: number
  ): TreeNode | null => {
    if (!node) return null;
    const newNode = { ...node, x, y };
    newNode.left = calculatePositions(node.left, x - offset, y + 80, offset / 2);
    newNode.right = calculatePositions(node.right, x + offset, y + 80, offset / 2);
    return newNode;
  };

  const positionedRoot = calculatePositions(root, 400, 50, 100);

  const renderNode = (node: TreeNode | null): JSX.Element | null => {
    if (!node || node.x === undefined || node.y === undefined) return null;
    return (
      <g key={`${node.value}-${node.x}-${node.y}`}>
        {node.left && node.left.x !== undefined && node.left.y !== undefined && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            stroke="hsl(var(--border))"
            strokeWidth="2"
            className="transition-all duration-300"
          />
        )}
        {node.right && node.right.x !== undefined && node.right.y !== undefined && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            stroke="hsl(var(--border))"
            strokeWidth="2"
            className="transition-all duration-300"
          />
        )}
        <circle
          cx={node.x}
          cy={node.y}
          r="25"
          fill={
            highlightValue === node.value
              ? "hsl(var(--viz-active))"
              : "hsl(var(--card))"
          }
          stroke={
            highlightValue === node.value
              ? "hsl(var(--viz-active))"
              : "hsl(var(--border))"
          }
          strokeWidth="2"
          className="transition-all duration-300"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dy=".3em"
          fill={
            highlightValue === node.value
              ? "white"
              : "hsl(var(--foreground))"
          }
          className="text-sm font-semibold transition-all duration-300"
        >
          {node.value}
        </text>
        {renderNode(node.left)}
        {renderNode(node.right)}
      </g>
    );
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
        Add
      </Button>
      <Button onClick={removeNode} variant="destructive" size="sm">
        <Trash2 className="h-4 w-4 mr-2" />
        Delete
      </Button>
      <Button onClick={resetTree} variant="outline" size="sm">
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset
      </Button>
      <div className="h-6 w-px bg-border" />
      <Button onClick={() => runTraversal("inorder")} variant="secondary" size="sm">
        Inorder
      </Button>
      <Button onClick={() => runTraversal("preorder")} variant="secondary" size="sm">
        Preorder
      </Button>
      <Button onClick={() => runTraversal("postorder")} variant="secondary" size="sm">
        Postorder
      </Button>
    </>
  );

  return (
    <VisualizationContainer
      title="Binary Tree Visualizer"
      description="A binary search tree where each node has at most two children. Left child < parent < right child."
      controls={controls}
    >
      <div className="w-full h-full flex flex-col items-center gap-4 overflow-auto max-h-[600px]">
        <div className="min-w-max p-8">
          <svg width="800" height="600" className="overflow-visible">
            {renderNode(positionedRoot)}
          </svg>
        </div>
        {traversalOrder.length > 0 && (
          <div className="flex gap-2 items-center flex-wrap justify-center px-4">
            <span className="text-sm font-semibold text-muted-foreground">Order:</span>
            {traversalOrder.map((value, index) => (
              <div
                key={index}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-success text-success-foreground font-semibold text-sm animate-scale-in"
              >
                {value}
              </div>
            ))}
          </div>
        )}
      </div>
    </VisualizationContainer>
  );
};
