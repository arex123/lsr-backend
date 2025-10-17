import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "../models/Problem.js";

dotenv.config();

/**
 * Seed all 150 Neetcode problems as global problems
 * Run once: node scripts/seedNeetcode150.js
 * These problems will be available to ALL users
 */

// Complete Neetcode 150 list
const neetcode150 = [
  { id: 1, Category: "Arrays", Name: "Contains Duplicate", Link: "https://leetcode.com/problems/contains-duplicate/" },
  { id: 2, Category: "Arrays", Name: "Valid Anagram", Link: "https://leetcode.com/problems/valid-anagram/" },
  { id: 3, Category: "Arrays", Name: "Two Sum", Link: "https://leetcode.com/problems/two-sum/" },
  { id: 4, Category: "Arrays", Name: "Group Anagrams", Link: "https://leetcode.com/problems/group-anagrams/" },
  { id: 5, Category: "Arrays", Name: "Top K Frequent Elements", Link: "https://leetcode.com/problems/top-k-frequent-elements/" },
  { id: 6, Category: "Arrays", Name: "Product of Array Except Self", Link: "https://leetcode.com/problems/product-of-array-except-self/" },
  { id: 7, Category: "Arrays", Name: "Valid Sudoku", Link: "https://leetcode.com/problems/valid-sudoku/" },
  { id: 8, Category: "Arrays", Name: "Encode and Decode Strings", Link: "https://leetcode.com/accounts/login/?next=/problems/encode-and-decode-strings/" },
  { id: 9, Category: "Graph", Name: "Longest Consecutive Sequence", Link: "https://leetcode.com/problems/longest-consecutive-sequence/" },
  { id: 10, Category: "Two Pointers", Name: "Valid Palindrome", Link: "https://leetcode.com/problems/valid-palindrome/" },
  { id: 11, Category: "Two Pointers", Name: "Two Sum II", Link: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
  { id: 12, Category: "Two Pointers", Name: "3Sum", Link: "https://leetcode.com/problems/3sum/" },
  { id: 13, Category: "Two Pointers", Name: "Container with Most Water", Link: "https://leetcode.com/problems/container-with-most-water/" },
  { id: 14, Category: "Two Pointers", Name: "Trapping Rain Water", Link: "https://leetcode.com/problems/trapping-rain-water/" },
  { id: 15, Category: "Sliding Window", Name: "Best Time to Buy & Sell Stock", Link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
  { id: 16, Category: "Sliding Window", Name: "Longest Substring Without Repeating Characters", Link: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
  { id: 17, Category: "Sliding Window", Name: "Longest Repeating Character Replacement", Link: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
  { id: 18, Category: "Sliding Window", Name: "Permutation in String", Link: "https://leetcode.com/problems/permutation-in-string/" },
  { id: 19, Category: "Sliding Window", Name: "Minimum Window Substring", Link: "https://leetcode.com/problems/minimum-window-substring/" },
  { id: 20, Category: "Sliding Window", Name: "Sliding Window Maximum", Link: "https://leetcode.com/problems/sliding-window-maximum/" },
  { id: 21, Category: "Stack", Name: "Valid Parentheses", Link: "https://leetcode.com/problems/valid-parentheses/" },
  { id: 22, Category: "Stack", Name: "Min Stack", Link: "https://leetcode.com/problems/min-stack/" },
  { id: 23, Category: "Stack", Name: "Evaluate Reverse Polish Notation", Link: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
  { id: 24, Category: "Stack", Name: "Generate Parentheses", Link: "https://leetcode.com/problems/generate-parentheses/" },
  { id: 25, Category: "Stack", Name: "Daily Temperatures", Link: "https://leetcode.com/problems/daily-temperatures/" },
  { id: 26, Category: "Stack", Name: "Car Fleet", Link: "https://leetcode.com/problems/car-fleet/" },
  { id: 27, Category: "Stack", Name: "Largest Rectangle in Histogram", Link: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
  { id: 28, Category: "Binary Search", Name: "Binary Search", Link: "https://leetcode.com/problems/binary-search/" },
  { id: 29, Category: "Binary Search", Name: "Search a 2D Matrix", Link: "https://leetcode.com/problems/search-a-2d-matrix/" },
  { id: 30, Category: "Binary Search", Name: "Koko Eating Bananas", Link: "https://leetcode.com/problems/koko-eating-bananas/" },
  { id: 31, Category: "Binary Search", Name: "Search Rotated Sorted Array", Link: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
  { id: 32, Category: "Binary Search", Name: "Find Minimum in Rotated Sorted Array", Link: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
  { id: 33, Category: "Binary Search", Name: "Time Based Key-Value Store", Link: "https://leetcode.com/problems/time-based-key-value-store/" },
  { id: 34, Category: "Binary Search", Name: "Find Median of Two Sorted Arrays", Link: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
  { id: 35, Category: "Linked List", Name: "Reverse Linked List", Link: "https://leetcode.com/problems/reverse-linked-list/" },
  { id: 36, Category: "Linked List", Name: "Merge Two Linked Lists", Link: "https://leetcode.com/problems/merge-two-sorted-lists/" },
  { id: 37, Category: "Linked List", Name: "Reorder List", Link: "https://leetcode.com/problems/reorder-list/" },
  { id: 38, Category: "Linked List", Name: "Remove Nth Node from End of List", Link: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
  { id: 39, Category: "Linked List", Name: "Copy List with Random Pointer", Link: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
  { id: 40, Category: "Linked List", Name: "Add Two Numbers", Link: "https://leetcode.com/problems/add-two-numbers/" },
  { id: 41, Category: "Linked List", Name: "Linked List Cycle", Link: "https://leetcode.com/problems/linked-list-cycle/" },
  { id: 42, Category: "Linked List", Name: "Find the Duplicate Number", Link: "https://leetcode.com/problems/find-the-duplicate-number/" },
  { id: 43, Category: "Linked List", Name: "LRU Cache", Link: "https://leetcode.com/problems/lru-cache/" },
  { id: 44, Category: "Linked List", Name: "Merge K Sorted Lists", Link: "https://leetcode.com/problems/merge-k-sorted-lists/" },
  { id: 45, Category: "Linked List", Name: "Reverse Nodes in K-Group", Link: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
  { id: 46, Category: "Trees", Name: "Invert Binary Tree", Link: "https://leetcode.com/problems/invert-binary-tree/" },
  { id: 47, Category: "Trees", Name: "Maximum Depth of Binary Tree", Link: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
  { id: 48, Category: "Trees", Name: "Diameter of a Binary Tree", Link: "https://leetcode.com/problems/diameter-of-binary-tree/" },
  { id: 49, Category: "Trees", Name: "Balanced Binary Tree", Link: "https://leetcode.com/problems/balanced-binary-tree/" },
  { id: 50, Category: "Trees", Name: "Same Tree", Link: "https://leetcode.com/problems/same-tree/" },
  { id: 51, Category: "Trees", Name: "Subtree of Another Tree", Link: "https://leetcode.com/problems/subtree-of-another-tree/" },
  { id: 52, Category: "Trees", Name: "Lowest Common Ancestor of a BST", Link: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
  { id: 53, Category: "Trees", Name: "Binary Tree Level Order Traversal", Link: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
  { id: 54, Category: "Trees", Name: "Binary Tree Right Side View", Link: "https://leetcode.com/problems/binary-tree-right-side-view/" },
  { id: 55, Category: "Trees", Name: "Count Good Nodes in a Binary Tree", Link: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/" },
  { id: 56, Category: "Trees", Name: "Validate Binary Search Tree", Link: "https://leetcode.com/problems/validate-binary-search-tree/" },
  { id: 57, Category: "Trees", Name: "Kth Smallest Element in a BST", Link: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/" },
  { id: 58, Category: "Trees", Name: "Construct Tree from Preorder and Inorder Traversal", Link: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
  { id: 59, Category: "Trees", Name: "Binary Tree Max Path Sum", Link: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
  { id: 60, Category: "Trees", Name: "Serialize and Deserialize Binary Tree", Link: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
  { id: 61, Category: "Tries", Name: "Implement Trie", Link: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
  { id: 62, Category: "Tries", Name: "Design Add and Search Word Data Structure", Link: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
  { id: 63, Category: "Tries", Name: "Word Search II", Link: "https://leetcode.com/problems/word-search-ii/" },
  { id: 64, Category: "Heap / Priority Queue", Name: "Kth Largest Element in a Stream", Link: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
  { id: 65, Category: "Heap / Priority Queue", Name: "Last Stone Weight", Link: "https://leetcode.com/problems/last-stone-weight/" },
  { id: 66, Category: "Heap / Priority Queue", Name: "K Closest Points to Origin", Link: "https://leetcode.com/problems/k-closest-points-to-origin/" },
  { id: 67, Category: "Heap / Priority Queue", Name: "Kth Largest Element in an Array", Link: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
  { id: 68, Category: "Heap / Priority Queue", Name: "Task Scheduler", Link: "https://leetcode.com/problems/task-scheduler/" },
  { id: 69, Category: "Heap / Priority Queue", Name: "Design Twitter", Link: "https://leetcode.com/problems/design-twitter/" },
  { id: 70, Category: "Heap / Priority Queue", Name: "Find Median from Data Stream", Link: "https://leetcode.com/problems/find-median-from-data-stream/" },
  { id: 71, Category: "Backtracking", Name: "Subsets", Link: "https://leetcode.com/problems/subsets/" },
  { id: 72, Category: "Backtracking", Name: "Combination Sum", Link: "https://leetcode.com/problems/combination-sum/" },
  { id: 73, Category: "Backtracking", Name: "Permutations", Link: "https://leetcode.com/problems/permutations/" },
  { id: 74, Category: "Backtracking", Name: "Subsets II", Link: "https://leetcode.com/problems/subsets-ii/" },
  { id: 75, Category: "Backtracking", Name: "Combination Sum II", Link: "https://leetcode.com/problems/combination-sum-ii/" },
  { id: 76, Category: "Backtracking", Name: "Word Search", Link: "https://leetcode.com/problems/word-search/" },
  { id: 77, Category: "Backtracking", Name: "Palindrome Partitioning", Link: "https://leetcode.com/problems/palindrome-partitioning/" },
  { id: 78, Category: "Backtracking", Name: "Letter Combinations of a Phone Number", Link: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
  { id: 79, Category: "Backtracking", Name: "N-Queens", Link: "https://leetcode.com/problems/n-queens/" },
  { id: 80, Category: "Graphs", Name: "Number of Islands", Link: "https://leetcode.com/problems/number-of-islands/" },
  { id: 81, Category: "Graphs", Name: "Clone Graph", Link: "https://leetcode.com/problems/clone-graph/" },
  { id: 82, Category: "Graphs", Name: "Max Area of Island", Link: "https://leetcode.com/problems/max-area-of-island/" },
  { id: 83, Category: "Graphs", Name: "Pacific Atlantic Waterflow", Link: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
  { id: 84, Category: "Graphs", Name: "Surrounded Regions", Link: "https://leetcode.com/problems/surrounded-regions/" },
  { id: 85, Category: "Graphs", Name: "Rotting Oranges", Link: "https://leetcode.com/problems/rotting-oranges/" },
  { id: 86, Category: "Graphs", Name: "Walls and Gates", Link: "https://leetcode.com/problems/walls-and-gates/" },
  { id: 87, Category: "Graphs", Name: "Course Schedule", Link: "https://leetcode.com/problems/course-schedule/" },
  { id: 88, Category: "Graphs", Name: "Course Schedule II", Link: "https://leetcode.com/problems/course-schedule-ii/" },
  { id: 89, Category: "Graphs", Name: "Redundant Connection", Link: "https://leetcode.com/problems/redundant-connection/" },
  { id: 90, Category: "Graphs", Name: "Number of Connected Components in Graph", Link: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/" },
  { id: 91, Category: "Graphs", Name: "Graph Valid Tree", Link: "https://leetcode.com/problems/graph-valid-tree/" },
  { id: 92, Category: "Graphs", Name: "Word Ladder", Link: "https://leetcode.com/problems/word-ladder/" },
  { id: 93, Category: "Advanced Graphs", Name: "Reconstruct Itinerary", Link: "https://leetcode.com/problems/reconstruct-itinerary/" },
  { id: 94, Category: "Advanced Graphs", Name: "Min Cost to Connect all Points", Link: "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
  { id: 95, Category: "Advanced Graphs", Name: "Network Delay Time", Link: "https://leetcode.com/problems/network-delay-time/" },
  { id: 96, Category: "Advanced Graphs", Name: "Swim in Rising Water", Link: "https://leetcode.com/problems/swim-in-rising-water/" },
  { id: 97, Category: "Advanced Graphs", Name: "Alien Dictionary", Link: "https://leetcode.com/problems/alien-dictionary/" },
  { id: 98, Category: "Advanced Graphs", Name: "Cheapest Flights with K Stops", Link: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },
  { id: 99, Category: "1-D Dynamic Programming", Name: "Climbing Stairs", Link: "https://leetcode.com/problems/climbing-stairs/" },
  { id: 100, Category: "1-D Dynamic Programming", Name: "Min Cost Climbing Stairs", Link: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
  { id: 101, Category: "1-D Dynamic Programming", Name: "House Robber", Link: "https://leetcode.com/problems/house-robber/" },
  { id: 102, Category: "1-D Dynamic Programming", Name: "House Robber II", Link: "https://leetcode.com/problems/house-robber-ii/" },
  { id: 103, Category: "1-D Dynamic Programming", Name: "Longest Palindroming Substring", Link: "https://leetcode.com/problems/longest-palindromic-substring/" },
  { id: 104, Category: "1-D Dynamic Programming", Name: "Palindrome Substrings", Link: "https://leetcode.com/problems/palindromic-substrings/" },
  { id: 105, Category: "1-D Dynamic Programming", Name: "Decode Ways", Link: "https://leetcode.com/problems/decode-ways/" },
  { id: 106, Category: "1-D Dynamic Programming", Name: "Coin Change", Link: "https://leetcode.com/problems/coin-change/" },
  { id: 107, Category: "1-D Dynamic Programming", Name: "Maximum Product Subarray", Link: "https://leetcode.com/problems/maximum-product-subarray/" },
  { id: 108, Category: "1-D Dynamic Programming", Name: "Word Break", Link: "https://leetcode.com/problems/word-break/" },
  { id: 109, Category: "1-D Dynamic Programming", Name: "Longest Increasing Subsequence", Link: "https://leetcode.com/problems/longest-increasing-subsequence/" },
  { id: 110, Category: "1-D Dynamic Programming", Name: "Partition Equal Subset Sum", Link: "https://leetcode.com/problems/partition-equal-subset-sum/" },
  { id: 111, Category: "2-D Dynamic Programming", Name: "Unique Paths", Link: "https://leetcode.com/problems/unique-paths/" },
  { id: 112, Category: "2-D Dynamic Programming", Name: "Longest Common Subsequence", Link: "https://leetcode.com/problems/longest-common-subsequence/" },
  { id: 113, Category: "2-D Dynamic Programming", Name: "Best Time to Buy/Sell Stock With Cooldown", Link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/" },
  { id: 114, Category: "2-D Dynamic Programming", Name: "Coin Change II", Link: "https://leetcode.com/problems/coin-change-2/" },
  { id: 115, Category: "2-D Dynamic Programming", Name: "Target Sum", Link: "https://leetcode.com/problems/target-sum/" },
  { id: 116, Category: "2-D Dynamic Programming", Name: "Interleaving String", Link: "https://leetcode.com/problems/interleaving-string/" },
  { id: 117, Category: "2-D Dynamic Programming", Name: "Longest Increasing Path in a Matrix", Link: "https://leetcode.com/problems/longest-increasing-path-in-a-matrix/" },
  { id: 118, Category: "2-D Dynamic Programming", Name: "Distinct Subsequences", Link: "https://leetcode.com/problems/distinct-subsequences/" },
  { id: 119, Category: "2-D Dynamic Programming", Name: "Edit Distance", Link: "https://leetcode.com/problems/edit-distance/" },
  { id: 120, Category: "2-D Dynamic Programming", Name: "Burst Balloons", Link: "https://leetcode.com/problems/burst-balloons/" },
  { id: 121, Category: "2-D Dynamic Programming", Name: "Regular Expression Matching", Link: "https://leetcode.com/problems/regular-expression-matching/" },
  { id: 122, Category: "Greedy", Name: "Maximum Subarray", Link: "https://leetcode.com/problems/maximum-subarray/" },
  { id: 123, Category: "Greedy", Name: "Jump Game", Link: "https://leetcode.com/problems/jump-game/" },
  { id: 124, Category: "Greedy", Name: "Jump Game II", Link: "https://leetcode.com/problems/jump-game-ii/" },
  { id: 125, Category: "Greedy", Name: "Gas Station", Link: "https://leetcode.com/problems/gas-station/" },
  { id: 126, Category: "Greedy", Name: "Hand of Straights", Link: "https://leetcode.com/problems/hand-of-straights/" },
  { id: 127, Category: "Greedy", Name: "Merge Triplets to Form Target Triplet", Link: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/" },
  { id: 128, Category: "Greedy", Name: "Partition Labels", Link: "https://leetcode.com/problems/partition-labels/" },
  { id: 129, Category: "Greedy", Name: "Valid Parenthesis String", Link: "https://leetcode.com/problems/valid-parenthesis-string/" },
  { id: 130, Category: "Intervals", Name: "Insert Interval", Link: "https://leetcode.com/problems/insert-interval/" },
  { id: 131, Category: "Intervals", Name: "Merge Intervals", Link: "https://leetcode.com/problems/merge-intervals/" },
  { id: 132, Category: "Intervals", Name: "Non-Overlapping Intervals", Link: "https://leetcode.com/problems/non-overlapping-intervals/" },
  { id: 133, Category: "Intervals", Name: "Meeting Rooms", Link: "https://leetcode.com/problems/meeting-rooms/" },
  { id: 134, Category: "Intervals", Name: "Meeting Rooms II", Link: "https://leetcode.com/problems/meeting-rooms-ii/" },
  { id: 135, Category: "Intervals", Name: "Minimum Interval to Include Each Query", Link: "https://leetcode.com/problems/minimum-interval-to-include-each-query/" },
  { id: 136, Category: "Math & Geometry", Name: "Rotate Image", Link: "https://leetcode.com/problems/rotate-image/" },
  { id: 137, Category: "Math & Geometry", Name: "Spiral Matrix", Link: "https://leetcode.com/problems/spiral-matrix/" },
  { id: 138, Category: "Math & Geometry", Name: "Set Matrix Zeroes", Link: "https://leetcode.com/problems/set-matrix-zeroes/" },
  { id: 139, Category: "Math & Geometry", Name: "Happy Number", Link: "https://leetcode.com/problems/happy-number/" },
  { id: 140, Category: "Math & Geometry", Name: "Plus One", Link: "https://leetcode.com/problems/plus-one/" },
  { id: 141, Category: "Math & Geometry", Name: "Pow(x, n)", Link: "https://leetcode.com/problems/powx-n/" },
  { id: 142, Category: "Math & Geometry", Name: "Multiply Strings", Link: "https://leetcode.com/problems/multiply-strings/" },
  { id: 143, Category: "Math & Geometry", Name: "Detect Squares", Link: "https://leetcode.com/problems/detect-squares/" },
  { id: 144, Category: "Bit Manipulation", Name: "Single Number", Link: "https://leetcode.com/problems/single-number/" },
  { id: 145, Category: "Bit Manipulation", Name: "Number of 1 Bits", Link: "https://leetcode.com/problems/number-of-1-bits/" },
  { id: 146, Category: "Bit Manipulation", Name: "Counting Bits", Link: "https://leetcode.com/problems/counting-bits/" },
  { id: 147, Category: "Bit Manipulation", Name: "Reverse Bits", Link: "https://leetcode.com/problems/reverse-bits/" },
  { id: 148, Category: "Bit Manipulation", Name: "Missing Number", Link: "https://leetcode.com/problems/missing-number/" },
  { id: 149, Category: "Bit Manipulation", Name: "Sum of Two Integers", Link: "https://leetcode.com/problems/sum-of-two-integers/" },
  { id: 150, Category: "Bit Manipulation", Name: "Reverse Integer", Link: "https://leetcode.com/problems/reverse-integer/" },
];

// Smart difficulty detection based on problem patterns
const getDifficulty = (name) => {
  const hardKeywords = ["Trapping Rain Water", "Sliding Window Maximum", "Largest Rectangle", "Median", "Merge K Sorted", "Reverse Nodes in K-Group", "Max Path Sum", "Serialize", "Word Search II", "Median from Data Stream", "N-Queens", "Alien Dictionary", "Regular Expression", "Burst Balloons", "Edit Distance", "Distinct Subsequences", "Minimum Window Substring"];
  
  const easyKeywords = ["Contains Duplicate", "Valid Anagram", "Two Sum", "Valid Palindrome", "Best Time to Buy & Sell Stock", "Valid Parentheses", "Binary Search", "Reverse Linked List", "Invert Binary Tree", "Maximum Depth", "Balanced Binary Tree", "Same Tree", "Climbing Stairs", "Single Number", "Missing Number", "Happy Number", "Plus One", "Number of 1 Bits", "Counting Bits", "Reverse Bits"];
  
  // Check if name matches hard problems
  if (hardKeywords.some(keyword => name.includes(keyword))) return "Hard";
  
  // Check if name matches easy problems
  if (easyKeywords.some(keyword => name.includes(keyword))) return "Easy";
  
  // Default to Medium
  return "Medium";
};

const seedProblems = async () => {
  try {
    console.log("🚀 Starting Neetcode 150 seeding process...\n");
    
    // Connect to MongoDB
    await mongoose.connect(process.env.mongodb_url);
    console.log("✅ Connected to MongoDB");

    // Check if global problems already exist
    const existingCount = await Problem.countDocuments({ isGlobal: true });
    
    if (existingCount > 0) {
      console.log(`\n⚠️  Found ${existingCount} existing global problems in database.`);
      console.log("To re-seed, first delete existing problems:");
      console.log("  Run: await Problem.deleteMany({ isGlobal: true })\n");
      process.exit(0);
    }

    console.log(`\n📋 Preparing to insert ${neetcode150.length} problems...`);

    // Transform problems into MongoDB documents
    const problemsToInsert = neetcode150.map(p => ({
      title: p.Name,
      platform: "LeetCode",
      difficulty: getDifficulty(p.Name),
      tags: [p.Category], // Category as primary tag
      url: p.Link,
      notes: "",
      createdBy: null, // null = global problems (no owner)
      isGlobal: true,  // Available to ALL users
    }));

    // Bulk insert all problems
    const inserted = await Problem.insertMany(problemsToInsert);
    
    console.log(`\n✅ Successfully seeded ${inserted.length} problems!\n`);
    
    // Show difficulty breakdown
    const easyCount = inserted.filter(p => p.difficulty === "Easy").length;
    const mediumCount = inserted.filter(p => p.difficulty === "Medium").length;
    const hardCount = inserted.filter(p => p.difficulty === "Hard").length;
    
    console.log("📊 Difficulty Breakdown:");
    console.log(`   🟢 Easy:   ${easyCount} problems`);
    console.log(`   🟡 Medium: ${mediumCount} problems`);
    console.log(`   🔴 Hard:   ${hardCount} problems`);
    console.log(`\n🌍 These problems are now visible to ALL users as global problems!`);
    
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding problems:", error);
    process.exit(1);
  }
};

// Run the seed script
seedProblems();

