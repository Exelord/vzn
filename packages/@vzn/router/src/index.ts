import { createState, createContext, useContext } from "@vzn/core";

export type StoreConstructor<T> = () => T;

export class StoreRegistry {
  private registry = new Map();

  lookup<T>(key: StoreConstructor<T>): T | undefined {
    return this.registry.get(key);
  }

  register<T>(key: StoreConstructor<T>, value: T): T {
    this.registry.set(key, value);
    return value;
  }
}

export const StoreRegistryContext = createContext(new StoreRegistry());

export function useStoreRegistry() {
  return useContext(StoreRegistryContext);
}

export function useStore<T>(storeConstructor: StoreConstructor<T>): T {
  const registry = useStoreRegistry();
  const registration = registry.lookup<T>(storeConstructor);
  return registration || registry.register(storeConstructor, createState(storeConstructor()));
}