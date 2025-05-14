/**
 * TypeScript declaration file for lodash modules
 * This ensures TypeScript recognizes lodash imports properly
 */

declare module 'lodash/debounce' {
  /**
   * Creates a debounced function that delays invoking `func` until after `wait` milliseconds
   * have elapsed since the last time the debounced function was invoked.
   * 
   * @param func The function to debounce
   * @param wait The number of milliseconds to delay
   * @param options The options object
   * @returns Returns the new debounced function
   */
  export default function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait?: number,
    options?: {
      leading?: boolean;
      trailing?: boolean;
      maxWait?: number;
    }
  ): T & {
    /**
     * Cancels any pending invocation of the debounced function.
     */
    cancel(): void;
    
    /**
     * Immediately invokes any pending invocation of the debounced function.
     */
    flush(): ReturnType<T>;
  };
} 