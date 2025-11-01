import { useState } from "react";
import Fuse from "fuse.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface Message {
  text: string;
  sender: "user" | "bot";
}

const faqs = [
  {
    question: "What is bubble sort?",
    answer: "Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
  },
  {
    question: "How does selection sort work?",
    answer: "Selection sort is a sorting algorithm that selects the smallest element from an unsorted list in each iteration and places that element at the beginning of the unsorted list.",
  },
  {
    question: "What is the time complexity of quick sort?",
    answer: "The time complexity of Quick Sort is O(n log n) on average and O(n^2) in the worst case.",
  },
  {
    question: "help",
    answer: "I can help you with a variety of topics, including sorting algorithms and basic code debugging. Just ask me a question, or type 'fix my code' to start the code analysis process.",
  },
];

const fuse = new Fuse(faqs, {
  keys: ["question"],
  includeScore: true,
});

type ChatState = "idle" | "awaiting_code";

export const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatState, setChatState] = useState<ChatState>("idle");

  const analyzeCode = (code: string): string => {
    // Simple checks for common errors
    if (!code.includes(";") && (code.includes("const") || code.includes("let"))) {
      return "It looks like you might be missing a semicolon at the end of a line.";
    }
    if (code.split("(").length !== code.split(")").length) {
      return "You seem to have mismatched parentheses.";
    }
    // Add more checks here
    return "I've analyzed your code and I don't see any obvious errors. If you're still having trouble, I recommend checking the browser's console for more detailed error messages.";
  };

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    const newMessages: Message[] = [...messages, { text: input, sender: "user" }];
    setMessages(newMessages);
    setInput("");

    if (chatState === "awaiting_code") {
      const analysis = analyzeCode(input);
      setTimeout(() => {
        setMessages([...newMessages, { text: analysis, sender: "bot" }]);
      }, 500);
      setChatState("idle");
      return;
    }

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

    const results = fuse.search(input);
    const botResponse = results.length > 0 && results[0].score! < 0.5
      ? results[0].item.answer
      : "I'm sorry, I don't understand. Can you please rephrase your question? Type 'help' to see what I can do.";

    setTimeout(() => {
      setMessages([...newMessages, { text: botResponse, sender: "bot" }]);
    }, 500);
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={chatState === "awaiting_code" ? "Paste your code here..." : "Type your message..."}
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
