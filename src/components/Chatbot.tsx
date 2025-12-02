import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Sparkles, HelpCircle } from "lucide-react";
import { sendMessageToAI } from "@/lib/gemini";
import { cn } from "@/lib/utils";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const quickQuestions = [
  "What is Big O notation?",
  "Explain bubble sort",
  "How does a stack work?",
  "Binary search vs linear search",
];

const algorithmFAQs: Record<string, string> = {
  "bubble sort": `**Bubble Sort** compares adjacent elements and swaps them if they're in the wrong order. It repeats until the array is sorted.

**Time Complexity:** O(n²) average/worst, O(n) best
**Space Complexity:** O(1)
**Best for:** Small datasets or nearly sorted arrays`,

  "selection sort": `**Selection Sort** finds the minimum element and places it at the beginning, then repeats for the remaining array.

**Time Complexity:** O(n²) for all cases
**Space Complexity:** O(1)
**Best for:** Small datasets where memory writes are costly`,

  "quick sort": `**Quick Sort** uses divide-and-conquer with a pivot element to partition the array.

**Time Complexity:** O(n log n) average, O(n²) worst
**Space Complexity:** O(log n)
**Best for:** Large datasets, general-purpose sorting`,

  "merge sort": `**Merge Sort** divides the array in half, sorts each half, then merges them back together.

**Time Complexity:** O(n log n) for all cases
**Space Complexity:** O(n)
**Best for:** Stable sorting, linked lists, external sorting`,

  "linked list": `**Linked List** is a linear data structure where elements are stored in nodes, each pointing to the next.

**Operations:**
- Insert/Delete at head: O(1)
- Search/Access: O(n)
- Insert/Delete at position: O(n)

**Types:** Singly, Doubly, Circular`,

  "binary search": `**Binary Search** finds an element in a sorted array by repeatedly dividing the search interval in half.

**Time Complexity:** O(log n)
**Space Complexity:** O(1) iterative, O(log n) recursive
**Requirement:** Array must be sorted`,

  "stack": `**Stack** is a LIFO (Last In, First Out) data structure.

**Operations:**
- Push: O(1)
- Pop: O(1)
- Peek: O(1)

**Use cases:** Undo operations, expression evaluation, backtracking`,

  "queue": `**Queue** is a FIFO (First In, First Out) data structure.

**Operations:**
- Enqueue: O(1)
- Dequeue: O(1)
- Peek: O(1)

**Use cases:** BFS, task scheduling, print queues`,

  "big o": `**Big O Notation** describes the upper bound of an algorithm's time or space complexity.

**Common complexities (fastest to slowest):**
- O(1) - Constant
- O(log n) - Logarithmic
- O(n) - Linear
- O(n log n) - Linearithmic
- O(n²) - Quadratic
- O(2ⁿ) - Exponential`,
};

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hi! I'm your DSA assistant. Ask me about data structures, algorithms, time complexity, or any topic you see in the visualizer!",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const checkFAQ = (query: string): string | null => {
    const lowerQuery = query.toLowerCase();
    for (const [key, value] of Object.entries(algorithmFAQs)) {
      if (lowerQuery.includes(key)) {
        return value;
      }
    }
    return null;
  };

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (text.trim() === "" || isLoading) return;

    const newMessages: Message[] = [...messages, { text, sender: "user" }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Check FAQ first for instant responses
      const faqResponse = checkFAQ(text);
      if (faqResponse) {
        setMessages([...newMessages, { text: faqResponse, sender: "bot" }]);
      } else {
        const botResponse = await sendMessageToAI(text);
        setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
      }
    } catch (error) {
      setMessages([
        ...newMessages,
        { text: "Sorry, something went wrong. Please try again.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef}>
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3 animate-fade-in",
                message.sender === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div
                className={cn(
                  "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent/10 text-accent"
                )}
              >
                {message.sender === "user" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4" />
                )}
              </div>
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl max-w-[80%] text-sm leading-relaxed whitespace-pre-wrap",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-md"
                    : "bg-muted rounded-tl-md"
                )}
              >
                {message.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-muted">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Quick Questions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-3 border-t bg-secondary/30">
          <div className="flex items-center gap-2 py-3 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Quick questions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-8"
                onClick={() => handleSendMessage(question)}
                disabled={isLoading}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t bg-card">
        <div className="flex gap-2 max-w-2xl mx-auto">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Ask about algorithms, data structures..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim()}
            size="icon"
            data-testid="send-button"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2 flex items-center justify-center gap-1.5">
          <HelpCircle className="h-3 w-3" />
          Powered by Gemini AI
        </p>
      </div>
    </div>
  );
};
