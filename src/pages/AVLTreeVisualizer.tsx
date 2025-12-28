import { useState, useCallback, useRef } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pause, Play, RotateCcw } from "lucide-react";

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
  detailedExplanation: string;
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
    return node;
  }

  updateHeight(node);
  return node;
};

export const AVLTreeVisualizer = () => {
  const [root, setRoot] = useState<AVLNode | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isBalancing, setIsBalancing] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentStep, setCurrentStep] = useState<BalanceStep | null>(null);
  const [stepPhase, setStepPhase] = useState<'detecting' | 'rotating' | 'complete' | null>(null);
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [rotatingNode, setRotatingNode] = useState<number | null>(null);
  const [speed, setSpeed] = useState([1500]);
  const [stepCount, setStepCount] = useState(0);
  const pauseRef = useRef(false);
  const { toast } = useToast();

  const waitWithPause = async (ms: number) => {
    const interval = 50;
    let elapsed = 0;
    while (elapsed < ms) {
      if (pauseRef.current) {
        await new Promise((resolve) => setTimeout(resolve, interval));
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, interval));
      elapsed += interval;
    }
  };

  const togglePause = () => {
    pauseRef.current = !pauseRef.current;
    setIsPaused(!isPaused);
  };

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
    setStepPhase(null);
    setStepCount(0);
    pauseRef.current = false;
    setIsPaused(false);
  };

  const findImbalancedNode = (node: AVLNode | null): { node: AVLNode; parent: AVLNode | null; isLeft: boolean } | null => {
    if (!node) return null;

    const leftResult = findImbalancedNode(node.left);
    if (leftResult) return leftResult;

    const rightResult = findImbalancedNode(node.right);
    if (rightResult) return rightResult;

    const bf = getBalanceFactor(node);
    if (Math.abs(bf) > 1) {
      return { node, parent: null, isLeft: false };
    }

    return null;
  };

  const getRotationExplanation = (type: 'LL' | 'RR' | 'LR' | 'RL', nodeValue: number, bf: number, childBf: number): string => {
    switch (type) {
      case 'LL':
        return `Node ${nodeValue} has balance factor ${bf} (left-heavy). Its left child has BF ≥ 0, indicating a Left-Left imbalance. Solution: Perform a single RIGHT rotation. The left child becomes the new root of this subtree, the original node becomes its right child.`;
      case 'RR':
        return `Node ${nodeValue} has balance factor ${bf} (right-heavy). Its right child has BF ≤ 0, indicating a Right-Right imbalance. Solution: Perform a single LEFT rotation. The right child becomes the new root of this subtree, the original node becomes its left child.`;
      case 'LR':
        return `Node ${nodeValue} has balance factor ${bf} (left-heavy). Its left child has BF < 0 (right-heavy), indicating a Left-Right imbalance. Solution: First perform LEFT rotation on the left child, then RIGHT rotation on this node. This is a double rotation.`;
      case 'RL':
        return `Node ${nodeValue} has balance factor ${bf} (right-heavy). Its right child has BF > 0 (left-heavy), indicating a Right-Left imbalance. Solution: First perform RIGHT rotation on the right child, then LEFT rotation on this node. This is a double rotation.`;
    }
  };

  const balanceNode = (node: AVLNode): { balanced: AVLNode; step: BalanceStep } => {
    const bf = getBalanceFactor(node);
    const treeBefore = cloneTree(node);
    let treeAfter: AVLNode;
    let stepType: 'LL' | 'RR' | 'LR' | 'RL';
    let description: string;
    let childBf: number;

    if (bf > 1 && getBalanceFactor(node.left) >= 0) {
      stepType = 'LL';
      childBf = getBalanceFactor(node.left);
      description = `Left-Left Case: Right rotation at node ${node.value}`;
      treeAfter = rightRotate(node);
    } else if (bf > 1 && getBalanceFactor(node.left) < 0) {
      stepType = 'LR';
      childBf = getBalanceFactor(node.left);
      description = `Left-Right Case: Left rotation at ${node.left!.value}, then right rotation at ${node.value}`;
      node.left = leftRotate(node.left!);
      treeAfter = rightRotate(node);
    } else if (bf < -1 && getBalanceFactor(node.right) <= 0) {
      stepType = 'RR';
      childBf = getBalanceFactor(node.right);
      description = `Right-Right Case: Left rotation at node ${node.value}`;
      treeAfter = leftRotate(node);
    } else {
      stepType = 'RL';
      childBf = getBalanceFactor(node.right);
      description = `Right-Left Case: Right rotation at ${node.right!.value}, then left rotation at ${node.value}`;
      node.right = rightRotate(node.right!);
      treeAfter = leftRotate(node);
    }

    return {
      balanced: treeAfter,
      step: {
        type: stepType,
        pivotValue: node.value,
        description,
        detailedExplanation: getRotationExplanation(stepType, node.value, bf, childBf),
        treeBefore,
        treeAfter: cloneTree(treeAfter),
      },
    };
  };

  const balanceTree = async () => {
    if (!root) {
      toast({ title: "No tree", description: "Add some nodes first", variant: "destructive" });
      return;
    }

    setIsBalancing(true);
    setStepCount(0);
    pauseRef.current = false;
    setIsPaused(false);
    
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

      setStepCount((prev) => prev + 1);

      // Phase 1: Detecting imbalance
      setStepPhase('detecting');
      setHighlightedNode(imbalanced.node.value);
      const bf = getBalanceFactor(imbalanced.node);
      setCurrentStep({
        type: 'LL',
        pivotValue: imbalanced.node.value,
        description: `Detected imbalance at node ${imbalanced.node.value}`,
        detailedExplanation: `Node ${imbalanced.node.value} has a balance factor of ${bf}. A balanced AVL node must have BF between -1 and 1. Since |${bf}| > 1, this node needs rebalancing. Analyzing the structure to determine rotation type...`,
        treeBefore: null,
        treeAfter: null,
      });
      await waitWithPause(speed[0]);

      // Phase 2: Performing rotation
      setStepPhase('rotating');
      setRotatingNode(imbalanced.node.value);
      const { balanced, step } = balanceNode(cloneTree(imbalanced.node)!);
      setCurrentStep(step);
      await waitWithPause(speed[0] * 1.5);

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

      // Phase 3: Show result
      setStepPhase('complete');
      setRoot(cloneTree(currentRoot));
      setRotatingNode(null);
      setHighlightedNode(null);
      setCurrentStep({
        ...step,
        description: `Rotation complete! Subtree is now balanced.`,
        detailedExplanation: `The ${step.type} rotation was successful. The new subtree root is ${balanced.value}. All nodes in this subtree now have balance factors between -1 and 1. Checking for more imbalances...`,
      });
      await waitWithPause(speed[0]);
    }

    setCurrentStep(null);
    setStepPhase(null);
    setIsBalancing(false);
    pauseRef.current = false;
    setIsPaused(false);
    toast({ title: "Tree Balanced!", description: `Completed in ${iterations - 1} rotation(s)` });
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
    if (rotatingNode === node.value) return "#eab308";
    if (highlightedNode === node.value) return "#ef4444";
    const bf = node.balanceFactor ?? 0;
    if (Math.abs(bf) > 1) return "#ef4444";
    return "#22c55e";
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
          className="transition-all duration-500"
        />
        <text
          x={node.x}
          y={node.y + 5}
          textAnchor="middle"
          fill="white"
          className="font-semibold text-sm"
        >
          {node.value}
        </text>
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

  const getPhaseLabel = () => {
    switch (stepPhase) {
      case 'detecting': return 'Detecting Imbalance';
      case 'rotating': return 'Performing Rotation';
      case 'complete': return 'Rotation Complete';
      default: return '';
    }
  };

  const controls = (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
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
        <Button variant="outline" onClick={clearTree} disabled={isBalancing}>
          <RotateCcw className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
      
      <div className="flex gap-2 items-center flex-wrap">
        <Button 
          onClick={balanceTree} 
          disabled={isBalancing || !root || isTreeBalanced()}
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          {isBalancing ? "Balancing..." : "Balance Tree"}
        </Button>
        
        {isBalancing && (
          <Button 
            onClick={togglePause}
            variant="outline"
            className="gap-1"
          >
            {isPaused ? (
              <>
                <Play className="h-4 w-4" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" />
                Pause
              </>
            )}
          </Button>
        )}
        
        {root && (
          <Badge variant={isTreeBalanced() ? "default" : "destructive"}>
            {isTreeBalanced() ? "Balanced" : "Unbalanced"}
          </Badge>
        )}
        
        {isBalancing && stepCount > 0 && (
          <Badge variant="secondary">Step {stepCount}</Badge>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">Animation Speed:</span>
        <Slider
          value={speed}
          onValueChange={setSpeed}
          min={500}
          max={3000}
          step={250}
          className="w-40"
          disabled={isBalancing}
        />
        <span className="text-sm text-muted-foreground">{(speed[0] / 1000).toFixed(1)}s</span>
      </div>
      
      <div className="flex gap-4 text-xs flex-wrap">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-muted-foreground">Balanced (|BF| ≤ 1)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-muted-foreground">Imbalanced (|BF| &gt; 1)</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span className="text-muted-foreground">Currently Rotating</span>
        </div>
      </div>
    </div>
  );

  return (
    <VisualizationContainer
      title="AVL Tree Visualizer"
      description="Build an unbalanced BST by adding nodes, then click 'Balance Tree' to watch step-by-step AVL rotations. BF = Balance Factor (left subtree height − right subtree height)."
      controls={controls}
    >
      <div className="w-full min-h-[450px] relative">
        {currentStep && (
          <div className="absolute top-0 left-0 right-0 bg-card/95 backdrop-blur-sm p-4 rounded-lg border shadow-lg z-10 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              {stepPhase && (
                <Badge 
                  variant="outline" 
                  className={
                    stepPhase === 'detecting' ? 'text-red-500 border-red-500' :
                    stepPhase === 'rotating' ? 'text-yellow-500 border-yellow-500' :
                    'text-emerald-500 border-emerald-500'
                  }
                >
                  {getPhaseLabel()}
                </Badge>
              )}
              {currentStep.type && stepPhase === 'rotating' && (
                <Badge className="bg-blue-600 text-white">
                  {currentStep.type} Rotation
                </Badge>
              )}
              {isPaused && (
                <Badge variant="secondary" className="animate-pulse">
                  Paused
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium">{currentStep.description}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {currentStep.detailedExplanation}
            </p>
          </div>
        )}
        
        <svg viewBox="0 0 800 400" className="w-full h-full mt-2">
          {positionedRoot ? (
            renderNode(positionedRoot)
          ) : (
            <text x="400" y="200" textAnchor="middle" className="fill-muted-foreground">
              Add nodes to build your tree (try: 50, 30, 70, 20, 10)
            </text>
          )}
        </svg>
      </div>
    </VisualizationContainer>
  );
};
