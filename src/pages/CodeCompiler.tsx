import { useState } from "react";
import { VisualizationContainer } from "@/components/VisualizationContainer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Chatbot } from "@/components/Chatbot";
import { toast } from "sonner";
import { Play, RotateCcw, Code, Bot } from "lucide-react";

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

type Language = "javascript" | "python" | "cpp";

interface LanguageConfig {
  name: string;
  defaultCode: string;
  fileExtension: string;
}

const languageConfigs: Record<Language, LanguageConfig> = {
  javascript: {
    name: "JavaScript",
    fileExtension: "js",
    defaultCode: `// Example: Array Operations
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
queue.shift();`,
  },
  python: {
    name: "Python",
    fileExtension: "py",
    defaultCode: `# Example: List Operations
arr = []
arr.append(10)
arr.append(20)
arr.append(30)
arr.pop()

# Example: Stack Operations (using list)
stack = []
stack.append(1)
stack.append(2)
stack.append(3)
stack.pop()

# Example: Queue Operations (using list)
queue = []
queue.append(100)
queue.append(200)
queue.pop(0)  # Remove from front`,
  },
  cpp: {
    name: "C++",
    fileExtension: "cpp",
    defaultCode: `// Example: Vector Operations
#include <vector>
#include <stack>
#include <queue>

std::vector<int> arr;
arr.push_back(10);
arr.push_back(20);
arr.push_back(30);
arr.pop_back();

// Example: Stack Operations
std::stack<int> stack;
stack.push(1);
stack.push(2);
stack.push(3);
stack.pop();

// Example: Queue Operations
std::queue<int> queue;
queue.push(100);
queue.push(200);
queue.pop();`,
  },
};

export const CodeCompiler = () => {
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState(languageConfigs.javascript.defaultCode);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [currentState, setCurrentState] = useState<VisualizationState>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  // Language-specific parsers
  const parseJavaScript = (code: string): Operation[] => {
    const operations: Operation[] = [];
    const lines = code.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || !trimmed) continue;

      // Match variable.method(value) patterns
      const pushMatch = trimmed.match(/(\w+)\.push\(([^)]+)\)/);
      const popMatch = trimmed.match(/(\w+)\.pop\(\)/);
      const shiftMatch = trimmed.match(/(\w+)\.shift\(\)/);
      const unshiftMatch = trimmed.match(/(\w+)\.unshift\(([^)]+)\)/);

      if (pushMatch) {
        operations.push({
          type: "push",
          value: pushMatch[2].replace(/['"]/g, ""),
          structure: pushMatch[1],
          timestamp: Date.now(),
        });
      } else if (popMatch) {
        operations.push({
          type: "pop",
          structure: popMatch[1],
          timestamp: Date.now(),
        });
      } else if (shiftMatch) {
        operations.push({
          type: "shift",
          structure: shiftMatch[1],
          timestamp: Date.now(),
        });
      } else if (unshiftMatch) {
        operations.push({
          type: "unshift",
          value: unshiftMatch[2].replace(/['"]/g, ""),
          structure: unshiftMatch[1],
          timestamp: Date.now(),
        });
      }
    }

    return operations;
  };

  const parsePython = (code: string): Operation[] => {
    const operations: Operation[] = [];
    const lines = code.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("#") || !trimmed) continue;

      // Match variable.method(value) patterns
      const appendMatch = trimmed.match(/(\w+)\.append\(([^)]+)\)/);
      const popMatch = trimmed.match(/(\w+)\.pop\((\d*)\)/);
      const insertMatch = trimmed.match(/(\w+)\.insert\(0,\s*([^)]+)\)/);

      if (appendMatch) {
        operations.push({
          type: "push",
          value: appendMatch[2].replace(/['"]/g, ""),
          structure: appendMatch[1],
          timestamp: Date.now(),
        });
      } else if (popMatch) {
        const index = popMatch[2];
        operations.push({
          type: index === "0" ? "shift" : "pop",
          structure: popMatch[1],
          timestamp: Date.now(),
        });
      } else if (insertMatch) {
        operations.push({
          type: "unshift",
          value: insertMatch[2].replace(/['"]/g, ""),
          structure: insertMatch[1],
          timestamp: Date.now(),
        });
      }
    }

    return operations;
  };

  const parseCpp = (code: string): Operation[] => {
    const operations: Operation[] = [];
    const lines = code.split("\n");

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("#") || !trimmed)
        continue;

      // Match variable.method(value) patterns
      const pushBackMatch = trimmed.match(/(\w+)\.push_back\(([^)]+)\)/);
      const popBackMatch = trimmed.match(/(\w+)\.pop_back\(\)/);
      const stackPushMatch = trimmed.match(/(\w+)\.push\(([^)]+)\)/);
      const stackPopMatch = trimmed.match(/(\w+)\.pop\(\)/);

      if (pushBackMatch) {
        operations.push({
          type: "push",
          value: pushBackMatch[2],
          structure: pushBackMatch[1],
          timestamp: Date.now(),
        });
      } else if (popBackMatch) {
        operations.push({
          type: "pop",
          structure: popBackMatch[1],
          timestamp: Date.now(),
        });
      } else if (
        stackPushMatch &&
        (trimmed.includes("stack") || trimmed.includes("queue"))
      ) {
        operations.push({
          type: "push",
          value: stackPushMatch[2],
          structure: stackPushMatch[1],
          timestamp: Date.now(),
        });
      } else if (stackPopMatch && trimmed.includes("stack")) {
        operations.push({
          type: "pop",
          structure: stackPopMatch[1],
          timestamp: Date.now(),
        });
      } else if (stackPopMatch && trimmed.includes("queue")) {
        operations.push({
          type: "shift",
          structure: stackPopMatch[1],
          timestamp: Date.now(),
        });
      }
    }

    return operations;
  };

  const executeCode = async () => {
    setIsExecuting(true);
    setOperations([]);
    setCurrentState({});

    try {
      let parsedOps: Operation[] = [];

      // Parse operations based on selected language
      switch (language) {
        case "javascript":
          parsedOps = parseJavaScript(code);
          break;
        case "python":
          parsedOps = parsePython(code);
          break;
        case "cpp":
          parsedOps = parseCpp(code);
          break;
      }

      if (parsedOps.length === 0) {
        toast.error("No valid operations found in the code!");
        return;
      }

      // Simulate execution by applying operations to data structures
      const state: VisualizationState = {};

      // Initialize data structures mentioned in operations
      const structures = new Set(parsedOps.map((op) => op.structure));
      structures.forEach((name) => {
        state[name as keyof VisualizationState] = [];
      });

      // Animate operations
      for (let i = 0; i < parsedOps.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, animationSpeed));

        const op = parsedOps[i];
        const structure = state[
          op.structure as keyof VisualizationState
        ] as any[];

        // Apply operation to the data structure
        switch (op.type) {
          case "push":
            structure.push(op.value);
            break;
          case "pop":
            structure.pop();
            break;
          case "shift":
            structure.shift();
            break;
          case "unshift":
            structure.unshift(op.value);
            break;
        }

        setOperations(parsedOps.slice(0, i + 1));
        setCurrentState({ ...state });
      }

      toast.success(`Executed ${parsedOps.length} operations!`);
    } catch (error) {
      console.error("Execution error:", error);
      toast.error(
        `Error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    } finally {
      setIsExecuting(false);
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setCode(languageConfigs[newLanguage].defaultCode);
    setOperations([]);
    setCurrentState({});
  };

  const resetCode = () => {
    setCode(languageConfigs[language].defaultCode);
    setOperations([]);
    setCurrentState({});
    toast.success("Code reset to example!");
  };

  const controls = (
    <>
      <div className="flex items-center gap-2">
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="javascript">JavaScript</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="cpp">C++</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={executeCode} disabled={isExecuting} size="sm">
        <Play className="h-4 w-4 mr-2" />
        Execute Code
      </Button>
      <Button onClick={resetCode} variant="secondary" size="sm">
        <RotateCcw className="h-4 w-4 mr-2" />
        Reset to Example
      </Button>
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Bot className="h-4 w-4 mr-2" />
            AI Assistant
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl h-3/4 flex flex-col">
          <DialogHeader>
            <DialogTitle>AI Assistant</DialogTitle>
          </DialogHeader>
          <Chatbot />
        </DialogContent>
      </Dialog>
      <div className="flex items-center gap-2">
        <Label htmlFor="speed-slider">Animation Speed</Label>
        <Slider
          id="speed-slider"
          min={100}
          max={2000}
          step={100}
          value={[animationSpeed]}
          onValueChange={(value) => setAnimationSpeed(value[0])}
          className="w-32"
          disabled={isExecuting}
        />
      </div>
    </>
  );

  return (
    <VisualizationContainer
      title={`${languageConfigs[language].name} Code Compiler`}
      description={`Write ${languageConfigs[language].name} code using arrays, stacks, and queues. Operations will be visualized step-by-step.`}
      controls={controls}
    >
      <div className="w-full space-y-6">
        {/* Code Editor */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Code className="h-4 w-4" />
            Code Editor ({languageConfigs[language].name})
          </div>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="font-mono text-sm min-h-[300px] bg-muted/50"
            placeholder={`Write your ${languageConfigs[language].name} code here...`}
            disabled={isExecuting}
          />
        </div>

        {/* Operations Log */}
        {operations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">
              Operations ({operations.length})
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 max-h-[150px] overflow-y-auto">
              {operations.map((op, idx) => (
                <div
                  key={idx}
                  className="text-sm text-muted-foreground py-1 animate-fade-in"
                >
                  <span className="font-mono text-accent">{op.structure}</span>.
                  <span className="font-semibold text-foreground">
                    {op.type}
                  </span>
                  {op.value !== undefined && (
                    <span className="text-muted-foreground">
                      {" "}
                      ({op.value})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Visualization */}
        {Object.keys(currentState).length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              Data Structures
            </h3>
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
                      <div className="text-sm text-muted-foreground italic">
                        Empty
                      </div>
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
