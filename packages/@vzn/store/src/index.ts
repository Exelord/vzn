import { createContext, createState, useContext } from "@vzn/core";

export interface StoreFunction<T> {
  (...args: any): T;
}

export interface StoreConstructor<T> {
  new(...args: any): T
}

export type StoreType<T> = StoreFunction<T> | StoreConstructor<T>;

export class StoreRegistry {
  private registry = new Map();

  lookup<T>(key: StoreType<T>): T | undefined {
    return this.registry.get(key);
  }

  has<T>(key: StoreType<T>): boolean {
    return this.registry.has(key);
  }

  register<T>(key: StoreType<T>, value: T): T {
    this.registry.set(key, value);
    return value;
  }
}

export const StoreRegistryContext = createContext(new StoreRegistry());

export function useStoreRegistry() {
  return useContext(StoreRegistryContext);
}

export function useStore<T>(storeCreator: StoreType<T>, args: any[] = []): T {
  const registry = useStoreRegistry();
  
  if (registry.has(storeCreator)) {
    return registry.lookup<T>(storeCreator)!;
  }

  return registry.register(storeCreator, createState(storeCreator, ...args));
}