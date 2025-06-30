import { QueryClient, QueryFunction } from "@tanstack/react-query";

// Simple memory cache to avoid repeated identical API calls
const apiCache = new Map<string, { data: unknown, timestamp: number }>(); // Changed any to unknown
const CACHE_TTL = 60000; // 1 minute cache TTL for API requests
const MAX_CACHE_SIZE = 50; // Maximum number of cached requests

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Helper to generate a cache key from request details
function generateCacheKey(url: string, method: string, data?: unknown): string {
  return `${method}:${url}:${data ? JSON.stringify(data) : ''}`;
}

// Helper to clean up old cache entries when the cache gets too large
function cleanupCache() {
  if (apiCache.size > MAX_CACHE_SIZE) {
    // Sort entries by timestamp and remove the oldest ones
    const entries = Array.from(apiCache.entries());
    const sortedEntries = entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove the oldest entries to get below the limit
    const entriesToRemove = sortedEntries.slice(0, entries.length - MAX_CACHE_SIZE);
    entriesToRemove.forEach(([key]) => {
      apiCache.delete(key);
    });
  }
}

export async function apiRequest( // Removed unused generic <T = any>
  method: string,
  url: string,
  options?: RequestInit,
): Promise<Response> {
  // Only cache GET requests
  if (method === 'GET' && !options?.body) { // Ensure options is checked before accessing body
    const cacheKey = generateCacheKey(url, method, undefined);
    const cachedResponse = apiCache.get(cacheKey);
    
    // Return cached response if it's still valid
    if (cachedResponse && (Date.now() - cachedResponse.timestamp) < CACHE_TTL) {
      return new Response(JSON.stringify(cachedResponse.data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  
  const token = localStorage.getItem("authToken");
  const authHeaders: HeadersInit = {};
  if (token) {
    authHeaders['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    method,
    headers: {
      ...options?.headers,
      ...authHeaders, // Add Authorization header if token exists
    },
    // credentials: "include", // Typically not needed if using Bearer token auth; keep if also using cookies for other things
  });

  // Cache successful GET responses
  if (method === 'GET' && res.ok && !options?.body) { // Ensure options is checked
    try {
      const clonedRes = res.clone();
      const responseData = await clonedRes.json();
      
      const cacheKey = generateCacheKey(url, method, undefined);
      apiCache.set(cacheKey, { 
        data: responseData, 
        timestamp: Date.now() 
      });
      
      // Clean up cache if it's too large
      cleanupCache();
    } catch (error) {
      console.error("Failed to cache response:", error);
    }
  }
  
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey, signal }) => {
    const url = queryKey[0] as string;
    
    // Use our cached API request function
    try {
      const response = await fetch(url, {
        credentials: "include",
        signal, // Pass the AbortSignal to allow query cancellation
      });
      
      if (unauthorizedBehavior === "returnNull" && response.status === 401) {
        return null;
      }
  
      await throwIfResNotOk(response);
      
      // Parse JSON with optimization for large responses
      const data = await response.json();
      
      // Cache successful responses
      const cacheKey = generateCacheKey(url, 'GET', undefined);
      apiCache.set(cacheKey, { 
        data, 
        timestamp: Date.now() 
      });
      
      return data;
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') {
        // Handle query cancellation gracefully
        console.log('Query was cancelled');
      }
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes - data stays fresh longer
      gcTime: 1000 * 60 * 30, // 30 minutes - keep unused data in cache longer (formerly cacheTime)
      retry: 1, // Only retry once for failed queries
    },
    mutations: {
      retry: false,
    },
  },
});
