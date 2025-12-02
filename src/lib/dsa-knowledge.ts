// DSA Knowledge Base for RAG
export const dsaKnowledgeBase = `
# Data Structures and Algorithms Knowledge Base

## Arrays
- **Definition**: Contiguous memory locations storing elements of the same type
- **Access**: O(1) - Direct index access
- **Search**: O(n) linear, O(log n) binary (if sorted)
- **Insert/Delete**: O(n) - May require shifting elements
- **Use cases**: Random access, cache-friendly iteration, dynamic programming

## Linked Lists
- **Singly Linked**: Each node points to next node
- **Doubly Linked**: Each node points to next and previous
- **Circular**: Last node points back to first
- **Operations**:
  - Access: O(n)
  - Insert at head: O(1)
  - Insert at tail: O(1) with tail pointer, O(n) without
  - Delete: O(1) if node reference known, O(n) to find
- **Use cases**: Dynamic size, frequent insertions/deletions

## Stacks (LIFO - Last In First Out)
- **Operations**: Push, Pop, Peek - all O(1)
- **Implementation**: Array or Linked List
- **Applications**: 
  - Function call stack, recursion
  - Expression evaluation (postfix, prefix)
  - Undo operations
  - Backtracking algorithms
  - Bracket matching

## Queues (FIFO - First In First Out)
- **Operations**: Enqueue, Dequeue, Peek - all O(1)
- **Types**:
  - Simple Queue
  - Circular Queue
  - Priority Queue (O(log n) operations with heap)
  - Deque (double-ended)
- **Applications**: BFS, scheduling, buffering

## Trees
- **Binary Tree**: Each node has at most 2 children
- **Binary Search Tree (BST)**:
  - Left subtree < root < right subtree
  - Search/Insert/Delete: O(log n) average, O(n) worst
- **Balanced Trees**: AVL, Red-Black - guarantee O(log n)
- **Traversals**:
  - Inorder (Left, Root, Right): Sorted order for BST
  - Preorder (Root, Left, Right): Copy tree, prefix expression
  - Postorder (Left, Right, Root): Delete tree, postfix expression
  - Level-order (BFS): Level by level

## Heaps
- **Min Heap**: Parent ≤ children
- **Max Heap**: Parent ≥ children
- **Operations**:
  - Insert: O(log n)
  - Extract min/max: O(log n)
  - Peek: O(1)
  - Build heap: O(n)
- **Applications**: Priority queues, heap sort, finding k largest/smallest

## Hash Tables
- **Average case**: O(1) for insert, delete, search
- **Worst case**: O(n) with collisions
- **Collision handling**: Chaining, Open addressing (linear/quadratic probing)
- **Load factor**: n/m (elements/buckets)
- **Applications**: Caching, indexing, counting frequencies

## Graphs
- **Representations**:
  - Adjacency Matrix: O(V²) space, O(1) edge lookup
  - Adjacency List: O(V+E) space, O(degree) edge lookup
- **Types**: Directed, Undirected, Weighted, DAG
- **Traversals**:
  - BFS: Level-order, shortest path (unweighted)
  - DFS: Backtracking, cycle detection, topological sort

## Sorting Algorithms

### Comparison-based:
- **Bubble Sort**: O(n²), stable, in-place
- **Selection Sort**: O(n²), unstable, in-place
- **Insertion Sort**: O(n²), stable, in-place, good for nearly sorted
- **Merge Sort**: O(n log n), stable, O(n) space
- **Quick Sort**: O(n log n) average, O(n²) worst, in-place
- **Heap Sort**: O(n log n), in-place, unstable

### Non-comparison:
- **Counting Sort**: O(n+k), stable
- **Radix Sort**: O(d(n+k))
- **Bucket Sort**: O(n+k) average

## Searching Algorithms
- **Linear Search**: O(n), unsorted arrays
- **Binary Search**: O(log n), requires sorted array
- **Jump Search**: O(√n)
- **Interpolation Search**: O(log log n) for uniform distribution

## Algorithm Paradigms

### Divide and Conquer
- Break into subproblems, solve recursively, combine
- Examples: Merge sort, Quick sort, Binary search

### Dynamic Programming
- Overlapping subproblems + optimal substructure
- Memoization (top-down) or Tabulation (bottom-up)
- Examples: Fibonacci, Knapsack, LCS, Edit distance

### Greedy
- Make locally optimal choices
- Examples: Activity selection, Huffman coding, Dijkstra's

### Backtracking
- Build solution incrementally, abandon invalid paths
- Examples: N-Queens, Sudoku, Permutations

## Complexity Classes
- **O(1)**: Constant - array access, hash lookup
- **O(log n)**: Logarithmic - binary search
- **O(n)**: Linear - linear search, single loop
- **O(n log n)**: Linearithmic - efficient sorting
- **O(n²)**: Quadratic - nested loops, simple sorting
- **O(2ⁿ)**: Exponential - recursive fibonacci, subsets
- **O(n!)**: Factorial - permutations

## Space Complexity
- **In-place algorithms**: O(1) extra space
- **Recursive algorithms**: O(depth) stack space
- **Trade-offs**: Time vs space (memoization uses space to save time)
`;

export const systemPrompt = `You are an expert DSA (Data Structures and Algorithms) tutor and assistant. Your knowledge is specifically focused on helping users understand and learn DSA concepts.

IMPORTANT GUIDELINES:
1. ONLY answer questions related to data structures, algorithms, programming, and computer science
2. If asked about unrelated topics, politely redirect to DSA topics
3. Provide clear, concise explanations with examples when helpful
4. Include time and space complexity analysis when discussing algorithms
5. Use simple language but maintain technical accuracy
6. When explaining algorithms, describe the step-by-step process
7. Relate concepts to practical applications when possible

Use this knowledge base for accurate information:
${dsaKnowledgeBase}

When answering:
- Be encouraging and supportive for learners
- Provide code examples in pseudocode or common languages when helpful
- Compare and contrast related concepts
- Suggest related topics the user might want to explore`;
