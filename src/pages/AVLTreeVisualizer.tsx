import { useState, useCallback } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface AVLNode {
  value: number;
  left: AVLNode | null;
  right: AVLNode | null;
  height: number;
  x?: number;
  y?: number;
  balanceFactor?: number;
}

interface BalanceStep {
  type: 'LL' | 'RR' | 'LR' | 'RL';
  pivotValue: number;
  description: string;
  treeBefore: AVLNode | null;
  treeAfter: AVLNode | null;
}

const getHeight = (node: AVLNode | null): number => {
  return node ? node.height : 0;
};

const getBalanceFactor = (node: AVLNode | null): number => {
  return node ? getHeight(node.left) - getHeight(node.right) : 0;
};

const updateHeight = (node: AVLNode): void => {
  node.height = 1 + Math.max(getHeight(node.left), getHeight(node.right));
};

const rightRotate = (y: AVLNode): AVLNode => {
  const x = y.left!;
  const T2 = x.right;

  x.right = y;
  y.left = T2;

  updateHeight(y);
  updateHeight(x);

  return x;
};

const leftRotate = (x: AVLNode): AVLNode => {
  const y = x.right!;
  const T2 = y.left;

  y.left = x;
  x.right = T2;

  updateHeight(x);
  updateHeight(y);

  return y;
};

const cloneTree = (node: AVLNode | null): AVLNode | null => {
  if (!node) return null;
  return {
    ...node,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
};

const insertNodeUnbalanced = (node: AVLNode | null, value: number): AVLNode => {
  if (!node) {
    return { value, left: null, right: null, height: 1 };
  }

  if (value < node.value) {
    node.left = insertNodeUnbalanced(node.left, value);
  } else if (value > node.value) {
    node.right = insertNodeUnbalanced(node.right, value);
  } else {
    return node; // Duplicate values not allowed
  }

  updateHeight(node);
  return node;
};

export const AVLTreeVisualizer = () => {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isBalancing, setIsBalancing] = useState(false);
  const [currentStep, setCurrentStep] = useState<BalanceStep | null>(null);
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [rotatingNode, setRotatingNode] = useState<number | null>(null);
  const [speed, setSpeed] = useState([500]);
  const { toast } = useToast();

  const addNode = () => {
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast({ title: "Invalid input", description: "Please enter a valid number", variant: "destructive" });
      return;
    }
    setRoot((prev) => cloneTree(insertNodeUnbalanced(cloneTree(prev), value)));
    setInputValue("");
  };

  const clearTree = () => {
    setRoot(null);
    setCurrentStep(null);
    setHighlightedNode(null);
    setRotatingNode(null);
  };

  const findImbalancedNode = (node: AVLNode | null): { node: AVLNode; parent: AVLNode | null; isLeft: boolean } | null => {
    if (!node) return null;

    // Check children first (bottom-up approach)
    const leftResult = findImbalancedNode(node.left);
    if (leftResult) return leftResult;

    const rightResult = findImbalancedNode(node.right);
    if (rightResult) return rightResult;

    // Check current node
    const bf = getBalanceFactor(node);
    if (Math.abs(bf) > 1) {
      return { node, parent: null, isLeft: false };
    }

    return null;
  };

  const balanceNode = (node: AVLNode): { balanced: AVLNode; step: BalanceStep } => {
    const bf = getBalanceFactor(node);
    const treeBefore = cloneTree(node);
    let treeAfter: AVLNode;
    let stepType: 'LL' | 'RR' | 'LR' | 'RL';
    let description: string;

    if (bf > 1 && getBalanceFactor(node.left) >= 0) {
      // LL Case - Right rotation
      stepType = 'LL';
      description = `Left-Left case: Performing right rotation at node ${node.value}`;
      treeAfter = rightRotate(node);
    } else if (bf > 1 && getBalanceFactor(node.left) < 0) {
      // LR Case - Left rotation on left child, then right rotation
      stepType = 'LR';
      description = `Left-Right case: Left rotation at ${node.left!.value}, then right rotation at ${node.value}`;
      node.left = leftRotate(node.left!);
      treeAfter = rightRotate(node);
    } else if (bf < -1 && getBalanceFactor(node.right) <= 0) {
      // RR Case - Left rotation
      stepType = 'RR';
      description = `Right-Right case: Performing left rotation at node ${node.value}`;
      treeAfter = leftRotate(node);
    } else {
      // RL Case - Right rotation on right child, then left rotation
      stepType = 'RL';
      description = `Right-Left case: Right rotation at ${node.right!.value}, then left rotation at ${node.value}`;
      node.right = rightRotate(node.right!);
      treeAfter = leftRotate(node);
    }

    return {
      balanced: treeAfter,
      step: {
        type: stepType,
        pivotValue: node.value,
        description,
        treeBefore,
        treeAfter: cloneTree(treeAfter),
      },
    };
  };

  const balanceTreeStep = useCallback((currentRoot: AVLNode | null): AVLNode | null => {
    if (!currentRoot) return null;

    // Balance children first
    currentRoot.left = balanceTreeStep(currentRoot.left);
    currentRoot.right = balanceTreeStep(currentRoot.right);
    updateHeight(currentRoot);

    const bf = getBalanceFactor(currentRoot);
    if (Math.abs(bf) > 1) {
      const { balanced } = balanceNode(currentRoot);
      return balanced;
    }

    return currentRoot;
  }, []);

  const balanceTree = async () => {
    if (!root) {
      toast({ title: "No tree", description: "Add some nodes first", variant: "destructive" });
      return;
    }

    setIsBalancing(true);
    let currentRoot = cloneTree(root);
    let hasImbalance = true;
    let iterations = 0;
    const maxIterations = 50;

    while (hasImbalance && iterations < maxIterations) {
      iterations++;
      const imbalanced = findImbalancedNode(currentRoot);

      if (!imbalanced) {
        hasImbalance = false;
        break;
      }

      // Highlight the imbalanced node
      setHighlightedNode(imbalanced.node.value);
      await new Promise((resolve) => setTimeout(resolve, speed[0]));

      // Show rotation
      setRotatingNode(imbalanced.node.value);
      const { balanced, step } = balanceNode(cloneTree(imbalanced.node)!);
      setCurrentStep(step);
      await new Promise((resolve) => setTimeout(resolve, speed[0]));

      // Apply the balance to the tree
      const applyBalance = (node: AVLNode | null, targetValue: number, newSubtree: AVLNode): AVLNode | null => {
        if (!node) return null;
        if (node.value === targetValue) return newSubtree;

        const newNode = { ...node };
        if (targetValue < node.value) {
          newNode.left = applyBalance(node.left, targetValue, newSubtree);
        } else {
          newNode.right = applyBalance(node.right, targetValue, newSubtree);
        }
        updateHeight(newNode);
        return newNode;
      };

      if (currentRoot?.value === imbalanced.node.value) {
        currentRoot = balanced;
      } else {
        currentRoot = applyBalance(currentRoot, imbalanced.node.value, balanced);
      }

      setRoot(cloneTree(currentRoot));
      setRotatingNode(null);
      setHighlightedNode(null);
      await new Promise((resolve) => setTimeout(resolve, speed[0] / 2));
    }

    setCurrentStep(null);
    setIsBalancing(false);
    toast({ title: "Tree Balanced!", description: "AVL tree is now balanced" });
  };

  const calculatePositions = (
    node: AVLNode | null,
    x: number,
    y: number,
    offset: number
  ): AVLNode | null => {
    if (!node) return null;
    const newNode = { ...node };
    newNode.x = x;
    newNode.y = y;
    newNode.balanceFactor = getBalanceFactor(node);
    newNode.left = calculatePositions(node.left, x - offset, y + 70, offset / 1.8);
    newNode.right = calculatePositions(node.right, x + offset, y + 70, offset / 1.8);
    return newNode;
  };

  const positionedRoot = calculatePositions(root, 400, 50, 150);

  const getNodeColor = (node: AVLNode): string => {
    if (rotatingNode === node.value) return "hsl(var(--chart-4))"; // Yellow - rotating
    if (highlightedNode === node.value) return "hsl(var(--destructive))"; // Red - imbalanced
    const bf = node.balanceFactor ?? 0;
    if (Math.abs(bf) > 1) return "hsl(var(--destructive))"; // Red - imbalanced
    return "hsl(var(--chart-2))"; // Green - balanced
  };

  const renderNode = (node: AVLNode | null): JSX.Element | null => {
    if (!node || node.x === undefined || node.y === undefined) return null;

    return (
      <g key={node.value}>
        {node.left && node.left.x !== undefined && node.left.y !== undefined && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.left.x}
            y2={node.left.y}
            className="stroke-muted-foreground"
            strokeWidth="2"
          />
        )}
        {node.right && node.right.x !== undefined && node.right.y !== undefined && (
          <line
            x1={node.x}
            y1={node.y}
            x2={node.right.x}
            y2={node.right.y}
            className="stroke-muted-foreground"
            strokeWidth="2"
          />
        )}
        {renderNode(node.left)}
        {renderNode(node.right)}
        <circle
          cx={node.x}
          cy={node.y}
          r="22"
          fill={getNodeColor(node)}
          className="transition-all duration-300"
        />
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          className="fill-primary-foreground font-semibold text-sm"
        >
          {node.value}
        </text>
        {/* Balance factor label */}
        <text
          x={node.x}
          y={node.y - 30}
          textAnchor="middle"
          className="fill-muted-foreground text-xs font-medium"
        >
          BF: {node.balanceFactor ?? 0}
        </text>
      </g>
    );
  };

  const isTreeBalanced = (): boolean => {
    const checkBalance = (node: AVLNode | null): boolean => {
      if (!node) return true;
      const bf = getBalanceFactor(node);
      return Math.abs(bf) <= 1 && checkBalance(node.left) && checkBalance(node.right);
    };
    return checkBalance(root);
  };

  const controls = (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter value"
          className="w-32"
          disabled={isBalancing}
          onKeyDown={(e) => e.key === "Enter" && addNode()}
        />
        <Button onClick={addNode} disabled={isBalancing}>Add Node</Button>
        <Button variant="outline" onClick={clearTree} disabled={isBalancing}>Clear</Button>
      </div>
      <div className="flex gap-2 items-center">
        <Button 
          onClick={balanceTree} 
          disabled={isBalancing || !root}
          variant="default"
          className="bg-chart-2 hover:bg-chart-2/90"
        >
          {isBalancing ? "Balancing..." : "Balance Tree"}
        </Button>
        {root && (
          <Badge variant={isTreeBalanced() ? "default" : "destructive"}>
            {isTreeBalanced() ? "Balanced" : "Unbalanced"}
          </Badge>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Animation Speed:</span>
        <Slider
          value={speed}
          onValueChange={setSpeed}
          min={200}
          max={1500}
          step={100}
          className="w-32"
          disabled={isBalancing}
        />
        <span className="text-sm text-muted-foreground">{speed[0]}ms</span>
      </div>
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-chart-2"></div>
          <span className="text-muted-foreground">Balanced</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-destructive"></div>
          <span className="text-muted-foreground">Imbalanced</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-chart-4"></div>
          <span className="text-muted-foreground">Rotating</span>
        </div>
      </div>
    </div>
  );

  return (
    <VisualizationContainer
      title="AVL Tree Visualizer"
      description="Build an unbalanced BST, then watch step-by-step AVL balancing with rotations. BF = Balance Factor (left height - right height)."
      controls={controls}
    >
      <div className="w-full min-h-[400px] relative">
        {currentStep && (
          <div className="absolute top-0 left-0 right-0 bg-muted/90 backdrop-blur-sm p-3 rounded-lg border z-10">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-chart-4 border-chart-4">
                {currentStep.type} Rotation
              </Badge>
              <span className="text-sm">{currentStep.description}</span>
            </div>
          </div>
        )}
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {positionedRoot ? (
            renderNode(positionedRoot)
          ) : (
            <text x="400" y="200" textAnchor="middle" className="fill-muted-foreground">
              Add nodes to build your tree
            </text>
          )}
        </svg>
      </div>
    </VisualizationContainer>
  );
};
