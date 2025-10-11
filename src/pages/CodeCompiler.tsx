import { useState } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Play, RotateCcw, Code } from "lucide-react";

interface Operation {
  type: string;
  value?: any;
  structure: string;
  timestamp: number;
}

interface VisualizationState {
  array?: any[];
  stack?: any[];
  queue?: any[];
  linkedList?: any[];
}

export const CodeCompiler = () => {
  const [code, setCode] = useState(`// Example: Array Operations
const arr = [];
arr.push(10);
arr.push(20);
arr.push(30);
arr.pop();

// Example: Stack Operations
const stack = [];
stack.push(1);
stack.push(2);
stack.push(3);
stack.pop();

// Example: Queue Operations
const queue = [];
queue.push(100);
queue.push(200);
queue.shift();
`);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [currentState, setCurrentState] = useState<VisualizationState>({});
  const [isExecuting, setIsExecuting] = useState(false);

  const executeCode = async () => {
    setIsExecuting(true);
    setOperations([]);
    setCurrentState({});

    const trackedOps: Operation[] = [];
    const state: VisualizationState = {};

    try {
      // Create a sandboxed execution environment
      const createTrackedArray = (name: string) => {
        const arr: any[] = [];
        state[name as keyof VisualizationState] = arr;

        return new Proxy(arr, {
          get(target, prop) {
            if (prop === 'push') {
              return (...args: any[]) => {
                const result = Array.prototype.push.apply(target, args);
                trackedOps.push({
                  type: 'push',
                  value: args[0],
                  structure: name,
                  timestamp: Date.now(),
                });
                return result;
              };
            }
            if (prop === 'pop') {
              return () => {
                const value = Array.prototype.pop.apply(target);
                trackedOps.push({
                  type: 'pop',
                  value,
                  structure: name,
                  timestamp: Date.now(),
                });
                return value;
              };
            }
            if (prop === 'shift') {
              return () => {
                const value = Array.prototype.shift.apply(target);
                trackedOps.push({
                  type: 'shift',
                  value,
                  structure: name,
                  timestamp: Date.now(),
                });
                return value;
              };
            }
            if (prop === 'unshift') {
              return (...args: any[]) => {
                const result = Array.prototype.unshift.apply(target, args);
                trackedOps.push({
                  type: 'unshift',
                  value: args[0],
                  structure: name,
                  timestamp: Date.now(),
                });
                return result;
              };
            }
            return Reflect.get(target, prop);
          },
        });
      };

      // Parse code to detect variable declarations
      const variableNames = new Set<string>();
      const varMatches = code.matchAll(/(?:const|let|var)\s+(\w+)\s*=/g);
      for (const match of varMatches) {
        variableNames.add(match[1]);
      }

      // Create tracked arrays for detected variables
      const trackedVars: Record<string, any> = {};
      variableNames.forEach((name) => {
        trackedVars[name] = createTrackedArray(name);
      });

      // Execute the code with tracked variables
      const executeFunction = new Function(
        ...Object.keys(trackedVars),
        `${code}\nreturn { ${Array.from(variableNames).join(', ')} };`
      );

      executeFunction(...Object.values(trackedVars));

      // Animate operations
      for (let i = 0; i < trackedOps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOperations(trackedOps.slice(0, i + 1));
        
        // Update current state for visualization
        const currentOp = trackedOps[i];
        setCurrentState((prev) => ({
          ...prev,
          [currentOp.structure]: [...(state[currentOp.structure as keyof VisualizationState] || [])],
        }));
      }

      toast.success(`Executed ${trackedOps.length} operations!`);
    } catch (error) {
      console.error("Execution error:", error);
      toast.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const resetCode = () => {
    setCode(`// Example: Array Operations
const arr = [];
arr.push(10);
arr.push(20);
arr.push(30);
arr.pop();

// Example: Stack Operations
const stack = [];
stack.push(1);
stack.push(2);
stack.push(3);
stack.pop();

// Example: Queue Operations
const queue = [];
queue.push(100);
queue.push(200);
queue.shift();
`);
    setOperations([]);
    setCurrentState({});
    toast.success("Code reset to example!");
  };

  const controls = (
    <>
      <Button onClick={executeCode} disabled={isExecuting} size="sm">
        <Play className="h-4 w-4 mr-2" />
        Execute Code
      </Button>
      <Button onClick={resetCode} variant="secondary" size="sm">
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset to Example
      </Button>
    </>
  );

  return (
    <VisualizationContainer
      title="JavaScript Code Compiler"
      description="Write JavaScript code using arrays, stacks, and queues. Operations will be visualized step-by-step."
      controls={controls}
    >
      <div className="w-full space-y-6">
        {/* Code Editor */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Code className="h-4 w-4" />
            Code Editor
          </div>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm min-h-[300px] bg-muted/50"
            placeholder="Write your JavaScript code here..."
            disabled={isExecuting}
          />
        </div>

        {/* Operations Log */}
        {operations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Operations ({operations.length})</h3>
            <div className="bg-muted/50 rounded-lg p-4 max-h-[150px] overflow-y-auto">
              {operations.map((op, idx) => (
                <div
                  key={idx}
                  className="text-sm text-muted-foreground py-1 animate-fade-in"
                >
                  <span className="font-mono text-accent">{op.structure}</span>.
                  <span className="font-semibold text-foreground">{op.type}</span>
                  {op.value !== undefined && (
                    <span className="text-muted-foreground"> ({op.value})</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visualization */}
        {Object.keys(currentState).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Data Structures</h3>
            <div className="space-y-4">
              {Object.entries(currentState).map(([name, values]) => (
                <div key={name} className="space-y-2">
                  <div className="text-sm font-medium text-accent">{name}</div>
                  <div className="flex gap-2 flex-wrap">
                    {values && values.length > 0 ? (
                      values.map((value, idx) => (
                        <div
                          key={idx}
                          className="w-16 h-16 flex items-center justify-center rounded-lg border-2 border-border bg-card text-foreground font-semibold animate-scale-in"
                        >
                          {value}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground italic">Empty</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </VisualizationContainer>
  );
};
