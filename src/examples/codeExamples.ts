export const CODE_EXAMPLES = {
  'sum-loop': {
    javascript: `// Simple sum loop – perfect for step-through
let n = 5;
let total = 0;

for (let i = 1; i <= n; i++) {
  total = total + i;
}

console.log("Sum:", total);`,
    python: `n = 5
total = 0
for i in range(1, n + 1):
    total = total + i
print("Sum:", total)`,
    java: `// Java not supported for browser execution`,
    c: `// C not supported for browser execution`,
  },
  'bubble-sort': {
    python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

arr = [64, 34, 25, 12, 22, 11, 90]
result = bubble_sort(arr)
print("Sorted:", result)`,
    javascript: `function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log("Sorted:", bubbleSort(arr));`,
    java: `public class BubbleSort {
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
}`,
    c: `#include <stdio.h>
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                int temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }
}`
  },
  'binary-search': {
    python: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1
arr = [1, 3, 5, 7, 9, 11, 13]
print("Found at:", binary_search(arr, 7))`,
    javascript: `function binarySearch(arr, target) {
    let left = 0, right = arr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}
console.log("Found at:", binarySearch([1, 3, 5, 7, 9, 11, 13], 7));`,
    java: `public class BinarySearch {
    public static int search(int[] arr, int target) {
        int left = 0, right = arr.length - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) left = mid + 1;
            else right = mid - 1;
        }
        return -1;
    }
}`,
    c: `#include <stdio.h>
int binarySearch(int arr[], int n, int target) {
    int left = 0, right = n - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
  },
  'fibonacci': {
    python: `def fib(n):
    if n <= 1:
        return n
    return fib(n-1) + fib(n-2)
print(fib(6))`,
    javascript: `function fib(n) {
    return n <= 1 ? n : fib(n-1) + fib(n-2);
}
console.log(fib(6));`,
    java: `public class Fib {
    public static int fib(int n) {
        return n <= 1 ? n : fib(n-1) + fib(n-2);
    }
}`,
    c: `#include <stdio.h>
int fib(int n) {
    return n <= 1 ? n : fib(n-1) + fib(n-2);
}`
  },
  'factorial': {
    python: `def factorial(n):
    return 1 if n <= 1 else n * factorial(n-1)
print(factorial(5))`,
    javascript: `function factorial(n) {
    return n <= 1 ? 1 : n * factorial(n-1);
}
console.log(factorial(5));`,
    java: `public class Fact {
    public static int factorial(int n) {
        return n <= 1 ? 1 : n * factorial(n-1);
    }
}`,
    c: `#include <stdio.h>
int factorial(int n) {
    return n <= 1 ? 1 : n * factorial(n-1);
}`
  }
}
