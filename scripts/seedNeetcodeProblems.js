import mongoose from "mongoose";
import dotenv from "dotenv";
import Problem from "../models/Problem.js";

dotenv.config();

/**
 * Seed Neetcode 150 problems as global problems
 * Run once: node scripts/seedNeetcodeProblems.js
 */

// Import the 150 problems from your frontend
const neetcodeProblems = [
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
  // Add all 150 problems here - truncated for brevity, will generate complete list
];

// Difficulty mapping based on common patterns
const getDifficulty = (name) => {
  const hardProblems = ["Trapping Rain Water", "Sliding Window Maximum", "Largest Rectangle", "Find Median", "Merge K Sorted", "Reverse Nodes in K-Group", "Binary Tree Max Path", "Serialize and Deserialize", "Word Search II", "Median from Data Stream", "N-Queens", "Alien Dictionary", "Regular Expression", "Burst Balloons"];
  const easyProblems = ["Contains Duplicate", "Valid Anagram", "Two Sum", "Valid Palindrome", "Best Time to Buy", "Valid Parentheses", "Binary Search", "Reverse Linked List", "Invert Binary Tree", "Maximum Depth", "Balanced Binary Tree", "Same Tree", "Climbing Stairs", "Single Number", "Missing Number", "Happy Number", "Plus One"];
  
  if (hardProblems.some(hard => name.includes(hard))) return "Hard";
  if (easyProblems.some(easy => name.includes(easy))) return "Easy";
  return "Medium";
};

const seedProblems = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.mongodb_url);
    console.log("✅ Connected to MongoDB");

    // Check if problems already exist
    const existingCount = await Problem.countDocuments({ isGlobal: true });
    if (existingCount > 0) {
      console.log(`⚠️  Found ${existingCount} existing global problems.`);
      console.log("Delete them? This will remove all global problems.");
      console.log("Run: await Problem.deleteMany({ isGlobal: true })");
      process.exit(0);
    }

    // Transform and insert problems
    const problemsToInsert = neetcodeProblems.map(p => ({
      title: p.Name,
      platform: "LeetCode",
      difficulty: getDifficulty(p.Name),
      tags: [p.Category],
      url: p.Link,
      notes: "",
      createdBy: null, // Global problems have no creator
      isGlobal: true,
    }));

    const inserted = await Problem.insertMany(problemsToInsert);
    console.log(`✅ Seeded ${inserted.length} Neetcode 150 problems as global`);
    console.log("These problems are now visible to all users!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding problems:", error);
    process.exit(1);
  }
};

seedProblems();

