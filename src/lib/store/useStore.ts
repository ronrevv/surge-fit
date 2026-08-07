"use client";

import { useEffect, useReducer } from "react";
import { store } from "./orgStore";

/**
 * Subscribe to the org store and re-render on any change.
 * Returns the store singleton so components can call store.* methods directly.
 */
export function useStore() {
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    const unsubscribe = store.subscribe(forceUpdate);
    return () => { unsubscribe(); };
  }, []);

  return store;
}
