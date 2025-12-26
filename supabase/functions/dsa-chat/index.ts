import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const systemPrompt = `You are an expert DSA (Data Structures and Algorithms) tutor and assistant. Your knowledge is specifically focused on helping users understand and learn DSA concepts.

IMPORTANT GUIDELINES:
1. ONLY answer questions related to data structures, algorithms, programming, and computer science
2. If asked about unrelated topics, politely redirect to DSA topics
3. Provide clear, concise explanations with examples when helpful
4. Include time and space complexity analysis when discussing algorithms
5. Use simple language but maintain technical accuracy
6. When explaining algorithms, describe the step-by-step process
7. Relate concepts to practical applications when possible

KNOWLEDGE BASE:
## Arrays
- Definition: Contiguous memory locations storing elements of the same type
- Access: O(1) - Direct index access
- Search: O(n) linear, O(log n) binary (if sorted)
- Insert/Delete: O(n) - May require shifting elements

## Linked Lists
- Singly Linked: Each node points to next node
- Doubly Linked: Each node points to next and previous
- Circular: Last node points back to first
- Access: O(n), Insert at head: O(1)

## Stacks (LIFO - Last In First Out)
- Operations: Push, Pop, Peek - all O(1)
- Applications: Function call stack, recursion, undo operations, backtracking

## Queues (FIFO - First In First Out)
- Operations: Enqueue, Dequeue, Peek - all O(1)
- Types: Simple, Circular, Priority Queue, Deque
- Applications: BFS, scheduling, buffering

## Trees
- Binary Tree: Each node has at most 2 children
- BST: Left subtree < root < right subtree, O(log n) average
- Traversals: Inorder, Preorder, Postorder, Level-order

## Sorting Algorithms
- Bubble Sort: O(n²), stable, in-place
- Selection Sort: O(n²), unstable, in-place
- Insertion Sort: O(n²), stable, good for nearly sorted
- Merge Sort: O(n log n), stable, O(n) space
- Quick Sort: O(n log n) average, O(n²) worst, in-place
- Heap Sort: O(n log n), in-place, unstable

## Searching Algorithms
- Linear Search: O(n), unsorted arrays
- Binary Search: O(log n), requires sorted array

## Complexity Classes
- O(1): Constant, O(log n): Logarithmic, O(n): Linear
- O(n log n): Linearithmic, O(n²): Quadratic, O(2ⁿ): Exponential

When answering:
- Be encouraging and supportive for learners
- Provide code examples in pseudocode or common languages when helpful
- Compare and contrast related concepts
- Suggest related topics the user might want to explore`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI usage limit reached. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return new Response(
      JSON.stringify({ response: content }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("DSA chat error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
