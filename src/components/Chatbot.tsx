<<<<<<< HEAD
import { useMemo, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Fuse from "fuse.js";
=======
import { useState, useRef, useEffect } from "react";
>>>>>>> 323059c1742045ed3fc0ba63994d0010dcd4a107
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
<<<<<<< HEAD
  const [chatState, setChatState] = useState<ChatState>("idle");
  const [isLoading, setIsLoading] = useState(false);

  const apiKey =
    (import.meta as any).env?.VITE_GOOGLE_API_KEY ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY ||
    "";

  const genAI = useMemo(() => {
    try {
      return apiKey ? new GoogleGenerativeAI(apiKey) : null;
    } catch {
      return null;
    }
  }, [apiKey]);
=======
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
>>>>>>> 323059c1742045ed3fc0ba63994d0010dcd4a107

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

<<<<<<< HEAD
  const askGemini = async (prompt: string): Promise<string> => {
    if (!genAI) return "AI is not configured. Please set VITE_GOOGLE_API_KEY.";

    try {
      const candidateModels = [
        "gemini-1.5-pro",
        "gemini-1.5-flash"
      ];

      let lastError: any = null;

      for (const modelName of candidateModels) {
        try {
          // use stable "v1" API automatically via updated SDK
          const model = genAI.getGenerativeModel({ model: modelName });

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          if (text) return text;
        } catch (e) {
          lastError = e;
          continue;
        }
      }

      throw lastError || new Error("All candidate models failed");
    } catch (err: any) {
      // handle both structured Gemini errors and generic fetch failures
      return `AI request failed: ${err?.message || "Unknown error"}`;
    }
  };


  const handleSendMessage = async () => {
    if (input.trim() === "") return;
=======
  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input;
    if (text.trim() === "" || isLoading) return;
>>>>>>> 323059c1742045ed3fc0ba63994d0010dcd4a107

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
<<<<<<< HEAD

    if (input.toLowerCase().includes("fix my code")) {
      setTimeout(() => {
        setMessages([
          ...newMessages,
          { text: "Sure, please paste your code and I'll take a look.", sender: "bot" },
        ]);
      }, 500);
      setChatState("awaiting_code");
      return;
    }

    // If Gemini API key is present, use it; otherwise fallback to local FAQ
    if (genAI) {
      setIsLoading(true);
      const reply = await askGemini(input);
      setIsLoading(false);
      setMessages([...newMessages, { text: reply, sender: "bot" }]);
      return;
    }

    const results = fuse.search(input);
    const botResponse =
      results.length > 0 && results[0].score! < 0.5
        ? results[0].item.answer
        : "I'm sorry, I don't understand. Can you please rephrase your question? Type 'help' to see what I can do.";

    setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
=======
>>>>>>> 323059c1742045ed3fc0ba63994d0010dcd4a107
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-4" ref={scrollRef}>
        <div className="space-y-4 max-w-2xl mx-auto">
          {messages.map((message, index) => (
            <div
              key={index}
<<<<<<< HEAD
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${message.sender === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
                  }`}
=======
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
>>>>>>> 323059c1742045ed3fc0ba63994d0010dcd4a107
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
<<<<<<< HEAD
            onKeyDown={(e) => e.key === "Enter" && !isLoading && handleSendMessage()}
            placeholder={chatState === "awaiting_code" ? "Paste your code here..." : "Type your message..."}
          />
          <Button onClick={handleSendMessage} disabled={isLoading}>
=======
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
>>>>>>> 323059c1742045ed3fc0ba63994d0010dcd4a107
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
