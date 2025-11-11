// src/lib/apiQueue.ts
const queue: Array<() => Promise<void>> = [];
let isProcessing = false;
const REQUEST_DELAY = 5000; // Increased to 5 seconds between requests
const MAX_RETRIES = 3;      // Maximum number of retries for failed requests
let lastRequestTime = 0;
let consecutiveFailures = 0; // Track consecutive failures
const BACKOFF_MULTIPLIER = 2; // Exponential backoff multiplier

async function processQueue() {
  if (isProcessing || queue.length === 0) return;
  
  isProcessing = true;
  const now = Date.now();
  
  // Apply exponential backoff if we've had failures
  const baseDelay = consecutiveFailures > 0 
    ? REQUEST_DELAY * Math.pow(BACKOFF_MULTIPLIER, consecutiveFailures - 1)
    : REQUEST_DELAY;
  
  // Add some jitter to prevent thundering herd
  const jitter = Math.random() * 1000;
  const timeSinceLastRequest = now - lastRequestTime;
  const delay = Math.max(0, baseDelay + jitter - timeSinceLastRequest);
  
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const task = queue.shift();
  
  if (task) {
    try {
      await task();
      // Reset failure counter on successful request
      consecutiveFailures = 0;
    } catch (error: any) {  // Fix: Added type annotation
      console.error('Error in API queue task:', error);
      consecutiveFailures = Math.min(consecutiveFailures + 1, MAX_RETRIES);
      
      // If this was a rate limit error, wait longer before next request
      if (error?.message?.includes('429') || error?.status === 429) {  // Fix: Added optional chaining
        const backoffTime = REQUEST_DELAY * Math.pow(BACKOFF_MULTIPLIER, consecutiveFailures);
        console.warn(`Rate limited. Waiting ${backoffTime}ms before next request...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    } finally {
      lastRequestTime = Date.now();
      isProcessing = false;
      processQueue();
    }
  } else {
    isProcessing = false;
  }
}

export function addToQueue<T>(task: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const wrappedTask = async () => {
      try {
        const result = await task();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    queue.push(wrappedTask);
    processQueue();
  });
}

// Add a function to clear the queue if needed
export function clearQueue() {
  queue.length = 0;
  consecutiveFailures = 0;
}