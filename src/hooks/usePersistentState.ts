import { useState, useEffect } from 'react';
import { z } from 'zod';

export function usePersistentState<T>(
  key: string,
  defaultValue: T,
  schema?: z.ZodSchema<T>
) {
  const [state, setState] = useState<T>(() => {
    // Try to load from localStorage first
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(key);
        if (saved) {
          const parsed = JSON.parse(saved);
          // Validate with schema if provided
          if (schema) {
            const result = schema.safeParse(parsed);
            if (result.success) {
              return result.data;
            } else {
              console.warn(`Invalid data in localStorage for key "${key}":`, result.error);
              // Remove invalid data
              localStorage.removeItem(key);
            }
          }
          return parsed;
        }
      } catch (error) {
        console.error(`Error loading from localStorage for key "${key}":`, error);
        // Remove corrupted data
        localStorage.removeItem(key);
      }
    }
    return defaultValue;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(key, JSON.stringify(state));
      } catch (error) {
        console.error(`Error saving to localStorage for key "${key}":`, error);
      }
    }
  }, [key, state]);

  return [state, setState] as const;
}
